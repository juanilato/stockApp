import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Producto, actualizarProducto, eliminarProducto, insertarProducto, obtenerProductos, setupProductosDB } from '../../services/db';

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [nombre, setNombre] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [stock, setStock] = useState('');
  const router = useRouter();

  useEffect(() => {
    console.log('Productos page mounted');
    setupProductosDB();
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    console.log('Cargando productos...');
    try {
      await obtenerProductos((productos) => {
        console.log('Productos cargados:', productos);
        setProductos(productos);
      });
    } catch (error) {
      console.error('Error al cargar productos:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setPrecioVenta('');
    setPrecioCosto('');
    setStock('');
    setEditingProduct(null);
  };

  const abrirModal = (producto?: Producto) => {
    if (producto) {
      setEditingProduct(producto);
      setNombre(producto.nombre);
      setPrecioVenta(producto.precioVenta.toString());
      setPrecioCosto(producto.precioCosto.toString());
      setStock(producto.stock.toString());
    } else {
      limpiarFormulario();
    }
    setModalVisible(true);
  };

  const guardarProducto = async () => {
    if (!nombre || !precioVenta || !precioCosto || !stock) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    const precioVentaNum = parseFloat(precioVenta);
    const precioCostoNum = parseFloat(precioCosto);

    if (precioCostoNum >= precioVentaNum) {
      Alert.alert('Error', 'El precio de costo no puede ser mayor o igual al precio de venta');
      return;
    }

    const producto: Producto = {
      nombre,
      precioVenta: precioVentaNum,
      precioCosto: precioCostoNum,
      stock: parseInt(stock)
    };

    console.log('Guardando producto:', producto);

    try {
      if (editingProduct?.id) {
        console.log('Actualizando producto existente');
        await actualizarProducto({ ...producto, id: editingProduct.id }, () => {
          console.log('Producto actualizado exitosamente');
          Alert.alert('Éxito', 'Producto actualizado correctamente');
          setModalVisible(false);
          cargarProductos();
        });
      } else {
        console.log('Insertando nuevo producto');
        await insertarProducto(producto, () => {
          console.log('Producto insertado exitosamente');
          Alert.alert('Éxito', 'Producto agregado correctamente');
          setModalVisible(false);
          cargarProductos();
        });
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
      Alert.alert('Error', 'No se pudo guardar el producto');
    }
  };

  const confirmarEliminar = async (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro que desea eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarProducto(id, cargarProductos);
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Producto }) => (
    <View style={styles.productoItem}>
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre}>{item.nombre}</Text>
        <Text>Precio de Venta: ${item.precioVenta}</Text>
        <Text>Precio de Costo: ${item.precioCosto}</Text>
        <Text>Stock: {item.stock}</Text>
      </View>
      <View style={styles.productoAcciones}>
        <TouchableOpacity
          style={[styles.boton, styles.botonEditar]}
          onPress={() => abrirModal(item)}
        >
          <Text style={styles.botonTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.boton, styles.botonEliminar]}
          onPress={() => confirmarEliminar(item.id!)}
        >
          <Text style={styles.botonTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Gestión de Productos',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.content}>
        <FlatList
          data={productos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() || ''}
          style={styles.lista}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No hay productos agregados</Text>
          )}
        />

        <TouchableOpacity
          style={styles.botonAgregar}
          onPress={() => abrirModal()}
        >
          <Text style={styles.botonAgregarTexto}>+ Agregar Producto</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              value={nombre}
              onChangeText={setNombre}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Precio de venta"
              value={precioVenta}
              onChangeText={setPrecioVenta}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Precio de costo"
              value={precioCosto}
              onChangeText={setPrecioCosto}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Stock"
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
            />

            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={[styles.boton, styles.botonCancelar]}
                onPress={() => {
                  setModalVisible(false);
                  limpiarFormulario();
                }}
              >
                <Text style={styles.botonTexto}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.boton, styles.botonGuardar]}
                onPress={guardarProducto}
              >
                <Text style={styles.botonTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginLeft: 10,
    padding: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  lista: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
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
  productoInfo: {
    marginBottom: 10,
  },
  productoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  productoAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  boton: {
    padding: 8,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  botonEditar: {
    backgroundColor: '#2196F3',
  },
  botonEliminar: {
    backgroundColor: '#f44336',
  },
  botonCancelar: {
    backgroundColor: '#757575',
  },
  botonGuardar: {
    backgroundColor: '#4CAF50',
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  botonAgregar: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  botonAgregarTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});