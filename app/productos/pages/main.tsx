// productos/views/ProductosView.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

import { eliminarProducto, Material, obtenerMateriales, obtenerProductos, Producto, setupProductosDB } from '../../../services/db';
import { colors, commonStyles } from '../../styles/theme';
import { styles } from '../styles/styles';

import MenuOpciones from '../components/MenuOpciones';
import ModalComponentes from '../components/ModalComponentes';
import ModalProducto from '../components/ModalProducto';
import ModalQR from '../components/ModalQR';
import ModalVariantes from '../components/ModalVariantes';

export default function ProductosView() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [modalProductoVisible, setModalProductoVisible] = useState(false);
  const [modalVariantesVisible, setModalVariantesVisible] = useState(false);
  const [modalQRVisible, setModalQRVisible] = useState(false);
  const [modalComponentesVisible, setModalComponentesVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [qrData, setQrData] = useState('');
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    inicializar();
  }, []);

  const inicializar = async () => {
    await setupProductosDB();
    await cargarProductos();
    await cargarMateriales();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const cargarProductos = async () => {
    await obtenerProductos(setProductos);
  };

  const cargarMateriales = async () => {
    await obtenerMateriales(setMateriales);
  };

  const abrirMenu = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setMenuVisible(true);
  };

  const generarQR = (producto: Producto, variante?: any) => {
    const payload = variante
      ? {
          productoId: producto.id,
          nombre: producto.nombre,
          precioVenta: producto.precioVenta,
          varianteId: variante.id,
          varianteNombre: variante.nombre,
        }
      : {
          id: producto.id,
          nombre: producto.nombre,
          precioVenta: producto.precioVenta,
        };

    setQrData(JSON.stringify(payload));
    setModalQRVisible(true);
  };

  const manejarGuardarProducto = async (producto: Producto, esNuevo: boolean) => {
    await cargarProductos();
  };

  const manejarEliminar = (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await eliminarProducto(id);
            await cargarProductos();
          }
        }
      ]
    );
  };

  const renderProducto = ({ item }: { item: Producto }) => {
    const renderRightActions = () => (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
          onPress={() => abrirMenu(item)}
        >
          <MaterialCommunityIcons name="dots-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#10b981' }]}
          onPress={() => {
            setProductoSeleccionado(item);
            setModalProductoVisible(true);
          }}
        >
          <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
          onPress={() => manejarEliminar(item.id!)}
        >
          <MaterialCommunityIcons name="delete" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );

    return (
      <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
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
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={[commonStyles.container, { opacity: 1 }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📦 Productos</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setProductoSeleccionado(null);
              setModalProductoVisible(true);
            }}
          >
            <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
            <Text style={styles.addButtonText}>Nuevo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={productos}
          keyExtractor={(item) => item.id?.toString() || ''}
          renderItem={renderProducto}
          ListEmptyComponent={
            <View style={commonStyles.emptyState}>
              <Text style={commonStyles.emptyStateText}>No hay productos</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />

        {/* MODALES */}

          <ModalProducto
            visible={modalProductoVisible}
            onClose={() => setModalProductoVisible(false)}
            onSubmit={manejarGuardarProducto}
          />
        

        {modalVariantesVisible && productoSeleccionado && (
        <ModalVariantes
            visible={modalVariantesVisible}
            onClose={() => setModalVariantesVisible(false)}
            producto={productoSeleccionado}
            onActualizar={cargarProductos}
        />
        )}


        <ModalQR
          visible={modalQRVisible}
          onClose={() => setModalQRVisible(false)}
          qrData={qrData}
          producto={productoSeleccionado}
        />

{modalComponentesVisible && productoSeleccionado && (
  <ModalComponentes
    visible={modalComponentesVisible}
    onClose={() => {
      setModalComponentesVisible(false);
      setTimeout(() => setProductoSeleccionado(null), 100); // Limpieza segura
    }}
    producto={productoSeleccionado}
    materiales={materiales}
    onActualizar={cargarProductos}
  />
)}


        <MenuOpciones
          visible={menuVisible}
          producto={productoSeleccionado}
          onClose={() => setMenuVisible(false)}
          onGenerarQR={generarQR}
          onManejarComponentes={(p) => {
            setProductoSeleccionado(p);
            setModalComponentesVisible(true);
          }}
          onManejarVariantes={(p) => {
            setProductoSeleccionado(p);
            setModalVariantesVisible(true);
          }}
        />
      </Animated.View>
    </GestureHandlerRootView>
  );
}
