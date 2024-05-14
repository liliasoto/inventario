import React, { useState } from "react";
import { SafeAreaView, View, TextInput, Button, Alert } from "react-native";
import LocalDB from "../persistance/localdb";

export default function ProductAdd(): React.JSX.Element {
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
                <Button title="Agregar" onPress={handleAddProduct} />
            </View>
        </SafeAreaView>
    );
}
