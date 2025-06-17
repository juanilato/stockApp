// components/NuevaVenta/ModalTransferencia.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../../styles/theme';
import { styles } from '../main';

interface Props {
  visible: boolean;
  transferQRData: string;
  transferAmount: string;
  transferAlias: string;
  transferAccountId: string;
  transferType: 'alias' | 'account';
  onChangeAmount: (val: string) => void;
  onChangeAlias: (val: string) => void;
  onChangeAccountId: (val: string) => void;
  onChangeType: (type: 'alias' | 'account') => void;
  onClose: () => void;
  onGenerarQR: () => void;
  onReset: () => void;
}

export default function ModalTransferencia({
  visible,
  transferQRData,
  transferAmount,
  transferAlias,
  transferAccountId,
  transferType,
  onChangeAmount,
  onChangeAlias,
  onChangeAccountId,
  onChangeType,
  onClose,
  onGenerarQR,
  onReset
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
              <Text style={styles.modalTitle}>Transferencia</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialCommunityIcons name="close-circle" size={28} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            {!transferQRData ? (
              <>
                <View style={styles.transferTypeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.transferTypeButton,
                      transferType === 'alias' && styles.transferTypeButtonActive
                    ]}
                    onPress={() => onChangeType('alias')}
                  >
                    <MaterialCommunityIcons
                      name="account"
                      size={24}
                      color={transferType === 'alias' ? colors.white : colors.gray[700]}
                    />
                    <Text style={[
                      styles.transferTypeText,
                      transferType === 'alias' && styles.transferTypeTextActive
                    ]}>Alias</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.transferTypeButton,
                      transferType === 'account' && styles.transferTypeButtonActive
                    ]}
                    onPress={() => onChangeType('account')}
                  >
                    <MaterialCommunityIcons
                      name="bank"
                      size={24}
                      color={transferType === 'account' ? colors.white : colors.gray[700]}
                    />
                    <Text style={[
                      styles.transferTypeText,
                      transferType === 'account' && styles.transferTypeTextActive
                    ]}>ID Cuenta</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  value={transferAmount}
                  onChangeText={onChangeAmount}
                  keyboardType="numeric"
                  placeholder="Monto a transferir"
                  returnKeyType="next"
                />

                {transferType === 'alias' ? (
                  <TextInput
                    style={styles.input}
                    value={transferAlias}
                    onChangeText={onChangeAlias}
                    placeholder="Alias de Mercado Pago"
                    returnKeyType="done"
                    onSubmitEditing={onGenerarQR}
                  />
                ) : (
                  <TextInput
                    style={styles.input}
                    value={transferAccountId}
                    onChangeText={onChangeAccountId}
                    placeholder="ID de cuenta de Mercado Pago"
                    keyboardType="numeric"
                    returnKeyType="done"
                    onSubmitEditing={onGenerarQR}
                  />
                )}

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
                    onPress={onGenerarQR}
                  >
                    <MaterialCommunityIcons name="qrcode" size={20} color={colors.white} />
                    <Text style={styles.modalButtonText}>Generar QR</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.qrContainer}>
                  <QRCode
                    value={transferQRData}
                    size={250}
                    backgroundColor="white"
                    color="black"
                  />
                  <Text style={styles.qrTotal}>Total: ${transferAmount}</Text>
                  <Text style={styles.qrInstructions}>
                    Escanea este código con la app de Mercado Pago
                  </Text>
                  <Text style={[styles.qrInstructions, { marginTop: 8, fontSize: 14, color: colors.gray[500] }]}>
                    Asegúrate de tener la última versión de la app instalada
                  </Text>
                </View>

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={onReset}
                  >
                    <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
                    <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cerrar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={onReset}
                  >
                    <MaterialCommunityIcons name="check" size={20} color={colors.white} />
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
