// components/NuevaVenta/ProductosDisponibles.tsx
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Producto } from '../../../services/db';
import { styles } from '../main'; // Ajustá si lo movés

interface Props {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

export default function ProductosDisponibles({ productos, onAgregar }: Props) {
  const renderItem = ({ item }: { item: Producto }) => (
    <TouchableOpacity
      style={styles.productoItem}
      onPress={() => onAgregar(item)}
    >
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre} numberOfLines={1}>{item.nombre}</Text>
        <View style={styles.productoDetails}>
          <Text style={styles.productoPrecio}>${item.precioVenta}</Text>
          <Text style={styles.productoStock}>
            {item.variantes && item.variantes.length > 0
              ? `${item.variantes.length} variante${item.variantes.length !== 1 ? 's' : ''}`
              : `Stock: ${item.stock}`}
          </Text>
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
        numColumns={3}
        columnWrapperStyle={styles.productRow}
        scrollEnabled={false}
      />
    </View>
  );
}
