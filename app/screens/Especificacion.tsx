import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from './model/Product';

export type Params = {
  product: Product;
};

// Definición de tipos para las rutas y la navegación
type RootStackParamList = {
    Especificacion: {
      nombre: string;
      precio: number;
      minStock: number;
      currentStock: number;
      maxStock: number;
      // Puedes agregar más propiedades si es necesario
    };
  };
  
  type EspecificacionScreenRouteProp = RouteProp<RootStackParamList, 'Especificacion'>;
  type EspecificacionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Especificacion'>;
  
  type Props = {
    route: EspecificacionScreenRouteProp;
    navigation: EspecificacionScreenNavigationProp;
  };

const Especificacion = ({ route }: Props) => {
  const { nombre, precio, minStock, currentStock, maxStock } = route.params;

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.header}>{nombre}</Text>
        <View style={styles.row}>
          <Text style={[styles.col, styles.text]}>Existencias: </Text>
          <Text style={[styles.colAuto, styles.text]}>
            <Text 
              style={[currentStock < minStock ? styles.stockError : null]}>{currentStock}
            </Text>{' '}/{maxStock}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.col, styles.text]}>Precio: </Text>
          <Text style={[styles.colAuto, styles.text]}>${precio.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.row}>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
      fontSize: 20
  },
  page: {
    borderBottomColor: '#FFFFFF',
      backgroundColor: 'white',
      fontSize: 20
  },
  header: {
    fontSize: 48,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  col: {
    flexGrow: 999,
  },
  colAuto: {

  },
  stockError: {
    color:'red',
  },
});

export default Especificacion;