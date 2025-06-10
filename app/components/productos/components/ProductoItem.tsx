import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Producto } from '../../../../services/db';
import { styles } from '../styles';

interface ProductoItemProps {
  item: Producto;
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
  onMenuPress: (producto: Producto) => void;
}

export function ProductoItem({ item, onEdit, onDelete, onMenuPress }: ProductoItemProps) {
  const renderRightActions = () => (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
        onPress={() => onMenuPress(item)}
      >
        <MaterialCommunityIcons name="dots-horizontal" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#10b981' }]}
        onPress={() => onEdit(item)}
      >
        <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
        onPress={() => onDelete(item.id!)}
      >
        <MaterialCommunityIcons name="delete" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      key={item.id}
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <View style={styles.productoItem}>
        <View style={styles.productoInfo}>
          <Text style={styles.productoNombre}>{item.nombre}</Text>
          <View style={styles.productoDetails}>
            <Text style={styles.productoPrecio}>Venta: ${item.precioVenta}</Text>
            <Text style={styles.productoPrecioCosto}>Costo: ${item.precioCosto}</Text>
            <Text style={styles.productoStock}>Stock: {item.stock}</Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
} 