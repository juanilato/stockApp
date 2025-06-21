import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, TouchableOpacity, View } from 'react-native';
import CustomToast from '../../../components/CustomToast';
import { Producto, VarianteProducto } from '../../../services/db';
import { ToastType } from '../functions';
import ModalProducto from './ModalProducto';
import ScannerOverlay from './scannerOverlay';

interface Props {
  visible: boolean;
  productos: Producto[];
  onClose: () => void;
  onSubmit: (producto: Producto, esNuevo: boolean) => void; 
}

export default function ModalScanner({ visible, productos, onClose, onSubmit }: Props) {
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | undefined>(undefined);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [animandoConfirmacion, setAnimandoConfirmacion] = useState(false);
  const animWidth = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [codigoNoRegistrado, setCodigoNoRegistrado] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastType>(null);

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
      } else {
        setProductoSeleccionado({
          nombre: '',
          precioCosto: 0,
          precioVenta: 0,
          stock: 0,
          codigoBarras: codigo,
        } as Producto);
        setCodigoNoRegistrado(codigo);
      }

      setMostrarModalProducto(true);
    }, 1500);
  };

  const cerrarTodo = () => {
    setScanned(false);
    setMostrarModalProducto(false);
    setProductoSeleccionado(null);
    setVarianteSeleccionada(undefined);
    setToast(null);
    onClose();
  };

  const handleSubmit = (producto: Producto, esNuevo: boolean) => {
    onSubmit(producto, codigoNoRegistrado ? true : esNuevo);
    
    // Mostrar toast de éxito
    setToast({
      type: 'success',
      message: esNuevo ? 'Producto creado correctamente' : 'Producto editado correctamente',
    });

    setMostrarModalProducto(false);
    setScanned(false);
    setProductoSeleccionado(null);
    setVarianteSeleccionada(undefined);
    setCodigoNoRegistrado(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView
          style={{ flex: 1 }}
          onBarcodeScanned={({ data }) => handleBarcodeScanned(data)}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13'],
          }}
        >
          <ScannerOverlay confirmado={animandoConfirmacion} />
        </CameraView>

        {/* Botón de cerrar cámara */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 40,
            right: 20,
            backgroundColor: 'rgba(255,255,255,0.85)',
            padding: 10,
            borderRadius: 20,
          }}
          onPress={cerrarTodo}
        >
          <MaterialCommunityIcons name="close" size={24} color="#000" />
        </TouchableOpacity>

        {/* Modal de edición de producto por encima */}
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
          onSubmit={handleSubmit}
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
