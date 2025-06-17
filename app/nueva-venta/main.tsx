import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { insertarVenta } from '../../services/db';

export default function NuevaVenta() {
  const router = useRouter();
  const [producto, setProducto] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [cantidad, setCantidad] = useState('');

  const guardar = () => {
    const venta = {
      producto,
      precioVenta: parseFloat(precioVenta),
      precioCosto: parseFloat(precioCosto),
      cantidad: parseInt(cantidad),
      fecha: new Date().toISOString()
    };

    insertarVenta(venta, () => {
      Alert.alert("Venta registrada");
      router.back();
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Registrar Venta' }} />
      <Text style={styles.title}>Nueva Venta</Text>
      <TextInput style={styles.input} placeholder="Producto" value={producto} onChangeText={setProducto} />
      <TextInput style={styles.input} placeholder="Precio Venta" value={precioVenta} onChangeText={setPrecioVenta} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Precio Costo" value={precioCosto} onChangeText={setPrecioCosto} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Cantidad" value={cantidad} onChangeText={setCantidad} keyboardType="numeric" />
      <TouchableOpacity style={styles.button} onPress={guardar}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});