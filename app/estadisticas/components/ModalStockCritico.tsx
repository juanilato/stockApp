import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ModalStockCriticoProps {
  visible: boolean;
  productos: { id: number; nombre: string; stock: number }[];
  onClose: () => void;
}

export default function ModalStockCritico({ visible, productos, onClose }: ModalStockCriticoProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <MaterialCommunityIcons name="alert-circle" size={24} color="#ef4444" />
              <Text style={styles.title}>Stock Crítico</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {productos.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="check-circle" size={48} color="#10b981" />
                <Text style={styles.emptyText}>No hay productos con stock crítico</Text>
              </View>
            ) : (
              productos.map((producto) => (
                <View key={producto.id} style={styles.productoItem}>
                  <View style={styles.productoInfo}>
                    <Text style={styles.productoNombre}>{producto.nombre}</Text>
                    <Text style={styles.productoStock}>
                      Stock actual: {producto.stock} unidades
                    </Text>
                  </View>
                  <View style={styles.stockBadge}>
                    <Text style={styles.stockBadgeText}>{producto.stock}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.closeModalButton}>
              <Text style={styles.closeModalText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 12,
    textAlign: 'center',
  },
  productoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  productoInfo: {
    flex: 1,
  },
  productoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  productoStock: {
    fontSize: 14,
    color: '#64748b',
  },
  stockBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 40,
    alignItems: 'center',
  },
  stockBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  closeModalButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeModalText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 