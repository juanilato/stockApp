import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ComponenteProducto, Material, Producto, insertarComponenteProducto, obtenerComponentesProducto, obtenerMateriales, setupProductosDB } from '../../services/db';
import { borderRadius, colors, commonStyles, shadows, spacing, typography } from '../styles/theme';

interface ProductosModalProps {
  visible: boolean;
  onClose: () => void;
  producto?: Producto;
}

export default function ProductosModal({ visible, onClose, producto }: ProductosModalProps) {
  const [componentes, setComponentes] = useState<ComponenteProducto[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [componenteSeleccionado, setComponenteSeleccionado] = useState<ComponenteProducto | null>(null);
  const [materialId, setMaterialId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && producto) {
      inicializarDB();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, producto]);

  const inicializarDB = async () => {
    try {
      await setupProductosDB();
      await cargarDatos();
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
      Alert.alert('Error', 'No se pudo inicializar la base de datos');
    } finally {
      setIsLoading(false);
    }
  };

  const cargarDatos = async () => {
    if (!producto) return;

    obtenerComponentesProducto(producto.id!, (componentes) => {
      setComponentes(componentes);
    });

    obtenerMateriales((materiales) => {
      setMateriales(materiales);
    });
  };

  const abrirModal = (componente?: ComponenteProducto) => {
    if (componente) {
      setComponenteSeleccionado(componente);
      setMaterialId(componente.materialId.toString());
      setCantidad(componente.cantidad.toString());
    } else {
      setComponenteSeleccionado(null);
      setMaterialId('');
      setCantidad('');
    }
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setComponenteSeleccionado(null);
    setMaterialId('');
    setCantidad('');
  };

  const guardarComponente = async () => {
    if (!producto || !materialId || !cantidad) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const componente: ComponenteProducto = {
      productoId: producto.id!,
      materialId: parseInt(materialId),
      cantidad: parseFloat(cantidad),
    };

    try {
      if (componenteSeleccionado) {
        await db.runAsync(
          'UPDATE componentes_producto SET materialId = ?, cantidad = ? WHERE id = ?',
          [componente.materialId, componente.cantidad, componenteSeleccionado.id]
        );
      } else {
        await insertarComponenteProducto(componente);
      }
      await cargarDatos();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar el componente:', error);
      Alert.alert('Error', 'No se pudo guardar el componente');
    }
  };

  const eliminarComponenteHandler = async (id: number) => {
    try {
      await db.runAsync('DELETE FROM componentes_producto WHERE id = ?', [id]);
      await cargarDatos();
    } catch (error) {
      console.error('Error al eliminar el componente:', error);
      Alert.alert('Error', 'No se pudo eliminar el componente');
    }
  };

  const renderItem = ({ item }: { item: ComponenteProducto }) => {
    const material = materiales.find((m) => m.id === item.materialId);
    return (
      <View style={[commonStyles.listItem, { padding: spacing.lg }]}>
        <View style={styles.componenteInfo}>
          <Text style={[commonStyles.listItemTitle, { fontSize: typography.sizes.lg }]}>{material?.nombre}</Text>
          <View style={styles.componenteDetalles}>
            <Text style={[commonStyles.listItemSubtitle, { fontSize: typography.sizes.base }]}>
              Cantidad: {item.cantidad} {material?.unidad}
            </Text>
            <Text style={[commonStyles.listItemSubtitle, { fontSize: typography.sizes.base }]}>
              Costo: ${(item.cantidad * (material?.precioCosto || 0)).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.componenteAcciones}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => abrirModal(item)}
          >
            <MaterialCommunityIcons name="pencil" size={20} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => eliminarComponenteHandler(item.id!)}
          >
            <MaterialCommunityIcons name="delete" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.emptyStateText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          commonStyles.modalContainer,
          {
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-300, 0]
              })
            }]
          }
        ]}
      >
        <View style={[commonStyles.modalContent, { marginTop: 150 }]}>
          <View style={[commonStyles.modalHeader, { marginBottom: spacing.xl }]}>
            <Text style={[commonStyles.modalTitle, { fontSize: typography.sizes['2xl'] }]}>
              Componentes de {producto?.nombre}
            </Text>
            <TouchableOpacity 
              onPress={onClose}
              style={{ padding: spacing.sm }}
            >
              <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>

          <View style={commonStyles.content}>
            <FlatList
              data={componentes}
              renderItem={renderItem}
              keyExtractor={(item) => item.id?.toString() || ''}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.md }}
              ListEmptyComponent={
                <View style={[commonStyles.emptyState, { padding: spacing.xl }]}>
                  <Text style={[commonStyles.emptyStateText, { fontSize: typography.sizes.lg }]}>
                    No hay componentes registrados
                  </Text>
                </View>
              }
            />
          </View>

          <TouchableOpacity
            style={[commonStyles.button, commonStyles.buttonPrimary, { marginTop: spacing.xl }]}
            onPress={() => abrirModal()}
          >
            <MaterialCommunityIcons name="plus" size={24} color={colors.white} />
            <Text style={[commonStyles.buttonText, { fontSize: typography.sizes.lg }]}>Agregar Componente</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={cerrarModal}
      >
        <Animated.View 
          style={[
            commonStyles.modalContainer,
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-300, 0]
                })
              }]
            }
          ]}
        >
          <View style={[commonStyles.modalContent, { marginTop: 150 }]}>
            <View style={[commonStyles.modalHeader, { marginBottom: spacing.xl }]}>
              <Text style={[commonStyles.modalTitle, { fontSize: typography.sizes['2xl'] }]}>
                {componenteSeleccionado ? 'Editar Componente' : 'Nuevo Componente'}
              </Text>
              <TouchableOpacity 
                onPress={cerrarModal}
                style={{ padding: spacing.sm }}
              >
                <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: spacing.lg }}>
              <View>
                <Text style={[styles.inputLabel, { fontSize: typography.sizes.base }]}>Material</Text>
                <View style={styles.materialSelector}>
                  {materiales.map((material) => (
                    <TouchableOpacity
                      key={material.id}
                      style={[
                        styles.materialOption,
                        materialId === material.id?.toString() && styles.materialOptionSelected,
                      ]}
                      onPress={() => setMaterialId(material.id?.toString() || '')}
                    >
                      <Text style={[
                        styles.materialOptionText,
                        materialId === material.id?.toString() && styles.materialOptionTextSelected,
                      ]}>
                        {material.nombre}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={[styles.inputLabel, { fontSize: typography.sizes.base }]}>Cantidad</Text>
                <TextInput
                  style={[commonStyles.input, { fontSize: typography.sizes.lg }]}
                  value={cantidad}
                  onChangeText={setCantidad}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>

            <View style={[styles.buttonContainer, { marginTop: spacing.xl }]}>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.buttonDanger, { flex: 1 }]}
                onPress={cerrarModal}
              >
                <Text style={[commonStyles.buttonText, { fontSize: typography.sizes.lg }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.buttonPrimary, { flex: 1 }]}
                onPress={guardarComponente}
              >
                <Text style={[commonStyles.buttonText, { fontSize: typography.sizes.lg }]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  componenteInfo: {
    flex: 1,
  },
  componenteDetalles: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  componenteAcciones: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  inputLabel: {
    color: colors.gray[700],
    marginBottom: spacing.sm,
    fontWeight: typography.weights.medium,
  },
  materialSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  materialOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  materialOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  materialOptionText: {
    color: colors.gray[700],
    fontSize: typography.sizes.base,
  },
  materialOptionTextSelected: {
    color: colors.white,
  },
}); 