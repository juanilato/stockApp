// components/NuevaVenta/ModalVariante.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Producto, VarianteProducto } from '../../../services/db';
import { borderRadius, colors, shadows, spacing, typography } from '../../styles/theme';

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
    maxHeight: '80%',
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
    flex: 1,
  },
  closeButton: {
    padding: spacing.sm,
  },
  modalBody: {
    flex: 1,
  },
  varianteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  varianteInfo: {
    flex: 1,
  },
  varianteNombre: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  varianteStock: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
});
