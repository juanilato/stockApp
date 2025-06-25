import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Producto } from '../../../services/db';

interface ProductoItemProps {
  producto: Producto;
  onEdit?: (producto: Producto) => void;
  onDelete?: (producto: Producto) => void;
  onComponentes?: (producto: Producto) => void;
  onVariantes?: (producto: Producto) => void;
}

function SwipeActions({ item, onEdit, onDelete }: any) {
  return (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity
        style={[styles.quickAction, styles.quickEdit]}
        onPress={() => onEdit(item)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="pencil-outline" size={22} color="#64748b" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.quickAction, styles.quickDelete]}
        onPress={() => onDelete(item)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="trash-can-outline" size={22} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

function SwipeLeftActions({ item, onComponentes, onVariantes }: any) {
  return (
    <View style={styles.quickActionsContainerLeft}>
      <TouchableOpacity
        style={[styles.quickAction, styles.quickComponentes]}
        onPress={() => onComponentes(item)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="tools" size={22} color="#2563eb" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.quickAction, styles.quickVariantes]}
        onPress={() => onVariantes(item)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="shape-plus" size={22} color="#10b981" />
      </TouchableOpacity>
    </View>
  );
}

export default function ProductoItem({ producto, onEdit, onDelete, onComponentes, onVariantes }: ProductoItemProps) {
  const margen = producto.precioVenta && producto.precioCosto
    ? (parseFloat(producto.precioVenta.toString()) - parseFloat(producto.precioCosto.toString())).toFixed(2)
    : '0.00';

  return (
    <View style={styles.productoWrapper}>
      <Swipeable
        renderRightActions={() => (
          <SwipeActions item={producto} onEdit={onEdit} onDelete={onDelete} />
        )}
        renderLeftActions={() => (
          <SwipeLeftActions item={producto} onComponentes={onComponentes} onVariantes={onVariantes} />
        )}
        overshootRight={false}
        overshootLeft={false}
        friction={2}
        rightThreshold={40}
        leftThreshold={40}
      >
        <View style={styles.productoCard}>
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="package-variant" size={22} color="#64748b" />
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.nombre}>{producto.nombre}</Text>
              <Text style={styles.stock}>Stock: {producto.stock} unidades</Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.venta}>${producto.precioVenta}</Text>
              <Text style={styles.costo}>${producto.precioCosto}</Text>
              <Text style={styles.margen}>${margen}</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  productoWrapper: {
    marginHorizontal: 12,
    marginBottom: 10,
  },
  productoCard: {
    backgroundColor: '#f8fafc', // light
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0', // subtle border
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoBox: {
    flex: 1,
    justifyContent: 'center',
  },
  nombre: {
    fontSize: wp('4.2%'),
    fontWeight: '500',
    color: '#334155',
    marginBottom: 2,
  },
  stock: {
    fontSize: wp('3.3%'),
    color: '#64748b',
    fontWeight: '400',
  },
  priceBox: {
    alignItems: 'flex-end',
    minWidth: 70,
  },
  venta: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#0ea5e9',
  },
  costo: {
    fontSize: wp('3.5%'),
    color: '#64748b',
    fontWeight: '400',
    marginTop: 2,
  },
  margen: {
    fontSize: wp('3.5%'),
    color: '#10b981',
    fontWeight: '400',
    marginTop: 2,
  },
  // Swipe actions
  quickActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    height: '100%',
    paddingRight: 8,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  quickAction: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    borderRadius: 8,
  },
  quickEdit: {
    backgroundColor: 'transparent',
  },
  quickDelete: {
    backgroundColor: 'transparent',
  },
  quickActionsContainerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    height: '100%',
    paddingLeft: 8,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  quickComponentes: {
    backgroundColor: 'transparent',
  },
  quickVariantes: {
    backgroundColor: 'transparent',
  },
}); 