// components/NuevaVenta/ProductosSeleccionados.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Producto } from '../../../services/db';
import AccionesVenta from './accionesVenta';

interface ProductoSeleccionado extends Producto {
  cantidad: number;
  varianteSeleccionada?: {
    id: number;
    nombre: string;
    stock: number;
  } | null;
}

interface Props {
  productosSeleccionados: ProductoSeleccionado[];
  actualizarCantidad: (productoId: number, nuevaCantidad: number, varianteId?: number) => void;
  quitarProducto: (productoId: number, varianteId?: number) => void;
  calcularTotal: () => number;
  calcularGanancia: () => number;
  onGuardar: () => void; // ← FALTABA ESTO
  onQR: () => void;
}

export default function ProductosSeleccionados({
  productosSeleccionados,
  actualizarCantidad,
  quitarProducto,
  calcularTotal,
  calcularGanancia,
  onGuardar,
  onQR,

}: Props) {
  const renderItem = ({ item }: { item: ProductoSeleccionado }) => (
    <View style={styles.productoSeleccionado}>
      <View style={styles.productoSeleccionadoInfo}>
        <Text style={styles.productoSeleccionadoNombre} numberOfLines={1}>
          {item.nombre}
          {item.varianteSeleccionada && ` - ${item.varianteSeleccionada.nombre}`}
        </Text>
        <View style={styles.productoSeleccionadoDetails}>
          <Text style={styles.productoSeleccionadoPrecio}>${item.precioVenta}</Text>
          <View style={styles.cantidadContainer}>
            <TouchableOpacity
              onPress={() => actualizarCantidad(item.id!, item.cantidad - 1, item.varianteSeleccionada?.id)}
              style={styles.cantidadButton}
            >
              <MaterialCommunityIcons name="minus" size={20} color="#1e293b" />
            </TouchableOpacity>
            <Text style={styles.cantidadText}>{item.cantidad}</Text>
            <TouchableOpacity
              onPress={() => actualizarCantidad(item.id!, item.cantidad + 1, item.varianteSeleccionada?.id)}
              style={styles.cantidadButton}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#1e293b" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => quitarProducto(item.id!, item.varianteSeleccionada?.id)}
      >
        <MaterialCommunityIcons name="close" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.selectedProducts}>
      <View style={styles.selectedHeader}>
        <Text style={styles.sectionTitle}>Productos Seleccionados</Text>
        <FlatList
          data={productosSeleccionados}
          renderItem={renderItem}
          keyExtractor={item => `${item.id}-${item.varianteSeleccionada?.id || 'base'}`}
          style={styles.lista}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="cart-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyText}>No hay productos seleccionados</Text>
              <Text style={styles.emptySubtext}>Escanea o selecciona productos para comenzar</Text>
            </View>
          }
        />
        <View style={styles.totalsContainer}>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Productos</Text>
            <Text style={styles.totalValue}>
              {productosSeleccionados.reduce((total, p) => total + p.cantidad, 0)}
            </Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={[styles.totalValue, styles.totalAmount]}>${calcularTotal()}</Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Ganancia</Text>
            <Text style={[styles.totalValue, styles.gananciaAmount]}>${calcularGanancia()}</Text>
          </View>
        </View>
        <AccionesVenta
          onGuardar={onGuardar}
          onQR={onQR}
          deshabilitado={productosSeleccionados.length === 0}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedProducts: {
    flex: 0.4,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  selectedHeader: {
    flex: 1,
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
  productoSeleccionado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productoSeleccionadoInfo: {
    flex: 1,
    marginRight: 12,
  },
  productoSeleccionadoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  productoSeleccionadoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productoSeleccionadoPrecio: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '700',
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cantidadButton: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  cantidadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  totalsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  totalLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  totalAmount: {
    fontSize: 20,
    color: '#3b82f6',
  },
  gananciaAmount: {
    fontSize: 18,
    color: '#10b981',
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
