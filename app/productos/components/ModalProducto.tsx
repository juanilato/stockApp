// productos/views/modales/ModalProducto.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import CustomToast from '../../../components/CustomToast';
import FloatingLabelInput from '../../../components/FloatingLabel';
import { getDb, Producto, VarianteProducto } from '../../../services/db';
import { colors } from '../../styles/theme';
import { styles } from '../styles/modals/ModalProducto.styles';
interface Props {
  visible: boolean;
  productoEditado: Producto | null;
  variante?: VarianteProducto;
  onClose: () => void;
  onSubmit: (producto: Producto, esNuevo: boolean) => void;
}


export default function ModalProducto({
  visible,
  onClose,
  onSubmit,
  productoEditado
}: Props) {
  const [nombre, setNombre] = useState(''); // Nombre del producto
  const [precioVenta, setPrecioVenta] = useState(''); // Precio de venta del producto
  const [precioCosto, setPrecioCosto] = useState(''); // Precio de costo del producto
  const [stock, setStock] = useState(''); // Stock del producto



  // Efecto para cargar los datos del producto editado al abrir el modal (si no existe, se inicializan los campos)
useEffect(() => {
  if (visible) {
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
    setToast(null); // <- limpieza del mensaje anterior
  }
}, [visible, productoEditado]);

  // Todos los campos son obligatorios, si alguno está vacío muestra un alert
  // Realiza validaciones (valores positivos, enteros, != 0, precio costo < precio venta, stock > 0, precio costo >= costo de componentes si tiene)
const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'warning' } | null>(null);

const handleSave = async () => {
  if (!nombre || !precioVenta || !precioCosto || !stock) {
    setToast({ message: 'Por favor complete todos los campos' });
    return;
  }

  const parsedPrecioVenta = parseFloat(precioVenta);
  const parsedPrecioCosto = parseFloat(precioCosto);
  const parsedStock = Number(stock);

  if (parsedPrecioVenta <= 0 || parsedPrecioCosto <= 0 || parsedStock <= 0) {
    setToast({ message: 'No se permiten valores negativos o cero' });
    return;
  }

  if (!Number.isInteger(parsedStock)) {
    setToast({ message: 'El stock debe ser un número entero sin comas ni decimales' });
    return;
  }

  if (parsedPrecioCosto >= parsedPrecioVenta) {
    setToast({ message: 'El precio de costo debe ser menor que el precio de venta' });
    return;
  }

  let costoComponentes = 0;
  if (productoEditado?.id) {
    try {
      const db = getDb();
      const result = await db.getFirstAsync<{ costoTotal: number }>(
        `
        SELECT SUM(cp.cantidad * m.precioCosto) as costoTotal
        FROM componentes_producto cp
        JOIN materiales m ON cp.materialId = m.id
        WHERE cp.productoId = ?
        `,
        [productoEditado.id]
      );
      costoComponentes = result?.costoTotal || 0;

      if (parsedPrecioCosto < costoComponentes) {
        setToast({ message: `El precio de costo no puede ser menor al costo de los componentes (${costoComponentes.toFixed(2)})` });
        return;
      }
    } catch (error) {
      console.error('Error al verificar componentes:', error);
      setToast({ message: 'No se pudo verificar el costo de componentes' });
      return;
    }
  }

  const producto: Producto = {
    id: productoEditado?.id,
    nombre,
    precioVenta: parsedPrecioVenta,
    precioCosto: parsedPrecioCosto,
    stock: parsedStock,
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
              <View style={styles.modalBody}>
  <FloatingLabelInput
    label="Nombre"
    value={nombre}
    onChangeText={setNombre}
   
  />
  <FloatingLabelInput
    label="Precio de Costo"
    value={precioCosto}
    onChangeText={setPrecioCosto}
    keyboardType="numeric"
  
  />
  <FloatingLabelInput
    label="Precio de Venta"
    value={precioVenta}
    onChangeText={setPrecioVenta}
    keyboardType="numeric"
   
  />
  <FloatingLabelInput
    label="Stock"
    value={stock}
    onChangeText={setStock}
    keyboardType="numeric"
   
  />
</View>

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
      {toast && (
  <CustomToast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast(null)}
  />
)}

    </Modal>
  );
}
