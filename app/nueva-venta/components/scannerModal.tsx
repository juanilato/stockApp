import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomToast from '../../../components/CustomToast';
import { Producto, VarianteProducto } from '../../../services/db';
import ModalProducto from '../../productos/components/ModalProducto';
import ScannerOverlay from '../../productos/components/scannerOverlay';
import { ToastType } from '../../productos/functions';

interface Props {
  visible: boolean;
  productos: Producto[];
  onClose: () => void;
  onAgregarProducto: (producto: Producto, cantidad: number, variante?: VarianteProducto) => void;
}

export default function ScannerModal({ visible, productos, onClose, onAgregarProducto }: Props) {
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | undefined>(undefined);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [animandoConfirmacion, setAnimandoConfirmacion] = useState(false);
  const [cantidad, setCantidad] = useState('1');
  const [modalCantidadVisible, setModalCantidadVisible] = useState(false);
  const [codigoNoRegistrado, setCodigoNoRegistrado] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastType>(null);
  const [productosEscaneados, setProductosEscaneados] = useState<Array<{producto: Producto, cantidad: number, variante?: VarianteProducto}>>([]);

  const animWidth = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animandoConfirmacion) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [animandoConfirmacion, pulseAnim]);

  const handleBarcodeScanned = (codigo: string) => {
    if (scanned) return;
    setScanned(true);

    setAnimandoConfirmacion(true);
    animWidth.setValue(0);
    animOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(animWidth, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(animOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();

    setTimeout(() => {
      setAnimandoConfirmacion(false);

      const producto = productos.find(p =>
        p.codigoBarras === codigo || p.variantes?.some(v => v.codigoBarras === codigo)
      );

      if (producto) {
        const variante = producto.variantes?.find(v => v.codigoBarras === codigo);
        setProductoSeleccionado(producto);
        setVarianteSeleccionada(variante);
        setModalCantidadVisible(true);
      } else {
        setProductoSeleccionado({
          nombre: '',
          precioCosto: 0,
          precioVenta: 0,
          stock: 0,
          codigoBarras: codigo,
        } as Producto);
        setCodigoNoRegistrado(codigo);
        setMostrarModalProducto(true);
      }
    }, 1500);
  };

  const handleAgregarProducto = () => {
    if (productoSeleccionado) {
      const cantidadNum = parseInt(cantidad) || 1;
      onAgregarProducto(productoSeleccionado, cantidadNum, varianteSeleccionada);
      
      // Agregar a la lista de productos escaneados
      setProductosEscaneados(prev => [...prev, {
        producto: productoSeleccionado,
        cantidad: cantidadNum,
        variante: varianteSeleccionada
      }]);

      setToast({
        type: 'success',
        message: `${productoSeleccionado.nombre} agregado (${cantidadNum})`,
      });

      // Resetear para el siguiente escaneo
      setModalCantidadVisible(false);
      setCantidad('1');
      setProductoSeleccionado(null);
      setVarianteSeleccionada(undefined);
      setScanned(false);
    }
  };

  const cerrarTodo = () => {
    setScanned(false);
    setMostrarModalProducto(false);
    setModalCantidadVisible(false);
    setProductoSeleccionado(null);
    setVarianteSeleccionada(undefined);
    setCantidad('1');
    setToast(null);
    setProductosEscaneados([]);
    onClose();
  };

  const handleSubmitProducto = (producto: Producto, esNuevo: boolean) => {
    if (esNuevo) {
      setToast({
        type: 'success',
        message: 'Producto creado correctamente',
      });
    } else {
      setToast({
        type: 'success',
        message: 'Producto editado correctamente',
      });
    }

    setMostrarModalProducto(false);
    setScanned(false);
    setProductoSeleccionado(null);
    setVarianteSeleccionada(undefined);
    setCodigoNoRegistrado(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={({ data }) => handleBarcodeScanned(data)}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13'],
          }}
        >
          <ScannerOverlay confirmado={animandoConfirmacion} />
        </CameraView>

        {/* Header con botones */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={cerrarTodo}>
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Escanear Productos</Text>
            <Text style={styles.headerSubtitle}>
              {productosEscaneados.length} productos escaneados
            </Text>
          </View>

          <TouchableOpacity style={styles.finishButton} onPress={cerrarTodo}>
            <MaterialCommunityIcons name="check" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Lista de productos escaneados */}
        {productosEscaneados.length > 0 && (
          <View style={styles.scannedProductsContainer}>
            <Text style={styles.scannedProductsTitle}>Productos Escaneados:</Text>
            <View style={styles.scannedProductsList}>
              {productosEscaneados.map((item, index) => (
                <View key={index} style={styles.scannedProductItem}>
                  <Text style={styles.scannedProductName}>
                    {item.producto.nombre}
                    {item.variante && ` - ${item.variante.nombre}`}
                  </Text>
                  <Text style={styles.scannedProductQuantity}>
                    x{item.cantidad}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Modal de cantidad */}
        <Modal
          visible={modalCantidadVisible}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cantidad</Text>
              <Text style={styles.modalSubtitle}>
                {productoSeleccionado?.nombre}
                {varianteSeleccionada && ` - ${varianteSeleccionada.nombre}`}
              </Text>
              
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => {
                    const newCantidad = Math.max(1, parseInt(cantidad) - 1);
                    setCantidad(newCantidad.toString());
                  }}
                >
                  <MaterialCommunityIcons name="minus" size={24} color="#3b82f6" />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{cantidad}</Text>
                
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => {
                    const newCantidad = parseInt(cantidad) + 1;
                    setCantidad(newCantidad.toString());
                  }}
                >
                  <MaterialCommunityIcons name="plus" size={24} color="#3b82f6" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalCantidadVisible(false);
                    setCantidad('1');
                    setProductoSeleccionado(null);
                    setVarianteSeleccionada(undefined);
                    setScanned(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleAgregarProducto}
                >
                  <Text style={styles.confirmButtonText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de producto (para productos no registrados) */}
        <ModalProducto
          visible={mostrarModalProducto}
          productoEditado={productoSeleccionado}
          variante={varianteSeleccionada}
          codigoNoRegistrado={codigoNoRegistrado}
          onClose={() => {
            setMostrarModalProducto(false);
            setScanned(false);
            setProductoSeleccionado(null);
            setVarianteSeleccionada(undefined);
            setCodigoNoRegistrado(null);
          }}
          onSubmit={handleSubmitProducto}
        />

        {/* Toast */}
        {toast && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 20,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 2,
  },
  finishButton: {
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 20,
  },
  scannedProductsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: 200,
  },
  scannedProductsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  scannedProductsList: {
    maxHeight: 120,
  },
  scannedProductItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  scannedProductName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  scannedProductQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  quantityButton: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    minWidth: 40,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  confirmButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
