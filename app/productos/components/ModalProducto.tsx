// productos/views/modales/ModalProducto.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text, TextInput, TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { Producto } from '../../../services/db';
import { colors } from '../../styles/theme';
import { styles } from '../styles/styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (producto: Producto, esNuevo: boolean) => void;
  productoEditado?: Producto | null;
}

export default function ModalProducto({
  visible,
  onClose,
  onSubmit,
  productoEditado
}: Props) {
  const [nombre, setNombre] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (productoEditado) {
      setNombre(productoEditado.nombre);
      setPrecioVenta(productoEditado.precioVenta.toString());
      setPrecioCosto(productoEditado.precioCosto.toString());
      setStock(productoEditado.stock.toString());
    } else {
      setNombre('');
      setPrecioVenta('');
      setPrecioCosto('');
      setStock('');
    }
  }, [productoEditado]);

  const handleSave = () => {
    if (!nombre || !precioVenta || !precioCosto || !stock) {
      alert('Por favor complete todos los campos');
      return;
    }

    const producto: Producto = {
      id: productoEditado?.id,
      nombre,
      precioVenta: parseFloat(precioVenta),
      precioCosto: parseFloat(precioCosto),
      stock: parseInt(stock),
    };

    onSubmit(producto, !productoEditado);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {productoEditado ? 'Editar Producto' : 'Nuevo Producto'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre"
              />
              <TextInput
                style={styles.input}
                value={precioCosto}
                onChangeText={setPrecioCosto}
                keyboardType="numeric"
                placeholder="Precio de costo"
              />
              <TextInput
                style={styles.input}
                value={precioVenta}
                onChangeText={setPrecioVenta}
                keyboardType="numeric"
                placeholder="Precio de venta"
              />
              <TextInput
                style={styles.input}
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
                placeholder="Stock"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={onClose}
              >
                <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSave}
              >
                <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
