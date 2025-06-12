// productos/views/modales/ModalVariantes.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { Producto, VarianteProducto, actualizarVariante, eliminarVariante, insertarVariante } from '../../../services/db';
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

  // Resetea los campos al abrir el modal o cambiar de producto
  // y carga las variantes del producto seleccionado
  useEffect(() => {
    if (visible) {
      setVariantes(producto.variantes || []);
      setVarianteNombre('');
      setVarianteStock('');
      setVarianteSeleccionada(null);
    }
  }, [visible, producto]);


  // Guarda la variante nueva o actualizada
  // Si varianteSeleccionada tiene valor, actualiza la variante, si no, inserta una nueva
  const guardarVariante = async () => {
    if (!varianteNombre || !varianteStock) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (parseInt(varianteStock) <= 0){
      Alert.alert('Error', 'El stock debe ser un número positivo');
      return;
    }

    const variante: VarianteProducto = {
      productoId: producto.id!,
      nombre: varianteNombre,
      stock: parseInt(varianteStock),
    };

    // Si se está editando una variante, se agrega el ID para actualizarla
    // Si es una nueva variante, no se agrega ID y se inserta como nueva en el producto id
    try {
      if (varianteSeleccionada) {
        await actualizarVariante({ ...variante, id: varianteSeleccionada.id });
      } else {
        await insertarVariante(variante);
      }

      onActualizar?.(); // Refresca productos desde componente padre
      onClose();
    } catch (error) {
      console.error('Error al guardar variante:', error);
      Alert.alert('Error', 'No se pudo guardar la variante');
    }
  };

  // Confirma la eliminación de una variante
  // Si se confirma, llama a eliminarVariante y actualiza la lista de variantes
  const confirmarEliminarVariante = async (id: number) => {
    try {
      await eliminarVariante(id);
      onActualizar?.();
      onClose();
    } catch (error) {
      console.error('Error al eliminar variante:', error);
      Alert.alert('Error', 'No se pudo eliminar la variante');
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
        <TextInput
          style={styles.input}
          placeholder="Nombre de la variante"
          value={varianteNombre}
          onChangeText={setVarianteNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Stock"
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
</Modal>

  );
}
