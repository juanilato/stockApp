// components/ModalConfirmacion.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { colors } from '../styles/theme';
import { styles } from './ModalConfirmacion.styles'; // Lo armamos después

interface Props {
  visible: boolean;
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ModalConfirmacion({
  visible,
  mensaje,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancelar}
    >
      <TouchableWithoutFeedback onPress={onCancelar}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={40}
              color={colors.warning}
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.texto}>{mensaje}</Text>
            <View style={styles.botones}>
              <TouchableOpacity
                style={[styles.boton, styles.botonCancelar]}
                onPress={onCancelar}
              >
                <Text style={styles.botonTextoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boton, styles.botonConfirmar]}
                onPress={onConfirmar}
              >
                <Text style={styles.botonTextoConfirmar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
