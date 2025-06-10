import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Producto } from '../../../../services/db';
import { InputField } from '../components/InputField';
import { styles } from '../styles';

interface ProductoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (producto: Producto) => void;
  producto?: Producto;
}

export function ProductoModal({ visible, onClose, onSave, producto }: ProductoModalProps) {
  const [nombre, setNombre] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setPrecioVenta(producto.precioVenta.toString());
      setPrecioCosto(producto.precioCosto.toString());
      setStock(producto.stock.toString());
    } else {
      setNombre('');
      setPrecioVenta('');
      setPrecioCosto('');
      setStock('');
    }
  }, [producto]);

  const handleSubmit = () => {
    if (!nombre || !precioVenta || !precioCosto || !stock) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    const precioVentaNum = parseFloat(precioVenta);
    const precioCostoNum = parseFloat(precioCosto);
    const stockNum = parseInt(stock);

    if (precioCostoNum >= precioVentaNum) {
      Alert.alert('Error', 'El precio de costo no puede ser mayor o igual al precio de venta');
      return;
    }

    const productoData: Producto = {
      id: producto?.id,
      nombre,
      precioCosto: precioCostoNum,
      precioVenta: precioVentaNum,
      stock: stockNum,
    };

    onSave(productoData);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {producto ? 'Editar Producto' : 'Nuevo Producto'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <MaterialCommunityIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <InputField
                label="Nombre del producto"
                value={nombre}
                onChangeText={setNombre}
              />
              <InputField
                label="Precio de costo"
                value={precioCosto}
                onChangeText={setPrecioCosto}
                keyboardType="numeric"
              />
              <InputField
                label="Precio de venta"
                value={precioVenta}
                onChangeText={setPrecioVenta}
                keyboardType="numeric"
              />
              <InputField
                label="Stock"
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={onClose}
              >
                <MaterialCommunityIcons name="close" size={20} color="#334155" />
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSubmit}
              >
                <MaterialCommunityIcons name="check" size={20} color="#ffffff" />
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
} 