import React, { useState } from "react";
import { SafeAreaView, View, TextInput, Button, Alert } from "react-native";
import LocalDB from "../persistance/localdb";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import WebServiceParams from "./WebServiceParams";

type ProductAddScreenProps = StackNavigationProp<RootStackParamList,'ProductAdd'>;
type ProductAddRoute = RouteProp<RootStackParamList, 'ProductAdd'>;

type ProductAddProps = {
    navigation: ProductAddScreenProps;
    route: ProductAddRoute;
};

function ProductAdd({navigation}:ProductAddProps): React.JSX.Element{
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [minStock, setMinStock] = useState("");
    const [currentStock, setCurrentStock] = useState("");
    const [maxStock, setMaxStock] = useState("");

    const handleAddProduct = async () => {
        try {
            // Validar los datos antes de insertar
            if (!nombre || !precio || !minStock || !currentStock || !maxStock) {
                Alert.alert("Error", "Por favor ingresa todos los campos");
                return;
            }

            // Conectar con la base de datos
            const db = await LocalDB.connect();

            // Insertar el nuevo producto
            await db.executeSql(
                `INSERT INTO productos (nombre, precio, minStock, currentStock, maxStock) VALUES (?, ?, ?, ?, ?);`,
                [nombre, precio, minStock, currentStock, maxStock]
            );

            // Limpiar los campos después de la inserción exitosa
            setNombre("");
            setPrecio("");
            setMinStock("");
            setCurrentStock("");
            setMaxStock("");

            Alert.alert("Éxito", "Producto agregado correctamente");
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            Alert.alert("Error", "Hubo un problema al agregar el producto");
        }
    };

    const btnGuardarOnPress = async () => {
        const db = await LocalDB.connect();
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO productos (nombre, precio, minStock) VALUES (?, ?, ?)',
                [nombre, precio, minStock],
            );
            navigation.goBack();
        });
        const response = await fetch(
            `http://${WebServiceParams.host}:${WebServiceParams.port}/productos`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({nombre, precio, minStock}),
            }
        );
    };

    return (
        <SafeAreaView>
            <View>
                <TextInput
                    placeholder="Nombre"
                    value={nombre}
                    onChangeText={setNombre}
                />
                <TextInput
                    placeholder="Precio"
                    value={precio}
                    onChangeText={setPrecio}
                    keyboardType="numeric"
                />
                <TextInput
                    placeholder="Stock mínimo"
                    value={minStock}
                    onChangeText={setMinStock}
                    keyboardType="numeric"
                />
                <TextInput
                    placeholder="Stock actual"
                    value={currentStock}
                    onChangeText={setCurrentStock}
                    keyboardType="numeric"
                />
                <TextInput
                    placeholder="Stock máximo"
                    value={maxStock}
                    onChangeText={setMaxStock}
                    keyboardType="numeric"
                />
                <Button title="Agregar" onPress={btnGuardarOnPress} />
            </View>
        </SafeAreaView>
    );
}

export default ProductAdd;