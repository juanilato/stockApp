// components/NuevaVenta/ModalQRPago.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../../styles/theme';
import { styles } from '../main';

interface Props {
  visible: boolean;
  qrData: string;
  total: number;
  onClose: () => void;
  onConfirmarPago: () => void;
}

export default function ModalQRPago({
  visible,
  qrData,
  total,
  onClose,
  onConfirmarPago,
}: Props) {
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
              <Text style={styles.modalTitle}>Pago con Mercado Pago</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialCommunityIcons name="close-circle" size={28} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.qrContainer}>
              <View style={styles.qrWrapper}>
                <QRCode
                  value={qrData}
                  size={250}
                  backgroundColor="white"
                  color="black"
                />
              </View>
              <View style={styles.qrInfo}>
                <Text style={styles.qrTotal}>Total: ${total}</Text>
                <Text style={styles.qrInstructions}>
                  Escanea este código con la app de Mercado Pago para pagar
                </Text>
              </View>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={onClose}
              >
                <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={onConfirmarPago}
              >
                <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
