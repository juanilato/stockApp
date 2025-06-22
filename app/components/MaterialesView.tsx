import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { actualizarMaterial, eliminarMaterial, insertarMaterial, Material, obtenerMateriales, setupProductosDB } from '../../services/db';
import { borderRadius, colors, shadows, spacing, typography } from '../styles/theme';
export default function MaterialesView() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState<Material | null>(null);
  const [nombre, setNombre] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [unidad, setUnidad] = useState('');
  const [stock, setStock] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;
const [showSaveAnimation, setShowSaveAnimation] = useState(false);
    const [cartScale] = useState(new Animated.Value(0));
    const [cartOpacity] = useState(new Animated.Value(0));

    const [showEditAnimation, setShowEditAnimation] = useState(false);
    const [editScale] = useState(new Animated.Value(0));
    const [editOpacity] = useState(new Animated.Value(0));

    const [showDeleteAnimation, setShowDeleteAnimation] = useState(false);
    const [deleteScale] = useState(new Animated.Value(0));
    const [deleteOpacity] = useState(new Animated.Value(0));

    const animateGuardarProductoNuevo = () => {
      setShowSaveAnimation(true);
      Animated.sequence([
        Animated.timing(cartOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(cartScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(cartOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSaveAnimation(false);
        cartScale.setValue(0);
      });
    };
    const animateEdicionProducto = () => {
      setShowEditAnimation(true);
      Animated.sequence([
        Animated.timing(editOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(editScale, {
          toValue: 1,
          speed: 12,
          bounciness: 12,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(editOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowEditAnimation(false);
        editScale.setValue(0);
      });
    };
    const animateEliminarProducto = () => {
      setShowDeleteAnimation(true);
      Animated.sequence([
        Animated.timing(deleteOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(deleteScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(deleteScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(deleteOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowDeleteAnimation(false);
        deleteScale.setValue(0);
      });
    };
        
  useEffect(() => {
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
  }, []);

  const inicializarDB = async () => {
    try {
      await setupProductosDB();
      await cargarMateriales();
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
      Alert.alert('Error', 'No se pudo inicializar la base de datos');
    } finally {
      setIsLoading(false);
    }
  };

  const cargarMateriales = async () => {
    obtenerMateriales((materiales) => {
      setMateriales(materiales);
    });
  };

  const abrirModal = (material?: Material) => {
    if (material) {
      setMaterialSeleccionado(material);
      setNombre(material.nombre);
      setPrecioCosto(material.precioCosto.toString());
      setUnidad(material.unidad);
      setStock(material.stock.toString());
    } else {
      setMaterialSeleccionado(null);
      setNombre('');
      setPrecioCosto('');
      setUnidad('');
      setStock('');
    }
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setMaterialSeleccionado(null);
    setNombre('');
    setPrecioCosto('');
    setUnidad('');
    setStock('');
  };

  const guardarMaterial = async () => {
    if (!nombre || !precioCosto || !unidad || !stock) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
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
         animateEdicionProducto();
      } else {
        await insertarMaterial(material);
         animateGuardarProductoNuevo();
      }
      await cargarMateriales();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar el material:', error);
      Alert.alert('Error', 'No se pudo guardar el material');
    }
  };

  const eliminarMaterialHandler = async (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este material?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarMaterial(id);
              animateEliminarProducto();
              await cargarMateriales();
            } catch (error) {
              console.error('Error al eliminar el material:', error);
              Alert.alert('Error', 'No se pudo eliminar el material');
            }
          },
        },
      ]
    );
  };
const renderMaterial = ({ item }: { item: Material }) => {
  const renderRightActions = () => (
    <View style={{ flexDirection: 'row' }}>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#10b981' }]}
        onPress={() => abrirModal(item)}
      >
        <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
        onPress={() => eliminarMaterialHandler(item.id!)}
      >
        <MaterialCommunityIcons name="delete" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      key={item.id}
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <View style={styles.materialItem}>
        <View style={styles.materialHeader}>
          <Text style={styles.materialNombre}>{item.nombre}</Text>
        </View>
        <View style={styles.materialDetalles}>
          <View style={styles.detalleItem}>
            <Text style={styles.detalleLabel}>Precio:</Text>
            <Text style={styles.detalleValor}>${item.precioCosto}</Text>
          </View>
          <View style={styles.detalleItem}>
            <Text style={styles.detalleLabel}>Unidad:</Text>
            <Text style={styles.detalleValor}>{item.unidad}</Text>
          </View>
          <View style={styles.detalleItem}>
            <Text style={styles.detalleLabel}>Stock:</Text>
            <Text style={[styles.detalleValor, item.stock <= 10 ? styles.lowStock : null]}>
              {item.stock} unidades
            </Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};


  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyStateText}>Cargando...</Text>
      </View>
    );
  }

  return (
        <GestureHandlerRootView style={{ flex: 1 }}>


    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛠️ Materiales</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => abrirModal()}
              activeOpacity={0.7}
          >
          
          <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
            <Text style={styles.addButtonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <FlatList
          data={materiales}
          renderItem={renderMaterial}
          keyExtractor={(item) => item.id?.toString() || ''}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.md }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No hay materiales registrados
              </Text>
            </View>
          }
        />
      </View>

      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={cerrarModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <Animated.View 
              style={[
                styles.modalContent,
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
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {materialSeleccionado ? 'Editar Material' : 'Nuevo Material'}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={cerrarModal}
                >
                  <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <TextInput
                  style={styles.input}
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Nombre del material"
                  placeholderTextColor={colors.gray[400]}
                  autoFocus={true}
                />

                <TextInput
                  style={styles.input}
                  value={precioCosto}
                  onChangeText={setPrecioCosto}
                  placeholder="Precio de costo"
                  keyboardType="numeric"
                  placeholderTextColor={colors.gray[400]}
                />

                <TextInput
                  style={styles.input}
                  value={unidad}
                  onChangeText={setUnidad}
                  placeholder="Unidad (metro, unidad, hora, etc.)"
                  placeholderTextColor={colors.gray[400]}
                />

                <TextInput
                  style={styles.input}
                  value={stock}
                  onChangeText={setStock}
                  placeholder="Stock"
                  keyboardType="numeric"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={cerrarModal}
                >
                  <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
                  <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={guardarMaterial}
                >
                  <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                  <Text style={styles.modalButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </Animated.View>

              {showSaveAnimation && (
  <Animated.View style={{
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    transform: [{ scale: cartScale }],
    opacity: cartOpacity,
  }}>
    <Text style={{ color: 'white', fontWeight: '600' }}>✅ Material guardado</Text>
  </Animated.View>
)}

{showEditAnimation && (
  <Animated.View style={{
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    transform: [{ scale: editScale }],
    opacity: editOpacity,
  }}>
    <Text style={{ color: 'white', fontWeight: '600' }}>✏️ Material editado</Text>
  </Animated.View>
)}

{showDeleteAnimation && (
  <Animated.View style={{
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    transform: [{ scale: deleteScale }],
    opacity: deleteOpacity,
  }}>
    <Text style={{ color: 'white', fontWeight: '600' }}>🗑️ Material eliminado</Text>
  </Animated.View>
)}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.sizes.lg,
    color: colors.gray[500],
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.gray[800],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  materialItem: {
  backgroundColor: '#f8fafc', // gris muy claro
  padding: 16,

  borderColor: '#e2e8f0',
  borderWidth: 1,

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 3,

},

materialNombre: {
  fontSize: 18,
  fontWeight: '600',
  color: '#0f172a', // gris oscuro
  marginBottom: 4,
},

materialDetalles: {
  flexDirection: 'row',
  flexWrap: 'wrap',

},

detalleItem: {
  flexDirection: 'row',
  gap: 4,
},

detalleLabel: {
  fontSize: 14,
  color: '#64748b', // gris medio
},

detalleValor: {
  fontSize: 14,
  color: '#0f172a',
  fontWeight: '500',
},

lowStock: {
  color: '#dc2626', // rojo intenso
},

  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
    
    marginBottom: spacing.md,
    ...shadows.md,

  },
    
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },

  materialAcciones: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  editButton: {
    backgroundColor: colors.info,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    width: '90%',
    maxWidth: 400,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalBody: {
    padding: spacing.lg,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.gray[800],
  },
  closeButton: {
    padding: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.sizes.lg,
    backgroundColor: colors.white,
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: colors.gray[100],
  },
  modalButtonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: colors.gray[700],
  },
}); 