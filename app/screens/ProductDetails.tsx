import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App.tsx';
import { StackNavigationProp } from '@react-navigation/stack';
import { Product } from './model/Product.ts';

export type Params = {
  product: Product;
};

export type Props = {
  route: RouteProp<RootStackParamList, 'ProductDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

function ProductDetails({ route }: Props): React.JSX.Element {
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    setProduct(route.params.product);
  }, [route]);

  return (
    <SafeAreaView style={styles.container}>
      {product && (
        <View style={styles.productContainer}>
          <Text style={styles.label}>Name:</Text>
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});

export default ProductDetails;