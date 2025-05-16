import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Producto, obtenerProductos } from '../../services/db';

export default function VentasView() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<{ producto: Producto; cantidad: number }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCantidadVisible, setModalCantidadVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState('1');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const productos = await obtenerProductos('productos');  
      if (productos) {
        setProductos(productos);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const productoData = JSON.parse(data);
      const producto = productos.find(p => p.id === productoData.id);
      if (producto) {
        setProductoSeleccionado(producto);
        setModalCantidadVisible(true);
      } else {
        Alert.alert('Error', 'Producto no encontrado');
      }
    } catch (error) {
      console.error('Error al procesar código QR:', error);
      Alert.alert('Error', 'Código QR inválido');
    }
    setScannerVisible(false);
  };

  const agregarProducto = () => {
    if (productoSeleccionado && cantidad) {
      const cantidadNum = parseInt(cantidad);
      if (cantidadNum > 0) {
        const existente = productosSeleccionados.find(
          (p) => p.producto.id === productoSeleccionado.id
        );

        if (existente) {
          setProductosSeleccionados(
            productosSeleccionados.map((p) =>
              p.producto.id === productoSeleccionado.id
                ? { ...p, cantidad: p.cantidad + cantidadNum }
                : p
            )
          );
        } else {
          setProductosSeleccionados([
            ...productosSeleccionados,
            { producto: productoSeleccionado, cantidad: cantidadNum },
          ]);
        }

        setModalCantidadVisible(false);
        setCantidad('1');
        setProductoSeleccionado(null);
      }
    }
  };

  const eliminarProducto = (id: number) => {
    setProductosSeleccionados(
      productosSeleccionados.filter((p) => p.producto.id !== id)
    );
  };

  const calcularTotal = () => {
    return productosSeleccionados.reduce(
      (total, { producto, cantidad }) => total + producto.precioVenta * cantidad,
      0
    );
  };

  const renderItem = ({ item }: { item: Producto }) => (
    <TouchableOpacity
      style={styles.productoItem}
      onPress={() => {
        setProductoSeleccionado(item);
        setModalCantidadVisible(true);
      }}
    >
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre}>{item.nombre}</Text>
        <Text style={styles.productoPrecio}>${item.precioVenta}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!permission) {
    return <View style={styles.container}><Text>Cargando permisos de cámara...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitamos tu permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Nueva Venta</Text>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScannerVisible(true)}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
          <Text style={styles.scanButtonText}>Escanear QR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listaContainer}>
        <Text style={styles.subtitulo}>Productos Seleccionados</Text>
        {productosSeleccionados.map(({ producto, cantidad }) => (
          <View key={producto.id} style={styles.productoSeleccionado}>
            <View style={styles.productoSeleccionadoInfo}>
              <Text style={styles.productoSeleccionadoNombre}>
                {producto.nombre}
              </Text>
              <Text style={styles.productoSeleccionadoCantidad}>
                Cantidad: {cantidad}
              </Text>
              <Text style={styles.productoSeleccionadoPrecio}>
                ${producto.precioVenta * cantidad}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.botonEliminar}
              onPress={() => eliminarProducto(producto.id!)}
            >
              <MaterialCommunityIcons name="delete" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalTexto}>Total:</Text>
        <Text style={styles.totalValor}>${calcularTotal()}</Text>
      </View>

      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
        <Text style={styles.botonAgregarTexto}>Agregar Producto</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Producto</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={productos}
              renderItem={renderItem}
              keyExtractor={(item) => item.id?.toString() || ''}
              style={styles.lista}
              contentContainerStyle={styles.listaContent}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalCantidadVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalCantidadVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cantidad</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalCantidadVisible(false);
                  setCantidad('1');
                  setProductoSeleccionado(null);
                }}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={cantidad}
              onChangeText={setCantidad}
              keyboardType="numeric"
              placeholder="Cantidad"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setModalCantidadVisible(false);
                  setCantidad('1');
                  setProductoSeleccionado(null);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={agregarProducto}
              >
                <Text style={styles.buttonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={scannerVisible}
        animationType="slide"
        onRequestClose={() => setScannerVisible(false)}
      >
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={scannerVisible ? handleBarCodeScanned : undefined}
          >
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerHeader}>
                <TouchableOpacity
                  style={styles.scannerCloseButton}
                  onPress={() => setScannerVisible(false)}
                >
                  <MaterialCommunityIcons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.scannerFrame} />
              <Text style={styles.scannerText}>
                Apunta la cámara al código QR del producto
              </Text>
            </View>
          </CameraView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  listaContainer: {
    flex: 1,
    padding: 16,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  productoSeleccionado: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productoSeleccionadoInfo: {
    flex: 1,
    gap: 4,
  },
  productoSeleccionadoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  productoSeleccionadoCantidad: {
    fontSize: 14,
    color: '#64748b',
  },
  productoSeleccionadoPrecio: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  botonEliminar: {
    padding: 8,
  },
  totalContainer: {
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalTexto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalValor: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
  },
  scanButton: {
    backgroundColor: '#7c3aed',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  botonAgregar: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  botonAgregarTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  lista: {
    flex: 1,
  },
  listaContent: {
    paddingBottom: 16,
  },
  productoItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productoInfo: {
    gap: 4,
  },
  productoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  productoPrecio: {
    fontSize: 14,
    color: '#64748b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#f1f5f9',
  },
  buttonConfirm: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  scannerCloseButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 20,
  },
  scannerFrame: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'white',
    margin: 50,
    borderRadius: 20,
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },

}); 