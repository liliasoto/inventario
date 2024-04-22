import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { Product } from './model/Product';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

type RootStackParamList = {
    Home: undefined
};
type HomeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRoute = RouteProp<RootStackParamList, 'Home'>;

type HomeProps = {
    navigation: HomeScreenProps;
    route: HomeScreenRoute;
};


function Home({navigation}: HomeProps): React.JSX.Element {
    const [products, setProducts] = useState<Product[]>([]);
    const productItem = ({item}: {item:Product}) => (
        <TouchableOpacity style={styles.productItem}>
            <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column', flexGrow: 9}}>
                    <Text style={styles.itemTitle}>{item.nombre}</Text>
                    <Text style={styles.itemDetails}>Precio: ${item.precio.toFixed(2)}</Text>
                </View>
                <Text 
                    style={[
                    styles.itemBadge,
                    item.currentStock < item.minStock ? styles.itemBadgeError : null
                    ]}>
                    {item.currentStock}
                </Text>
            </View>
        </TouchableOpacity>
    );

    useEffect(() => {
        setProducts([
            {
                id: 1, 
                nombre: 'Martillo', 
                precio: 80,
                minStock: 5,
                currentStock: 2,
                maxStock: 20,
            },
            {
                id: 2, 
                nombre: 'Manguera (metro)', 
                precio: 15,
                minStock: 50,
                currentStock: 200,
                maxStock: 1000,
            }
        ])
    }, []);
    
    return(
        <SafeAreaView>
            <FlatList 
                data={products} 
                renderItem={productItem} 
                keyExtractor={item => item.id.toString()}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    productItem: {
        padding: 12,
        borderBottomColor: '#C0C0C0',
        borderBottomWidth: 1,
        backgroundColor: 'white',
    },
    itemTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        //textTransform: 'uppercase',
    },
    itemDetails: {
        fontSize: 17,
        opacity: 0.8
    },
    itemBadge: {
        fontSize: 24,
        color: 'blue',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    itemBadgeError: {
        fontSize: 24,
        color: 'red',
        fontWeight: 'bold',
        alignSelf: 'center'
    }
});

export default Home;