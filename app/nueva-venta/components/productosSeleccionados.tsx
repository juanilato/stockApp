// components/NuevaVenta/ProductosSeleccionados.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Producto } from '../../../services/db';
import { styles } from '../main'; // Ajustar según tu estructura

interface ProductoSeleccionado extends Producto {
  cantidad: number;
  varianteSeleccionada?: {
    id: number;
    nombre: string;
    stock: number;
  };
}

interface Props {
  productosSeleccionados: ProductoSeleccionado[];
  actualizarCantidad: (productoId: number, nuevaCantidad: number, varianteId?: number) => void;
  quitarProducto: (productoId: number, varianteId?: number) => void;
  calcularTotal: () => number;
  calcularGanancia: () => number;
}

export default function ProductosSeleccionados({
  productosSeleccionados,
  actualizarCantidad,
  quitarProducto,
  calcularTotal,
  calcularGanancia,
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
              <MaterialCommunityIcons name="minus" size={20} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.cantidadText}>{item.cantidad}</Text>
            <TouchableOpacity
              onPress={() => actualizarCantidad(item.id!, item.cantidad + 1, item.varianteSeleccionada?.id)}
              style={styles.cantidadButton}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => quitarProducto(item.id!, item.varianteSeleccionada?.id)}
      >
        <MaterialCommunityIcons name="close" size={20} color="#64748b" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.selectedProducts}>
      <View style={styles.selectedHeader}>
        <Text style={styles.sectionTitle}>Total</Text>
        <FlatList
          data={productosSeleccionados}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString() || ''}
          style={styles.lista}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay productos seleccionados</Text>
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
            <Text style={styles.totalValue}>${calcularTotal()}</Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Ganancia</Text>
            <Text style={styles.totalValue}>${calcularGanancia()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
