// components/NuevaVenta/ProductosDisponibles.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Producto } from '../../../services/db';

interface Props {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
  onSeleccionarProducto?: (producto: Producto) => void;
}

export default function ProductosDisponibles({ productos, onAgregar, onSeleccionarProducto }: Props) {
  const renderItem = ({ item }: { item: Producto }) => (
    <TouchableOpacity
      style={styles.productoItem}
      onPress={() => {
        if (onSeleccionarProducto && item.variantes && item.variantes.length > 0) {
          onSeleccionarProducto(item);
        } else {
          onAgregar(item);
        }
      }}
      activeOpacity={0.7}
    >
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre} numberOfLines={2}>{item.nombre}</Text>
        <View style={styles.productoDetails}>
          <Text style={styles.productoPrecio}>${item.precioVenta}</Text>
          <View style={styles.stockContainer}>
            <MaterialCommunityIcons 
              name={item.variantes && item.variantes.length > 0 ? "package-variant" : "package-variant-closed"} 
              size={12} 
              color="#64748b" 
            />
            <Text style={styles.productoStock}>
              {item.variantes && item.variantes.length > 0
                ? `${item.variantes.length} variante${item.variantes.length !== 1 ? 's' : ''}`
                : `${item.stock} unidades`}
            </Text>
          </View>
        </View>
        <View style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={16} color="#3b82f6" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.productsList}>
      <Text style={styles.sectionTitle}>Productos Disponibles</Text>
      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString() || ''}
        style={styles.lista}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="package-variant" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>No hay productos disponibles</Text>
            <Text style={styles.emptySubtext}>Agrega productos desde el catálogo</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  productsList: {
    flex: 0.6,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  lista: {
    flex: 1,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productoItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  productoInfo: {
    flex: 1,
  },
  productoNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 18,
  },
  productoDetails: {
    flexDirection: 'column',
    gap: 4,
  },
  productoPrecio: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '700',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productoStock: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 12,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
});
