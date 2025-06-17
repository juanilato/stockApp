// components/NuevaVenta/ModalVariante.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Producto, VarianteProducto } from '../../../services/db';
import { colors } from '../../styles/theme';
import { styles } from '../main';

interface Props {
  visible: boolean;
  producto: Producto | null;
  onClose: () => void;
  onSelectVariante: (producto: Producto, variante: VarianteProducto) => void;
}

export default function ModalVariante({
  visible,
  producto,
  onClose,
  onSelectVariante,
}: Props) {
  if (!producto || !producto.variantes) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Seleccionar Variante - {producto.nombre}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            {producto.variantes.map((variante) => (
              <TouchableOpacity
                key={variante.id}
                style={styles.varianteItem}
                onPress={() => {
                  onSelectVariante(producto, variante);
                  onClose();
                }}
              >
                <View style={styles.varianteInfo}>
                  <Text style={styles.varianteNombre}>{variante.nombre}</Text>
                  <Text style={styles.varianteStock}>Stock: {variante.stock}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.gray[400]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
