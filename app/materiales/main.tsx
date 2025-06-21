import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import CustomToast from '../../components/CustomToast';
import { setupProductosDB } from '../../services/db';
import ModalMaterial from './components/ModalMaterial';
import { useAnimaciones } from './hooks/useAnimaciones';
import { useMateriales } from './hooks/useMateriales';
import { useModalMaterial } from './hooks/useModalMaterial';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function MaterialesView() {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const { materiales, cargarMateriales } = useMateriales();
  const { 
    modalVisible, 
    materialSeleccionado, 
    abrirModal, 
    cerrarModal, 
    guardarMaterial,
    eliminarMaterial 
  } = useModalMaterial(cargarMateriales);
  const { 
    showSaveAnimation, 
    showEditAnimation, 
    showDeleteAnimation,
    toast,
    setToast,
    mostrarToast 
  } = useAnimaciones();

  useEffect(() => {
    const inicializar = async () => {
      try {
        await setupProductosDB();
        await cargarMateriales();
        
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
      } catch (error) {
        console.error("❌ Error en inicialización:", error);
      } finally {
        setIsLoading(false);
      }
    };
    inicializar();
  }, []);

  const handleGuardarMaterial = async (nombre: string, precioCosto: string, unidad: string, stock: string) => {
    const result = await guardarMaterial(nombre, precioCosto, unidad, stock);
    if (result?.success) {
      mostrarToast(result.message, 'success');
    } else {
      mostrarToast(result?.message || 'Error al guardar', 'error');
    }
    return result;
  };

  const handleEliminarMaterial = async (id: number) => {
    const result = await eliminarMaterial(id);
    if (result?.success) {
      mostrarToast(result.message, 'success');
    } else if (result?.message !== 'Operación cancelada') {
      mostrarToast(result?.message || 'Error al eliminar', 'error');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="basket" size={48} color="#94a3b8" />
        <Text style={styles.loadingText}>Cargando materiales...</Text>
      </View>
    );
  }

  const renderMaterial = ({ item }: { item: any }) => {
    const renderRightActions = () => (
      <View style={styles.swipeActionsContainer}>
        <TouchableOpacity
          style={[styles.swipeActionButton, styles.swipeActionEdit]}
          onPress={() => abrirModal(item)}
        >
          <View style={styles.swipeActionTouchable}>
            <View style={styles.swipeActionContent}>
              <View style={styles.swipeActionIconContainer}>
                <MaterialCommunityIcons name="pencil" size={18} color="#ffffff" />
              </View>
              <Text style={styles.swipeActionText}>Editar</Text>
            </View>
          </View>
        </TouchableOpacity>
  
        <TouchableOpacity
          style={[styles.swipeActionButton, styles.swipeActionDelete]}
          onPress={() => handleEliminarMaterial(item.id!)}
        >
          <View style={styles.swipeActionTouchable}>
            <View style={styles.swipeActionContent}>
              <View style={styles.swipeActionIconContainer}>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color="#ffffff" />
              </View>
              <Text style={styles.swipeActionText}>Eliminar</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  
    const margen = item.precioCosto ? (parseFloat(item.precioCosto) * 0.3).toFixed(2) : '0.00';
  
    return (
      <View style={styles.productoWrapper}>
        <Swipeable
          renderRightActions={(progress, dragX) => renderRightActions()}
          overshootRight={false}
          friction={2}
          rightThreshold={40}
        >
          <View style={styles.productoCard}>
            <View style={styles.productoHeader}>
              <View style={styles.productoIcon}>
                <MaterialCommunityIcons name="cube-outline" size={20} color="#f59e0b" />
              </View>
              <View style={styles.productoInfo}>
                <Text style={styles.productoNombre}>{item.nombre}</Text>
                <View style={styles.productoMeta}>
                  <Text style={styles.productoStock}>
                    Stock: {item.stock} {item.unidad || 'u'}
                  </Text>
                </View>
              </View>
            </View>
  
            <View style={styles.productoPrecios}>
              <View style={styles.precioItem}>
                <Text style={styles.precioLabel}>Costo</Text>
                <Text style={styles.precioCosto}>${item.precioCosto}</Text>
              </View>
              <View style={styles.precioItem}>
                <Text style={styles.precioLabel}>Unidad</Text>
                <Text style={styles.precioVenta}>{item.unidad}</Text>
              </View>
              <View style={styles.precioItem}>
                <Text style={styles.precioLabel}>Margen</Text>
                <Text style={styles.precioMargen}>${margen}</Text>
              </View>
            </View>
          </View>
        </Swipeable>
      </View>
    );
  };
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header moderno */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerSectionLabel}>Inventario</Text>
              <Text style={styles.headerTitle}>Materiales</Text>
            </View>
            
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons name="basket" size={24} color="#ffffff" />
            </View>
          </View>
        </View>

        {/* Botón flotante */}
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => abrirModal()}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Lista de materiales */}
        <FlatList
          data={materiales}
          keyExtractor={(item) => item.id?.toString() || ''}
          renderItem={renderMaterial}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="basket-outline" size={64} color="#94a3b8" />
              <Text style={styles.emptyStateText}>No hay materiales</Text>
              <Text style={styles.emptyStateSubtext}>
                Agrega tu primer material para comenzar
              </Text>
            </View>
          }
          ListHeaderComponent={<View style={{ height: 16 }} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          showsVerticalScrollIndicator={false}
        />

        {/* Modal de material */}
        <ModalMaterial
          visible={modalVisible}
          material={materialSeleccionado}
          onClose={cerrarModal}
          onSubmit={handleGuardarMaterial}
        />

        {/* Toast notifications */}
        {toast && !modalVisible && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    productoWrapper: {
        marginHorizontal: wp('4%'),
        marginBottom: hp('1.5%'),
        marginTop: hp('0.5%'),
        backgroundColor: '#ffffff',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      },
      productoCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
      },
      productoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      },
      productoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff7ed',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      },
      productoInfo: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
      },
      productoNombre: {
        fontSize: wp('4.5%'),
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
      },
      productoMeta: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      productoStock: {
        fontSize: wp('3.5%'),
        color: '#64748b',
        fontWeight: '500',
      },
    
      // Precios y margen
      productoPrecios: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
      },
      precioItem: {
        flex: 1,
        alignItems: 'center',
      },
      precioLabel: {
        fontSize: wp('3%'),
        color: '#64748b',
        fontWeight: '500',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      },
      precioVenta: {
        fontSize: wp('4.2%'),
        fontWeight: '700',
        color: '#10b981',
      },
      precioCosto: {
        fontSize: wp('4.2%'),
        fontWeight: '700',
        color: '#ef4444',
      },
      precioMargen: {
        fontSize: wp('4.2%'),
        fontWeight: '700',
        color: '#3b82f6',
      },
    
      // Acciones swipe modernas
      swipeActionsContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: '100%',
        overflow: 'hidden',
        marginLeft: wp('-2.5%'),
      },
      swipeActionButton: {
        width: 80,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      },
      swipeActionEdit: {
        backgroundColor: '#3b82f6',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
      },
      swipeActionDelete: {
        backgroundColor: '#ef4444',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
      },
      swipeActionTouchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
      },
      swipeActionContent: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      swipeActionIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
      },
      swipeActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: 0.5,
      },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerSectionLabel: {
    fontSize: 14,
    color: '#94a3b8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  materialWrapper: {
    marginHorizontal: 16,
  },

  swipeButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    borderRadius: 12,
  },
  swipeButtonEdit: {
    backgroundColor: '#3b82f6',
  },
  swipeButtonDelete: {
    backgroundColor: '#ef4444',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
});
