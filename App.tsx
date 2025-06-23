import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Dashboard from './screens/Dashboard';
import NuevaVenta from './screens/NuevaVenta';
import Productos from './screens/Productos';
import { setupProductosDB } from './services/db';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    setupProductosDB();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen 
            name="Dashboard" 
            component={Dashboard}
            options={({ navigation }) => ({
              title: 'Dashboard',
              headerStyle: { backgroundColor: '#4CAF50' },
              headerTintColor: '#fff',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Productos')}
                  style={{ marginRight: 15 }}
                >
                  <Ionicons name="cube-outline" size={24} color="white" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="Nueva Venta" 
            component={NuevaVenta}
            options={{
              title: 'Nueva Venta',
              headerStyle: { backgroundColor: '#4CAF50' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="Productos" 
            component={Productos}
            options={{
              title: 'Gestión de Productos',
              headerStyle: { backgroundColor: '#4CAF50' },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

