import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ModalInterpretacionVozProps {
  visible: boolean;
  onClose: () => void;
  productosInterpretados: any[];
  onAgregarAlCarrito: (productos: any[]) => void;
  textoOriginal: string;
}

// Limpia los productos: null -> 0 (números), null -> '' (strings)
function limpiarProducto(prod: any) {
  return {
    nombre: prod.nombre ?? '',
    precioVenta: prod.precioVenta ?? 0,
    precioCosto: prod.precioCosto ?? 0,
    stock: prod.stock ?? 0,
    cantidad: prod.cantidad ?? 1,
  };
}

export default function ModalInterpretacionVoz({
  visible,
  onClose,
  productosInterpretados,
  onAgregarAlCarrito,
  textoOriginal,
}: ModalInterpretacionVozProps) {
  const [productos, setProductos] = useState(productosInterpretados.map(limpiarProducto));

  React.useEffect(() => {
    setProductos(productosInterpretados.map(limpiarProducto));
  }, [productosInterpretados]);

  const actualizarCantidad = (index: number, cantidad: number) => {
    setProductos(prev => prev.map((p, i) => i === index ? { ...p, cantidad: Math.max(1, cantidad) } : p));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.titulo}>¿Agregar estos productos?</Text>
          <Text style={styles.textoOriginal}>"{textoOriginal}"</Text>
          <FlatList
            data={productos}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.productoRow}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <View style={styles.cantidadRow}>
                  <TouchableOpacity onPress={() => actualizarCantidad(index, item.cantidad - 1)} style={styles.btnCantidad}><Text>-</Text></TouchableOpacity>
                  <Text style={styles.cantidad}>{item.cantidad}</Text>
                  <TouchableOpacity onPress={() => actualizarCantidad(index, item.cantidad + 1)} style={styles.btnCantidad}><Text>+</Text></TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={styles.acciones}>
            <TouchableOpacity onPress={onClose} style={styles.btnCancelar}><Text style={{color:'#ef4444'}}>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => onAgregarAlCarrito(productos)} style={styles.btnAgregar}><Text style={{color:'#fff'}}>Agregar al carrito</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    elevation: 10,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  textoOriginal: {
    fontStyle: 'italic',
    color: '#64748b',
    marginBottom: 12,
    textAlign: 'center',
  },
  productoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nombre: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  cantidadRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnCantidad: {
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 4,
  },
  cantidad: {
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  acciones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  btnCancelar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  btnAgregar: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
}); 