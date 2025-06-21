import { useState } from 'react';
import { Alert } from 'react-native';
import { actualizarMaterial, getDb, insertarMaterial, Material } from '../../../services/db';

export const useModalMaterial = (cargarMateriales: () => void) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState<Material | null>(null);

  const abrirModal = (material?: Material) => {
    setMaterialSeleccionado(material || null);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setMaterialSeleccionado(null);
  };

  const guardarMaterial = async (nombre: string, precioCosto: string, unidad: string, stock: string) => {
    if (!nombre || !precioCosto || !unidad || !stock) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return { success: false, message: 'Todos los campos son obligatorios' };
    }

    const material: Material = {
      nombre,
      precioCosto: parseFloat(precioCosto),
      unidad,
      stock: parseFloat(stock),
    };

    try {
      if (materialSeleccionado) {
        await actualizarMaterial({ ...material, id: materialSeleccionado.id });
      } else {
        await insertarMaterial(material);
      }
      await cargarMateriales();
      cerrarModal();
      return { 
        success: true, 
        message: materialSeleccionado ? 'Material editado exitosamente' : 'Material guardado exitosamente' 
      };
    } catch (error) {
      console.error('Error al guardar el material:', error);
      Alert.alert('Error', 'No se pudo guardar el material');
      return { success: false, message: 'Error al guardar el material' };
    }
  };

  const eliminarMaterial = async (id: number) => {
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro de que deseas eliminar este material?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => resolve({ success: false, message: 'Operación cancelada' }),
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              try {
                const db = getDb();
                await db.runAsync('DELETE FROM materiales WHERE id = ?', [id]);
                await cargarMateriales();
                resolve({ success: true, message: 'Material eliminado exitosamente' });
              } catch (error) {
                console.error('Error al eliminar el material:', error);
                Alert.alert('Error', 'No se pudo eliminar el material');
                resolve({ success: false, message: 'Error al eliminar el material' });
              }
            },
          },
        ]
      );
    });
  };

  return {
    modalVisible,
    materialSeleccionado,
    abrirModal,
    cerrarModal,
    guardarMaterial,
    eliminarMaterial,
  };
}; 