import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FloatingLabelInput from '../../../components/FloatingLabel';
import { Material } from '../../../services/db';
import { colors } from '../../../styles/theme';

interface MaterialConPrecio extends Material {
  precioCostoEditado: string;
}

interface ModalPreciosMaterialesProps {
  visible: boolean;
  materiales: Material[];
  onClose: () => void;
  onGuardar: (materialesActualizados: Material[]) => Promise<{ success: boolean; message: string }>;
}

export default function ModalPreciosMateriales({
  visible,
  materiales,
  onClose,
  onGuardar,
}: ModalPreciosMaterialesProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [materialesEditables, setMaterialesEditables] = useState<MaterialConPrecio[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('🔍 ModalPreciosMateriales - visible:', visible);
    console.log('🔍 ModalPreciosMateriales - materiales recibidos:', materiales);
    console.log('🔍 ModalPreciosMateriales - cantidad de materiales:', materiales.length);
    
    if (visible && materiales.length > 0) {
      // Convertir materiales a formato editable
      const materialesConPrecios = materiales.map(material => ({
        ...material,
        precioCostoEditado: material.precioCosto.toString()
      }));
      
      console.log('🔍 ModalPreciosMateriales - materiales convertidos:', materialesConPrecios);
      setMaterialesEditables(materialesConPrecios);

      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (visible) {
      console.log('⚠️ Modal abierto pero no hay materiales');
      setMaterialesEditables([]);
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, materiales]);

  // Monitorear cambios en materialesEditables
  useEffect(() => {
    console.log('🔍 ModalPreciosMateriales - Estado materialesEditables actualizado:', materialesEditables.length);
  }, [materialesEditables]);

  const actualizarPrecio = (id: number, nuevoPrecio: string) => {
    setMaterialesEditables(prev => 
      prev.map(material => 
        material.id === id 
          ? { ...material, precioCostoEditado: nuevoPrecio }
          : material
      )
    );
  };

  const handleGuardar = async () => {
    // Validar que todos los precios sean válidos
    const preciosInvalidos = materialesEditables.filter(
      material => !material.precioCostoEditado || isNaN(parseFloat(material.precioCostoEditado))
    );

    if (preciosInvalidos.length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      // Convertir de vuelta a formato Material
      const materialesActualizados = materialesEditables.map(material => ({
        id: material.id!,
        nombre: material.nombre,
        precioCosto: parseFloat(material.precioCostoEditado),
        unidad: material.unidad,
        stock: material.stock
      }));

      const result = await onGuardar(materialesActualizados);
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar precios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMaterialItem = ({ item }: { item: MaterialConPrecio }) => {
    console.log('🔍 Renderizando material:', item);
    return (
      <View style={styles.materialItem}>
        <View style={styles.materialInfo}>
          <View style={styles.materialIcon}>
            <MaterialCommunityIcons name="cube-outline" size={20} color="#f59e0b" />
          </View>
          <View style={styles.materialDetails}>
            <Text style={styles.materialNombre}>{item.nombre}</Text>
            <Text style={styles.materialUnidad}>{item.unidad}</Text>
          </View>
        </View>
        
        <View style={styles.precioContainer}>
          <FloatingLabelInput
            label="Precio"
            value={item.precioCostoEditado}
            onChangeText={(text: string) => actualizarPrecio(item.id!, text)}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>
      </View>
    );
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.headerInfo}>
                <Text style={styles.modalTitle}>Editar Precios</Text>
                <Text style={styles.modalSubtitle}>
                  {materialesEditables.length} materiales
                </Text>
              </View>
              <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>


             
              
            <FlatList
                data={materialesEditables}
          
                style={{ flexGrow: 1 }}
                contentContainerStyle={[styles.listContainer, { flexGrow: 1 }]}
                keyExtractor={(item) => item.id?.toString() || ''}
                renderItem={renderMaterialItem}
                showsVerticalScrollIndicator={true}
     
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                bounces={true}
                alwaysBounceVertical={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="alert-circle" size={48} color="#ef4444" />
                    <Text style={styles.emptyText}>No hay materiales para mostrar</Text>
                    <Text style={styles.emptySubtext}>
                      Materiales recibidos: {materiales.length}
                    </Text>
                  </View>
                }
              />
  

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={onClose}
                disabled={isLoading}
              >
                <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonPrimary,
                  isLoading && styles.modalButtonDisabled,
                ]}
                onPress={handleGuardar}
                disabled={isLoading}
              >
                <MaterialCommunityIcons name="content-save" size={20} color="#ffffff" />
                <Text style={styles.modalButtonText}>
                  {isLoading ? 'Guardando...' : 'Guardar Todos'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  modalContent: {
    width: '100%',
    maxWidth: wp('90%'),
    backgroundColor: '#ffffff',
    borderRadius: wp('6%'),
    overflow: 'hidden',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerInfo: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  closeIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  modalBody: {
    flex: 1,
    backgroundColor: 'red',
    paddingHorizontal: 24,
  },
  debugContainer: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  debugText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
  },
  listContainer: {
    paddingVertical: 16,

  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  materialInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  materialDetails: {
    flex: 1,
  },
  materialNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  materialUnidad: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  precioContainer: {
    minWidth: 120,
    marginLeft: 16,
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  modalButtonPrimary: {
    backgroundColor: '#f59e0b',
  },
  modalButtonSecondary: {
    backgroundColor: '#f1f5f9',
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalButtonTextSecondary: {
    color: '#64748b',
  },
}); 