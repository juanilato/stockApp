import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Producto, obtenerProductos } from '../services/db';

type RootStackParamList = {
  Dashboard: undefined;
  'Nueva Venta': undefined;
  'Productos': undefined;
};

type DashboardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

export default function Dashboard({ navigation }: Props) {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    obtenerProductos((productos) => {
      setProductos(productos);
    });
  };

  const renderItem = ({ item }: { item: Producto }) => (
    <View style={styles.productoItem}>
      <Text style={styles.productoNombre}>{item.nombre}</Text>
      <Text>Precio: ${item.precioVenta}</Text>
      <Text>Stock: {item.stock}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>App de Ventas</Text>
      
      <View style={styles.botonesContainer}>
        <TouchableOpacity
          style={[styles.boton, styles.botonVenta]}
          onPress={() => navigation.navigate('Nueva Venta')}
        >
          <Text style={styles.botonTexto}>Nueva Venta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, styles.botonProductos]}
          onPress={() => navigation.navigate('Productos')}
        >
          <Text style={styles.botonTexto}>Gestión de Productos</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>Últimos Productos</Text>
      <FlatList
        data={productos.slice(0, 5)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        style={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  boton: {
    padding: 15,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  botonVenta: {
    backgroundColor: '#2196F3',
  },
  botonProductos: {
    backgroundColor: '#4CAF50',
  },
  botonTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lista: {
    flex: 1,
  },
  productoItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
});
