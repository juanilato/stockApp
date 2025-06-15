import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import React, { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { Producto, VarianteProducto } from '../../../services/db';
import ModalProducto from './ModalProducto'; // Ajustá el path

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

  const handleBarcodeScanned = (codigo: string) => {
    if (scanned) return;
    setScanned(true);

    const producto = productos.find(p =>
      p.codigoBarras === codigo || p.variantes?.some(v => v.codigoBarras === codigo)
    );

    if (producto) {
      const variante = producto.variantes?.find(v => v.codigoBarras === codigo);
      setProductoSeleccionado(producto);
      setVarianteSeleccionada(variante);
      setMostrarModalProducto(true);
    } else {
      alert('Producto no encontrado');
      setScanned(false);
    }
  };

  const cerrarTodo = () => {
    setScanned(false);
    setMostrarModalProducto(false);
    setProductoSeleccionado(null);
    setVarianteSeleccionada(undefined);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'code128'] }}
          onBarcodeScanned={({ data }) => handleBarcodeScanned(data)}
        />

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
  onClose={() => {
    setMostrarModalProducto(false);
    setScanned(false); // Permite escanear otro sin cerrar la cámara
  }}
  onSubmit={onSubmit} // ⬅️ PASA onSubmit DESDE ARRIBA
/>
      </View>
    </Modal>
  );
}
