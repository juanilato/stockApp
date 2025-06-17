// components/NuevaVenta/ModalCantidad.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { colors } from '../../styles/theme';
import { styles } from '../main'; // Ajustar si cambia ubicación

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
              styles.modalContentTop,
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
