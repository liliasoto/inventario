import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { SafeAreaView, Text , StyleSheet, View} from "react-native";
import { Product } from "./model/Product";
import { TouchableOpacity,FlatList } from "react-native-gesture-handler";
import { RootStackParamList } from "../../App";
import LocalDB from "../persistance/localdb";

type HomeScreenProps = StackNavigationProp<RootStackParamList,'Home'>;
type HomeScreenRoute = RouteProp<RootStackParamList, 'Home'>;

type HomeProps = {
    navigation: HomeScreenProps;
    route: HomeScreenRoute;
};

function Home({navigation}:HomeProps): React.JSX.Element{
    const[products, setProducts] = useState<Product[]>(
        []);
    const productItem = ({item} : {item:Product}) => (
        <TouchableOpacity style={style.productItem} onPress={() => navigation.push("ProductDetails", { product: item })}>

            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>

                <View style={{flexDirection:'column', flexGrow:9}}>

                    <Text style={style.itemTitle}>{item.nombre}</Text>
                    <Text style={style.itemDetails}> precio: $ {item.precio.toFixed(2)}</Text>

                </View>

                <Text 
                style={[
                    style.itemBadge, 
                    item.currentStock < item.minStock ? style.itemBadgeError : null,
                    ]}>
                    {item.currentStock}
                    </Text>

            </View>
        </TouchableOpacity>
    );
    
    useEffect(() => {
        LocalDB.init();
        navigation.addListener('focus',async ()=>{
            const db = await LocalDB.connect();
            db.transaction(async tx => {
                tx.executeSql(
                    'SELECT * FROM productos',
                    [],
                    (_,res) =>{
                    let prods = [];
                    for(let i = 0; i < res.rows.length; i++){
                        prods.push(res.rows.item(i));
                    }
                    setProducts(prods);
                },
                error => console.error({error}),
            );
            });
        })
    }, [navigation]);

  return (
    <SafeAreaView>
      <FlatList data={products} renderItem={productItem} keyExtractor={(item) => item.id.toString()} />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
    productItem:{
        padding:12, 
       },
       
        itemTitle:{
            fontSize:20,
        },
        itemDetails:{
            fontSize:14,
            opacity:0.7,
        },
        itemBadge:{
            fontSize:24,
            color:'green',
            alignSelf:'center'
        },
        itemBadgeError:{
            fontSize:24,
            color:'red'
        }
});

export default Home;