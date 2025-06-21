// components/NuevaVenta/AccionesVenta.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onGuardar: () => void;
  onQR: () => void;
  deshabilitado: boolean;
}

export default function AccionesVenta({ onGuardar, onQR, deshabilitado }: Props) {
  return (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.qrButton, deshabilitado && styles.actionButtonDisabled]}
        onPress={onQR}
        disabled={deshabilitado}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="qrcode"
          size={24}
          color={deshabilitado ? '#94a3b8' : '#ffffff'}
        />
        <Text style={[styles.buttonText, deshabilitado && styles.buttonTextDisabled]}>
          QR Pago
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.saveButton, deshabilitado && styles.actionButtonDisabled]}
        onPress={onGuardar}
        disabled={deshabilitado}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="content-save"
          size={24}
          color={deshabilitado ? '#94a3b8' : '#ffffff'}
        />
        <Text style={[styles.buttonText, deshabilitado && styles.buttonTextDisabled]}>
          Guardar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  qrButton: {
    backgroundColor: '#3b82f6',
  },
  saveButton: {
    backgroundColor: '#10b981',
  },
  actionButtonDisabled: {
    backgroundColor: '#f1f5f9',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#94a3b8',
  },
});
