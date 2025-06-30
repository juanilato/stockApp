// components/NuevaVenta/ModalCantidad.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../../styles/theme';
import { ProductoSeleccionado } from '../hooks/useSeleccionados';

interface Props {
  visible: boolean;
  producto: ProductoSeleccionado | null;
  onClose: () => void;
  onUpdateCantidad: (producto: ProductoSeleccionado, cantidad: number) => void;
  onDelete: (producto: ProductoSeleccionado) => void;
}

export default function ModalCantidad({
  visible,
  producto,
  onClose,
  onUpdateCantidad,
  onDelete,
}: Props) {
  const [cantidad, setCantidad] = React.useState('1');
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setCantidad(producto?.cantidad.toString() || '1');
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, producto]);

  const handleUpdate = () => {
    if (producto) {
      onUpdateCantidad(producto, parseInt(cantidad) || 1);
    }
  };
  
  const handleDelete = () => {
    if (producto) {
      onDelete(producto);
    }
  };

  if (!producto) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cantidad</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                value={cantidad}
                onChangeText={setCantidad}
                keyboardType="numeric"
                placeholder="Cantidad"
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={handleUpdate}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleDelete}
              >
                <MaterialCommunityIcons name="delete-outline" size={20} color={colors.red[600]} />
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary, { color: colors.red[600] }]}>
                  Eliminar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleUpdate}
              >
                <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                <Text style={styles.modalButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.dark,
  },
  closeButton: {
    padding: spacing.sm,
  },
  modalBody: {
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: typography.sizes.base,
    backgroundColor: colors.white,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.sm,
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: colors.gray[100],
  },
  modalButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  modalButtonTextSecondary: {
    color: colors.gray[700],
  },
});
