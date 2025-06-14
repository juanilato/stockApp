// productos/views/modales/ModalComponentes.tsx
import CustomToast from '@/components/CustomToast';
import FloatingLabelInput from '@/components/FloatingLabel';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {
  ComponenteProducto,
  eliminarComponenteProducto,
  getDb,
  insertarComponenteProducto,
  Material,
  obtenerComponentesProducto,
  Producto
} from '../../../services/db';
import { styles } from '../styles/modals/ModalComponentes.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  producto: Producto;
  materiales: Material[];
  onActualizar?: () => void;
}

export default function ModalComponentes({ visible, onClose, producto, materiales, onActualizar }: Props) {
  const [componentes, setComponentes] = useState<ComponenteProducto[]>([]);
  const [materialSeleccionado, setMaterialSeleccionado] = useState<Material | null>(null);
  const [cantidad, setCantidad] = useState('');
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'warning' } | null>(null);

  const db = getDb();

  // Carga los componentes del producto al abrir el modal (useCallback evita recargas innecesarias)
  // y se asegura de que la función no cambie entre renders a menos que producto.id cambie.
  const cargarComponentes = React.useCallback(async () => {
    try {
      await obtenerComponentesProducto(producto.id!, (componentes) => {
        setComponentes(componentes);
      });
    } catch (error) {
    setToast({ message: 'No se pudieron cargar los componentes', type: 'error' });

      console.error(error);
    }
  }, [producto.id]);

  useEffect(() => {
    if (visible) {
      cargarComponentes();
      setMaterialSeleccionado(null);
      setCantidad('');
      setToast(null);
    }
  }, [visible, cargarComponentes]);


  // Obtiene el costo actual del producto para calcular el nuevo costo al agregar un componente
  // Se usa una función asíncrona para manejar la consulta a la base de datos.
  const obtenerCostoActual = async (): Promise<number> => {
    if (producto.id === undefined) {
      return 0;
    }
    const row = await db.getFirstAsync<{ precioCosto: number }>('SELECT precioCosto FROM productos WHERE id = ?', [producto.id]);
    return row?.precioCosto || 0;
  };


  // Agrega un nuevo componente al producto
  // Verifica que se haya seleccionado un material y una cantidad válida.
  const agregarComponente = async () => {
    if (!materialSeleccionado || !cantidad) {
  setToast({ message: 'Seleccione un material y cantidad válida', type: 'warning' });

      return;
    }

    // Verifica que la cantidad sea un número válido y mayor a 0
    const cantidadNum = parseFloat(cantidad.replace(',', '.'));
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
    setToast({ message: 'Cantidad inválida', type: 'warning' });

      return;
    }

    // Calcula el nuevo costo total del producto
    // y verifica que no sea mayor o igual al precio de venta del producto.
    const costoActual = await obtenerCostoActual();
    const nuevoCosto = costoActual + materialSeleccionado.precioCosto * cantidadNum;

    if (nuevoCosto >= producto.precioVenta) {
setToast({ message: 'El costo total no puede ser mayor o igual al precio de venta', type: 'warning' });

      return;
    }

    try {
      // Inserta el nuevo componente en la base de datos
      await insertarComponenteProducto({
        productoId: producto.id!,
        materialId: materialSeleccionado.id!,
        cantidad: cantidadNum,
      });

      // Actualiza el costo del producto en la base de datos
      if (producto.id === undefined) {
        throw new Error('El id del producto es undefined');
      }
      await db.runAsync(
        'UPDATE productos SET precioCosto = ? WHERE id = ?',
        [nuevoCosto, producto.id as number]
      );

      // Recarga los componentes y actualiza el estado
      await cargarComponentes();
      onActualizar?.();
      setCantidad('');
      setMaterialSeleccionado(null);
      setToast({ message: 'Componente agregado correctamente', type: 'success' });

    } catch (error) {
setToast({ message: 'No se pudo agregar el componente', type: 'error' });

      console.error(error);
    }
  };

  // Elimina un componente del producto
  // Calcula el nuevo costo del producto restando el costo del componente eliminado.
  const eliminarComponente = async (componenteId: number) => {
    const componente = componentes.find(c => c.id === componenteId);
    if (!componente) return;

    const material = materiales.find(m => m.id === componente.materialId);
    if (!material) return;

    const costoActual = await obtenerCostoActual();
    const costoEliminar = material.precioCosto * componente.cantidad;
    const nuevoCosto = Math.max(costoActual - costoEliminar, 0);

    try {
      // Elimina el componente de la base de datos
      await eliminarComponenteProducto(componenteId);
      if (producto.id === undefined) {
        throw new Error('El id del producto es undefined');
      }
      await db.runAsync(
        'UPDATE productos SET precioCosto = ? WHERE id = ?',
        [nuevoCosto, producto.id as number]
      );
      // Recarga los componentes y actualiza el estado
      await cargarComponentes();
      onActualizar?.();
      setToast({ message: 'Componente eliminado correctamente', type: 'success' });
    } catch (error) {
     setToast({ message: 'No se pudo eliminar el componente', type: 'error' });

      console.error(error);
    }
  };

  

return (
  
  <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Componentes de {producto.nombre}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#334155" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
         

            <Text style={styles.sectionTitle}>Agregar nuevo componente</Text>
            <View style={styles.materialList}>
              {materiales.map((mat) => (
                <TouchableOpacity
                  key={mat.id}
                  style={[
                    styles.materialBox,
                    materialSeleccionado?.id === mat.id && styles.materialSelected,
                  ]}
                  onPress={() => setMaterialSeleccionado(mat)}
                >
                  <Text style={styles.materialName}>{mat.nombre}</Text>
                  <Text style={styles.materialDetails}>
                    {mat.unidad} · ${mat.precioCosto}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {materialSeleccionado && (
              <FloatingLabelInput
                style={styles.input}
                label={`Cantidad en ${materialSeleccionado.unidad}`}
                value={cantidad}
                onChangeText={(text) => {
                  const valid = /^\d*[.,]?\d*$/;
                  if (valid.test(text) || text === '') setCantidad(text);
                }}
                placeholder={`Cantidad en ${materialSeleccionado.unidad}`}
                keyboardType="decimal-pad"
              />
            )}
<Text style={styles.sectionTitle}>Componentes actuales</Text>
{componentes.length === 0 ? (
  <Text style={styles.empty}>No hay componentes agregados</Text>
) : (
  <View style={styles.componentList}>
    {componentes.map((item) => {
      const material = materiales.find(m => m.id === item.materialId);
      if (!material) return null;

      return (
        <View key={item.id} style={styles.componentCard}>
          <View style={styles.componentInfo}>
            <Text style={styles.componentName}>{material.nombre}</Text>
            <Text style={styles.componentDetails}>
              {item.cantidad} {material.unidad} · ${material.precioCosto * item.cantidad}
            </Text>
          </View>
          <TouchableOpacity onPress={() => eliminarComponente(item.id!)}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      );
    })}
  </View>
)}

            
          </ScrollView>

          <TouchableOpacity
            style={[styles.button, (!materialSeleccionado || !cantidad) && styles.buttonDisabled]}
            onPress={agregarComponente}
            disabled={!materialSeleccionado || !cantidad}
          >
            <Text style={styles.buttonText}>Agregar Componente</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
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
