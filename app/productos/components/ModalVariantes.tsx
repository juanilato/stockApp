// productos/views/modales/ModalVariantes.tsx
import CustomToast from '@/components/CustomToast';
import FloatingLabelInput from '@/components/FloatingLabel';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Producto, VarianteProducto, actualizarVariante, eliminarVariante, getDb, insertarVariante } from '../../../services/db';
import { styles } from '../styles/modals/ModalVariantes.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  producto: Producto;
  onActualizar?: () => void;
}

export default function ModalVariantes({ visible, onClose, producto, onActualizar }: Props) {
  const [varianteNombre, setVarianteNombre] = useState(''); // Nombre de la variante
  const [varianteStock, setVarianteStock] = useState(''); // Stock de la variante
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | null>(null);  // Variante seleccionada para editar
  const [variantes, setVariantes] = useState<VarianteProducto[]>(producto.variantes || []); // Lista de variantes del producto
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'warning' } | null>(null);


const cargarVariantes = async () => {
  if (typeof producto.id !== 'number') {
    setVariantes([]);
    return;
  }
  try {
    const db = getDb();
    const nuevasVariantes = await db.getAllAsync<VarianteProducto>(
      'SELECT * FROM variantes_producto WHERE productoId = ?',
      [producto.id]
    );
    setVariantes(nuevasVariantes);
  } catch (error) {
    console.error('❌ Error al cargar variantes del producto:', error);
  }
};
  // Resetea los campos al abrir el modal o cambiar de producto
  // y carga las variantes del producto seleccionado
  useEffect(() => {
    if (visible) {
      setVariantes(producto.variantes || []);
      setVarianteNombre('');
      setVarianteStock('');
      setVarianteSeleccionada(null);
      setToast(null); // Limpia el mensaje anterior
    }
  }, [visible, producto]);
const generarEAN13 = (): string => {
  const base = Math.floor(100000000000 + Math.random() * 899999999999).toString(); // 12 dígitos
  const checkDigit = calcularDigitoControlEAN13(base);
  return base + checkDigit;
};

const calcularDigitoControlEAN13 = (codigo: string): string => {
  const nums = codigo.split('').map(n => parseInt(n));
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += i % 2 === 0 ? nums[i] : nums[i] * 3;
  }
  const remainder = sum % 10;
  const check = remainder === 0 ? 0 : 10 - remainder;
  return check.toString();
};


  // Guarda la variante nueva o actualizada
  // Si varianteSeleccionada tiene valor, actualiza la variante, si no, inserta una nueva
  const guardarVariante = async () => {
if (!varianteNombre || !varianteStock) {
  setToast({ message: 'Todos los campos son obligatorios', type: 'warning' });
  return;
}

if (parseInt(varianteStock) <= 0) {
  setToast({ message: 'El stock debe ser un número positivo', type: 'warning' });
  return;
}
      const variante: VarianteProducto = {
        id: varianteSeleccionada?.id || 0,
        productoId: producto.id!,
        nombre: varianteNombre,
        stock: parseInt(varianteStock),
        codigoBarras: generarEAN13(), 
      };

    // Si se está editando una variante, se agrega el ID para actualizarla
    // Si es una nueva variante, no se agrega ID y se inserta como nueva en el producto id
    try {
        if (varianteSeleccionada) {
          await actualizarVariante({ ...variante, id: varianteSeleccionada.id, codigoBarras: varianteSeleccionada.codigoBarras });
        } else {
          variante.codigoBarras = generarEAN13();
          await insertarVariante(variante);
        }
      setVarianteNombre(''); // Limpia el campo de nombre
      setVarianteStock(''); // Limpia el campo de stock
      onActualizar?.(); // Refresca productos desde componente padre
      setToast({
        message: varianteSeleccionada
          ? 'Variante actualizada correctamente'
          : 'Variante agregada correctamente',
        type: 'success',
      });
      await cargarVariantes();
    } catch (error) {
      console.error('Error al guardar variante:', error);
      setToast({ message: 'No se pudo guardar la variante', type: 'error' });
    }
  };

  // Confirma la eliminación de una variante
  // Si se confirma, llama a eliminarVariante y actualiza la lista de variantes
  const confirmarEliminarVariante = async (id: number) => {
    try {
      await eliminarVariante(id);
      onActualizar?.();
      setToast({ message: 'Variante eliminada correctamente', type: 'success' });
      await cargarVariantes();
    } catch (error) {
      console.error('Error al eliminar variante:', error);
     setToast({ message: 'No se pudo eliminar la variante', type: 'error' });

    }
  };

  // Abre el formulario de edición con los datos de la variante seleccionada
  // Carga el nombre y stock de la variante en los campos de entrada
  const editarVariante = (variante: VarianteProducto) => {
    setVarianteSeleccionada(variante);
    setVarianteNombre(variante.nombre);
    setVarianteStock(variante.stock.toString());
  };


  return (
 <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
  <View style={styles.overlay}>
    <View style={styles.sheet}>
      <View style={styles.header}>
        <Text style={styles.title}>Variantes de {producto.nombre}</Text>
        <TouchableOpacity onPress={onClose}>
          <MaterialCommunityIcons name="close" size={24} color="#334155" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <FloatingLabelInput
          style={styles.input}
          label="Nombre de la variante"
          placeholder=""
          value={varianteNombre}
          onChangeText={setVarianteNombre}
        />
        <FloatingLabelInput
          style={styles.input}
          label="Stock"
          placeholder=""
          value={varianteStock}
          onChangeText={setVarianteStock}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={guardarVariante}
        >
          <Text style={styles.saveButtonText}>
            {varianteSeleccionada ? 'Actualizar' : 'Agregar'} Variante
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Variantes existentes</Text>
        {variantes.length === 0 ? (
          <Text style={styles.emptyText}>No hay variantes registradas</Text>
        ) : (
          <View style={styles.variantList}>
            {variantes.map((item) => (
              <View key={item.id} style={styles.variantCard}>
                <View style={styles.variantInfo}>
                  <Text style={styles.variantName}>{item.nombre}</Text>
                  <Text style={styles.variantStock}>Stock: {item.stock}</Text>
                </View>
                <View style={styles.variantActions}>
                  <TouchableOpacity onPress={() => editarVariante(item)}>
                    <MaterialCommunityIcons name="pencil" size={20} color="#2563eb" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmarEliminarVariante(item.id!)}>
                    <MaterialCommunityIcons name="delete" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  </View>
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
