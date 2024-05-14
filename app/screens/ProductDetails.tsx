import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Button, TextInput, Alert, Modal, Pressable, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App.tsx';
import { StackNavigationProp } from '@react-navigation/stack';
import { Product } from './model/Product.ts';
import LocalDB from '../persistance/localdb.ts';
import { Movimiento } from './model/Movimiento.ts';

export type Params = {
  product: Product;
  movimiento: Movimiento;
};

export type Props = {
  route: RouteProp<RootStackParamList, 'ProductDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

function ProductDetails({ route, navigation }: Props): React.JSX.Element {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [quantity, setQuantity] = useState("");
  const [action, setAction] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setProduct(route.params.product);
    loadMovimientos();
  }, [route]);

  const loadMovimientos = async () => {
    try {
      if (!product || !product.id) {
        return;
      }

      const db = await LocalDB.connect();
      const result = await db.executeSql('SELECT * FROM movimientos WHERE productoId = ?', [product.id]);

      if (result && result[0]) {
        const { rows } = result[0];
        const movimientos = [];
        for (let i = 0; i < rows.length; i++) {
          movimientos.push(rows.item(i));
        }
        setMovimientos(movimientos);
      }
    } catch (error) {
      console.error('Error al cargar los movimientos:', error);
    }
  };

  const handleStockAction = async () => {
    if (!quantity || !action) {
      Alert.alert("Error", "Por favor ingresa la cantidad y selecciona una acción");
      return;
    }
    // Verificar si product.id es undefined
    if (!product || product.id === undefined) {
      return;
    }

    try {
      const parsedQuantity = parseInt(quantity);

      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        Alert.alert("Error", "La cantidad debe ser un número positivo");
        return;
      }

      // Conectar con la base de datos
      const db = await LocalDB.connect();

      let updateStatement = "";
      if (action === "add") {
        updateStatement = `UPDATE productos SET currentStock = currentStock + ? WHERE id = ?;`;
      } else if (action === "remove") {
        if (product && parsedQuantity > product.currentStock) {
          Alert.alert("Error", "No puedes reducir más stock del que tienes");
          return;
        }
        updateStatement = `UPDATE productos SET currentStock = currentStock - ? WHERE id = ?;`;
      }

      // Realizar la acción en la base de datos
      await db.executeSql(updateStatement, [parsedQuantity, product?.id]);

      // Actualizar el estado local del producto
      setProduct(prevProduct => prevProduct && {
        ...prevProduct,
        currentStock: action === "add" ?
          (prevProduct.currentStock || 0) + parsedQuantity :
          (prevProduct.currentStock || 0) - parsedQuantity
      });

      // Insertar el movimiento en el estado local de movimientos
      const nuevoMovimiento: Movimiento = {
        id: movimientos.length + 1,
        productoId: product.id,
        cantidad: action === "add" ? parsedQuantity : -parsedQuantity,
        fecha: new Date().toISOString(),
      };
      setMovimientos([...movimientos, nuevoMovimiento]);

      // Limpiar el input
      setQuantity("");

      Alert.alert("Éxito", `Stock ${action === "add" ? "aumentado" : "reducido"} correctamente`);
    } catch (error) {
      console.error(`Error al ${action === "add" ? "aumentar" : "reducir"} el stock:`, error);
      Alert.alert("Error", `Hubo un problema al ${action === "add" ? "aumentar" : "reducir"} el stock`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {product && (
        <View style={styles.productContainer}>
          <View>
            <Text style={styles.label}>Name: </Text>
            <Text>{product.nombre}</Text>
            <Text style={styles.label}>Price:</Text>
            <Text>{product.precio}</Text>
            <Text style={styles.label}>Minimum Stock:</Text>
            <Text>{product.minStock}</Text>
            <Text style={styles.label}>Current Stock:</Text>
            <Text>{product.currentStock}</Text>
            <Text style={styles.label}>Maximum Stock:</Text>
            <Text>{product.maxStock}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Agregar Stock" onPress={() => { setAction("add"); setModalVisible(true); }} />
            <Button title="Quitar Stock" onPress={() => { setAction("remove"); setModalVisible(true); }} />
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput
                  style={styles.input}
                  placeholder="Cantidad"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
                <View style={styles.modalButtonContainer}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setQuantity("");
                    }}
                  >
                    <Text style={styles.textStyle}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonSave]}
                    onPress={() => { handleStockAction(); setModalVisible(!modalVisible); }}
                  >
                    <Text style={styles.textStyle}>Guardar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          <Text style={styles.label}>Movimientos:</Text>
          <ScrollView style={styles.scrollView}>
              {movimientos.map((movimiento, index) => (
                <View key={index} style={styles.movimientoItem}>
                  <Text>ID: {movimiento.id}</Text>
                  <Text>Cantidad: {movimiento.cantidad}</Text>
                  <Text>Fecha: {movimiento.fecha}</Text>
                </View>
              ))}
            </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productContainer: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: '#FF6347',
  },
  buttonSave: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  scrollView: {
    flex: 1,
  },
  movimientoItem: {
    marginBottom: 10,
  },
});

export default ProductDetails;