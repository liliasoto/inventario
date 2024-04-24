
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from './app/screens/Home';
import Login from './app/screens/Login';
import Especificacion from './app/screens/Especificacion';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            headerShown: false,
            headerStyle: {backgroundColor:'#ffff00'},
          }}
        />
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Especificacion" component={Especificacion}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
