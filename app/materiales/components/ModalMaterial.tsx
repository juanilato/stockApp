import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
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
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FloatingLabelInput from '../../../components/FloatingLabel';
import { Material } from '../../../services/db';
import { colors } from '../../../styles/theme';

interface ModalMaterialProps {
  visible: boolean;
  material: Material | null;
  onClose: () => void;
  onSubmit: (nombre: string, precioCosto: string, unidad: string, stock: string) => Promise<{ success: boolean; message: string }>;
}

export default function ModalMaterial({
  visible,
  material,
  onClose,
  onSubmit,
}: ModalMaterialProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [nombre, setNombre] = React.useState('');
  const [precioCosto, setPrecioCosto] = React.useState('');
  const [unidad, setUnidad] = React.useState('');
  const [stock, setStock] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (visible) {
      if (material) {
        setNombre(material.nombre);
        setPrecioCosto(material.precioCosto.toString());
        setUnidad(material.unidad);
        setStock(material.stock.toString());
      } else {
        setNombre('');
        setPrecioCosto('');
        setUnidad('');
        setStock('');
      }

      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, material]);

  const handleSubmit = async () => {
    if (!nombre || !precioCosto || !unidad || !stock) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await onSubmit(nombre, precioCosto, unidad, stock);
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsLoading(false);
    }
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {material ? 'Editar Material' : 'Nuevo Material'}
              </Text>
              <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <FloatingLabelInput
                label="Nombre del material"
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej: Madera, Pintura, Herramientas..."
                autoFocus={true}
              />
              
              <FloatingLabelInput
                label="Precio de costo"
                value={precioCosto}
                onChangeText={setPrecioCosto}
                placeholder="0.00"
                keyboardType="numeric"
              />
              
              <FloatingLabelInput
                label="Unidad de medida"
                value={unidad}
                onChangeText={setUnidad}
                placeholder="Ej: metro, unidad, hora..."
              />
              
              <FloatingLabelInput
                label="Stock disponible"
                value={stock}
                onChangeText={setStock}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

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
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <MaterialCommunityIcons name="check" size={20} color="#ffffff" />
                <Text style={styles.modalButtonText}>
                  {isLoading ? 'Guardando...' : 'Guardar'}
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
    maxHeight: '80%',
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
    backgroundColor: '#f0f4ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderTopLeftRadius: wp('6%'),
    borderTopRightRadius: wp('6%'),
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: '700',
    color: '#1e293b',
  },
  closeIcon: {
    padding: wp('2.5%'),
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  modalBody: {
    padding: wp('5%'),
    backgroundColor: '#ffffff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: wp('4%'),
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('2%'),
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('5%'),
    gap: wp('2%'),
  },
  modalButtonPrimary: {
    backgroundColor: '#2563eb',
  },
  modalButtonSecondary: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  modalButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  modalButtonText: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: '#ffffff',
  },
  modalButtonTextSecondary: {
    color: '#64748b',
  },
}); 