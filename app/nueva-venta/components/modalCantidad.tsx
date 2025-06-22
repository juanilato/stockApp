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

interface Props {
  visible: boolean;
  cantidad: string;
  setCantidad: (value: string) => void;
  onAgregar: () => void;
  onClose: () => void;
  slideAnim: Animated.Value;
}

export default function ModalCantidad({
  visible,
  cantidad,
  setCantidad,
  onAgregar,
  onClose,
  slideAnim,
}: Props) {
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
                      outputRange: [-300, 0],
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
                onSubmitEditing={onAgregar}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={onClose}
              >
                <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={onAgregar}
              >
                <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                <Text style={styles.modalButtonText}>Agregar</Text>
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
