// components/NuevaVenta/ModalTransferencia.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { borderRadius, colors, shadows, spacing, typography } from '../../styles/theme';

interface Props {
  visible: boolean;
  total: number;
  onClose: () => void;
  onConfirmarPago: () => void;
}

export default function ModalTransferencia({
  visible,
  total,
  onClose,
  onConfirmarPago,
}: Props) {
  const [transferType, setTransferType] = useState<'alias' | 'account'>('alias');
  const [alias, setAlias] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cbu, setCbu] = useState('');
  const [showQR, setShowQR] = useState(false);

  const transferAmount = total;

  const generateTransferQR = () => {
    if (!alias && !accountNumber) {
      return;
    }
    setShowQR(true);
  };

  const qrData = JSON.stringify({
    tipo: 'transferencia',
    monto: transferAmount,
    alias: alias,
    cuenta: accountNumber,
    cbu: cbu,
    timestamp: new Date().toISOString(),
  });

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
              <Text style={styles.modalTitle}>Transferencia</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            {!showQR ? (
              <>
                <View style={styles.transferTypeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.transferTypeButton,
                      transferType === 'alias' && styles.transferTypeButtonActive
                    ]}
                    onPress={() => setTransferType('alias')}
                  >
                    <MaterialCommunityIcons 
                      name="account" 
                      size={20} 
                      color={transferType === 'alias' ? colors.white : colors.gray[600]} 
                    />
                    <Text
                      style={[
                        styles.transferTypeText,
                        transferType === 'alias' && styles.transferTypeTextActive
                      ]}
                    >
                      Alias
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.transferTypeButton,
                      transferType === 'account' && styles.transferTypeButtonActive
                    ]}
                    onPress={() => setTransferType('account')}
                  >
                    <MaterialCommunityIcons 
                      name="bank" 
                      size={20} 
                      color={transferType === 'account' ? colors.white : colors.gray[600]} 
                    />
                    <Text
                      style={[
                        styles.transferTypeText,
                        transferType === 'account' && styles.transferTypeTextActive
                      ]}
                    >
                      Cuenta
                    </Text>
                  </TouchableOpacity>
                </View>

                {transferType === 'alias' ? (
                  <TextInput
                    style={styles.input}
                    value={alias}
                    onChangeText={setAlias}
                    placeholder="Ingresa tu alias"
                    placeholderTextColor={colors.gray[400]}
                  />
                ) : (
                  <>
                    <TextInput
                      style={styles.input}
                      value={accountNumber}
                      onChangeText={setAccountNumber}
                      placeholder="Número de cuenta"
                      keyboardType="numeric"
                      placeholderTextColor={colors.gray[400]}
                    />
                    <TextInput
                      style={styles.input}
                      value={cbu}
                      onChangeText={setCbu}
                      placeholder="CBU"
                      keyboardType="numeric"
                      placeholderTextColor={colors.gray[400]}
                    />
                  </>
                )}

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={onClose}
                  >
                    <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={generateTransferQR}
                  >
                    <Text style={styles.modalButtonText}>Generar QR</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.qrContainer}>
                  <View style={styles.qrWrapper}>
                    <QRCode
                      value={qrData}
                      size={200}
                      color={colors.dark}
                      backgroundColor={colors.white}
                    />
                  </View>
                  <View style={styles.qrInfo}>
                    <Text style={styles.qrTotal}>Total: ${transferAmount}</Text>
                    <Text style={styles.qrInstructions}>
                      Escanea este código QR para realizar la transferencia
                    </Text>
                    <Text style={[styles.qrInstructions, { marginTop: 8, fontSize: 14, color: colors.gray[500] }]}>
                      {transferType === 'alias' ? `Alias: ${alias}` : `Cuenta: ${accountNumber}`}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={() => setShowQR(false)}
                  >
                    <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                      Cerrar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={onConfirmarPago}
                  >
                    <Text style={styles.modalButtonText}>Listo</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
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
  transferTypeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  transferTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    gap: spacing.sm,
  },
  transferTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  transferTypeText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.gray[600],
  },
  transferTypeTextActive: {
    color: colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: typography.sizes.base,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
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
  qrContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  qrWrapper: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  qrInfo: {
    alignItems: 'center',
  },
  qrTotal: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  qrInstructions: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 20,
  },
});
