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
  onSelectVariante: (producto: Producto, variante: VarianteProducto | null) => void;
}

export default function ModalVariante({
  visible,
  producto,
  onClose,
  onSelectVariante,
}: Props) {
  if (!producto) return null;

  // Opciones: base primero si tiene stock, luego variantes con stock
  const opciones: Array<{ tipo: 'base' | 'variante'; nombre: string; stock: number; id: string | number; variante?: VarianteProducto | null }> = [];
  if (producto.stock > 0) {
    opciones.push({
      tipo: 'base',
      nombre: producto.nombre + ' (Producto base)',
      stock: producto.stock,
      id: 'base',
      variante: null,
    });
  }
  if (producto.variantes) {
    producto.variantes.forEach((variante) => {
      if (variante.stock > 0) {
        opciones.push({
          tipo: 'variante',
          nombre: variante.nombre,
          stock: variante.stock,
          id: variante.id,
          variante,
        });
      }
    });
  }

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
            {opciones.length === 0 && (
              <Text style={{ color: colors.gray[500], textAlign: 'center', marginTop: 24 }}>No hay stock disponible</Text>
            )}
            {opciones.map((opcion) => (
              <TouchableOpacity
                key={opcion.id}
                style={[
                  styles.varianteItem,
                  opcion.tipo === 'base' && styles.baseItemDestacado,
                ]}
                onPress={() => {
                  onSelectVariante(producto, opcion.variante || null);
                  onClose();
                }}
              >
                <View style={styles.varianteInfo}>
                  <Text style={[styles.varianteNombre, opcion.tipo === 'base' && styles.baseNombre]}>{opcion.nombre}</Text>
                  <Text style={styles.varianteStock}>Stock: {opcion.stock}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '94%',
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
    flex: 1,
  },
  closeButton: {
    padding: spacing.sm,
  },
  modalBody: {
    // Eliminar flex: 1 para evitar que estire el modal
    // Dejar vacío o solo margin si se requiere
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
  baseItemDestacado: {
    backgroundColor: '#fef9c3',
    borderWidth: 2,
    borderColor: '#facc15',
  },
  baseNombre: {
    color: '#b45309',
    fontWeight: 'bold',
  },
});
