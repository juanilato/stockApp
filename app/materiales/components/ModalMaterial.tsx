import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FloatingLabelInput from '../../../components/FloatingLabel';
import { Material } from '../../../services/db';
import { colors } from '../../styles/theme';
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
  const [nombre, setNombre] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [unidad, setUnidad] = useState('');
  const [stock, setStock] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'warning' } | null>(null);

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
      setToast(null);
    }
  }, [visible, material]);

  const handleSubmit = async () => {
    if (!nombre || !precioCosto || !unidad || !stock) {
      setToast({ message: 'Por favor complete todos los campos' });
      return;
    }
    if (parseFloat(precioCosto) <= 0 || parseFloat(stock) < 0) {
      setToast({ message: 'No se permiten valores negativos o cero' });
      return;
    }
    if (!Number.isFinite(Number(stock)) || !Number.isFinite(Number(precioCosto))) {
      setToast({ message: 'Valores inválidos' });
      return;
    }
    setIsLoading(true);
    try {
      const result = await onSubmit(nombre, precioCosto, unidad, stock);
      if (result.success) {
        onClose();
      } else {
        setToast({ message: result.message || 'Error al guardar', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Error al guardar', type: 'error' });
    } finally {
      setIsLoading(false);
    }
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
                {material ? 'Editar Material' : 'Nuevo Material'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <FloatingLabelInput
                label="Nombre del material"
                value={nombre}
                onChangeText={setNombre}
                placeholder=""
                autoFocus={true}
              />
              <FloatingLabelInput
                label="Precio de costo"
                value={precioCosto}
                onChangeText={setPrecioCosto}
                placeholder=""
                keyboardType="numeric"
              />
              <FloatingLabelInput
                label="Unidad de medida"
                value={unidad}
                onChangeText={setUnidad}
                placeholder=""
              />
              <FloatingLabelInput
                label="Stock disponible"
                value={stock}
                onChangeText={setStock}
                placeholder=""
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
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary, isLoading && styles.modalButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                <Text style={styles.modalButtonText}>{isLoading ? 'Guardando...' : 'Guardar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {toast && (
        <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' }}>
          <View style={{ backgroundColor: toast.type === 'error' ? '#ef4444' : '#2563eb', borderRadius: 8, padding: 12, minWidth: 180 }}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>{toast.message}</Text>
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },

  modalContent: {
    width: '100%',
    maxWidth: wp('90%'),
    backgroundColor: colors.card,
    borderRadius: wp('6%'),
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#f0f4ff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1e293b',
  },
  modalBody: {
    padding: 24,
    backgroundColor: '#fff',
  },
  modalFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
    gap: 16,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  modalButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
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
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  modalButtonTextSecondary: {
    color: '#64748b',
  },
}); 