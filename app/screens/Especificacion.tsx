import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';

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
    <View>
      <Text>Nombre: {nombre}</Text>
      <Text>Precio: {precio}</Text>
      <Text>Stock Mínimo: {minStock}</Text>
      <Text>Stock Actual: {currentStock}</Text>
      <Text>Stock Máximo: {maxStock}</Text>
    </View>
  );
};

export default Especificacion;