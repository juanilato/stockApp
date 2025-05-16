import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { insertarProducto } from '../services/db';

type RootStackParamList = {
  Dashboard: undefined;
  'Nueva Venta': undefined;
};

type NuevaVentaScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Nueva Venta'
>;

type Props = {
  navigation: NuevaVentaScreenNavigationProp;
};

export default function NuevaVenta({ navigation }: Props) {
  const [nombre, setNombre] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [stock, setStock] = useState('');

  const guardar = () => {
    const precioVentaNum = parseFloat(precioVenta);
    const precioCostoNum = parseFloat(precioCosto);

    if (precioCostoNum >= precioVentaNum) {
      Alert.alert('Error', 'El precio de costo no puede ser mayor o igual al precio de venta');
      return;
    }

    const producto = {
      nombre,
      precioVenta: precioVentaNum,
      precioCosto: precioCostoNum,
      stock: parseInt(stock)
    };

    insertarProducto(producto, () => {
      Alert.alert("Producto registrado");
      navigation.goBack();
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nombre del Producto</Text>
      <TextInput 
        style={{ borderBottomWidth: 1, marginBottom: 10 }} 
        value={nombre} 
        onChangeText={setNombre} 
      />
      <Text>Precio de Venta</Text>
      <TextInput 
        style={{ borderBottomWidth: 1, marginBottom: 10 }} 
        value={precioVenta} 
        onChangeText={setPrecioVenta} 
        keyboardType="numeric" 
      />
      <Text>Precio de Costo</Text>
      <TextInput 
        style={{ borderBottomWidth: 1, marginBottom: 10 }} 
        value={precioCosto} 
        onChangeText={setPrecioCosto} 
        keyboardType="numeric" 
      />
      <Text>Stock</Text>
      <TextInput 
        style={{ borderBottomWidth: 1, marginBottom: 20 }} 
        value={stock} 
        onChangeText={setStock} 
        keyboardType="numeric" 
      />
      <Button title="Guardar Producto" onPress={guardar} />
    </View>
  );
}
