// productos/views/ProductosView.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Animated, FlatList,
  Text, TouchableOpacity, View
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

import { Material, obtenerMateriales, obtenerProductos, Producto, setupProductosDB, VarianteProducto } from '../../../services/db';
import { commonStyles } from '../../styles/theme';
import { styles } from '../styles/styles';

import ModalConfirmacion from '@/components/ModalConfirmacion';
import { Provider as PaperProvider } from 'react-native-paper';
import CustomToast from '../../../components/CustomToast';
import MenuOpciones from '../components/MenuOpciones';
import ModalBarCode from '../components/ModalBarCode';
import ModalComponentes from '../components/ModalComponentes';
import ModalProducto from '../components/ModalProducto';
import ModalScanner from '../components/ModalScanner';
import ModalVariantes from '../components/ModalVariantes';

// Importar funciones separadas
import {
  generarCodigoBarrasPayload,
  manejarEliminarProducto,
  manejarGuardarProducto,
  ToastType
} from '../functions';

export default function ProductosView() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [modalProductoVisible, setModalProductoVisible] = useState(false);
  const [modalVariantesVisible, setModalVariantesVisible] = useState(false);
  const [modalBarcodeVisible, setModalBarcodeVisible] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');
  const [modalComponentesVisible, setModalComponentesVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | null>(null);
  const [menuVisibleOpciones, setMenuVisibleOpciones] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [toast, setToast] = useState<ToastType>(null);

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    inicializar();
  }, []);

  // Inicialización
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

  // Cargar datos
  const cargarProductos = async () => {
    await obtenerProductos(setProductos);
  };

  const cargarMateriales = async () => {
    await obtenerMateriales(setMateriales);
  };

  // Manejadores de eventos
  const abrirMenu = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setMenuVisible(true);
  };

  const generarCodigoBarras = (producto: Producto, variante?: VarianteProducto) => {
    const payload = generarCodigoBarrasPayload(producto, variante);
    setProductoSeleccionado(producto);
    setVarianteSeleccionada(variante || null);
    setBarcodeData(JSON.stringify(payload));
    setModalBarcodeVisible(true);
  };

  const handleGuardarProducto = async (producto: Producto, esNuevo: boolean) => {
    await manejarGuardarProducto(producto, esNuevo, cargarProductos, setToast);
  };

  const handleEliminarProducto = (id: number) => {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      setProductoAEliminar(producto);
    }
  };

  const confirmarEliminacion = async () => {
    if (productoAEliminar?.id) {
      await manejarEliminarProducto(productoAEliminar.id, cargarProductos, setToast, setProductoAEliminar);
    }
  };

  // Componente de acciones de swipe modernizado
  const SwipeActions = ({ item, progress, dragX }: any) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 0.8, 0],
      extrapolate: 'clamp',
    });

    const editScale = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1.2, 1, 0.8],
      extrapolate: 'clamp',
    });

    const deleteScale = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1.2, 1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.swipeActionsContainer}>
        {/* Botón Editar */}
        <Animated.View 
          style={[
            styles.swipeActionButton,
            styles.swipeActionEdit,
            {
              transform: [{ scale: editScale }],
              opacity: opacity,
            }
          ]}
        >
          <TouchableOpacity
            style={styles.swipeActionTouchable}
            onPress={() => abrirMenu(item)}
            activeOpacity={0.8}
          >
            <View style={styles.swipeActionContent}>
              <View style={styles.swipeActionIconContainer}>
                <MaterialCommunityIcons name="pencil" size={20} color="#ffffff" />
              </View>
              <Text style={styles.swipeActionText}>Editar</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Botón Eliminar */}
        <Animated.View 
          style={[
            styles.swipeActionButton,
            styles.swipeActionDelete,
            {
              transform: [{ scale: deleteScale }],
              opacity: opacity,
            }
          ]}
        >
          <TouchableOpacity
            style={styles.swipeActionTouchable}
            onPress={() => handleEliminarProducto(item.id!)}
            activeOpacity={0.8}
          >
            <View style={styles.swipeActionContent}>
              <View style={styles.swipeActionIconContainer}>
                <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ffffff" />
              </View>
              <Text style={styles.swipeActionText}>Eliminar</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  // Renderizado de productos modernizado
  const renderProducto = ({ item }: { item: Producto }) => {
    return (
      <View style={styles.productoWrapper}>
        <Swipeable 
          renderRightActions={(progress, dragX) => (
            <SwipeActions item={item} progress={progress} dragX={dragX} />
          )}
          overshootRight={false}
          friction={2}
          rightThreshold={40}
        >
          <View style={styles.productoCard}>
            <View style={styles.productoHeader}>
              <View style={styles.productoIcon}>
                <MaterialCommunityIcons name="package-variant" size={20} color="#3b82f6" />
              </View>
              <View style={styles.productoInfo}>
                <Text style={styles.productoNombre}>{item.nombre}</Text>
                <View style={styles.productoMeta}>
                  <Text style={styles.productoStock}>
                    Stock: {item.stock} unidades
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.productoPrecios}>
              <View style={styles.precioItem}>
                <Text style={styles.precioLabel}>Precio de Venta</Text>
                <Text style={styles.precioVenta}>${item.precioVenta}</Text>
              </View>
              <View style={styles.precioItem}>
                <Text style={styles.precioLabel}>Precio de Costo</Text>
                <Text style={styles.precioCosto}>${item.precioCosto}</Text>
              </View>
              <View style={styles.precioItem}>
                <Text style={styles.precioLabel}>Margen</Text>
                <Text style={styles.precioMargen}>
                  ${(item.precioVenta - item.precioCosto).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </Swipeable>
      </View>
    );
  };

  // Vista principal
  return (
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={commonStyles.container}>
          {/* Header modernizado */}
          <View style={styles.headerProductos}>
            <View style={styles.headerContent}>
              <View style={styles.headerText}>
                <Text style={styles.headerSectionLabel}>Catálogo</Text>
                <Text style={styles.headerTitle}>Mis Productos</Text>
                <Text style={styles.headerSubtitle}>
                  {productos.length} productos en inventario
                </Text>
              </View>
              
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => {
                    setMenuVisibleOpciones(false);
                    setScannerVisible(true);
                  }}
                >
                  <MaterialCommunityIcons name="barcode-scan" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Botón flotante modernizado */}
          <View style={styles.fabContainer}>
            <TouchableOpacity
              style={styles.fab}
              onPress={() => {
                setMenuVisibleOpciones(false);
                setProductoSeleccionado(null);
                setModalProductoVisible(true);
              }}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Lista de productos */}
          <FlatList
            data={productos}
            keyExtractor={(item) => item.id?.toString() || ''}
            renderItem={renderProducto}
            ListEmptyComponent={
              <View style={commonStyles.emptyState}>
                <MaterialCommunityIcons name="package-variant" size={64} color="#94a3b8" />
                <Text style={commonStyles.emptyStateText}>No hay productos</Text>
                <Text style={styles.emptyStateSubtext}>
                  Agrega tu primer producto para comenzar
                </Text>
              </View>
            }
            ListHeaderComponent={<View style={{ height: 16 }} />}
            contentContainerStyle={{ paddingBottom: 100 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            showsVerticalScrollIndicator={false}
          />

          {/* MODALES */}
          <ModalProducto
            visible={modalProductoVisible}
            onClose={() => setModalProductoVisible(false)}
            onSubmit={handleGuardarProducto}
            productoEditado={productoSeleccionado}
          />

          {modalVariantesVisible && productoSeleccionado && (
            <ModalVariantes
              visible={modalVariantesVisible}
              onClose={() => setModalVariantesVisible(false)}
              producto={productoSeleccionado}
              onActualizar={cargarProductos}
            />
          )}

          <ModalScanner
            visible={scannerVisible}
            productos={productos}
            onClose={() => setScannerVisible(false)}
            onSubmit={handleGuardarProducto}
          />

          <ModalBarCode
            visible={modalBarcodeVisible}
            onClose={() => setModalBarcodeVisible(false)}
            barcodeData={barcodeData}
            producto={productoSeleccionado!}
            variante={varianteSeleccionada}
          />

          {modalComponentesVisible && productoSeleccionado && (
            <ModalComponentes
              visible={modalComponentesVisible}
              onClose={() => {
                setModalComponentesVisible(false);
                setTimeout(() => setProductoSeleccionado(null), 100);
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
            onGenerarQR={generarCodigoBarras}
            onEditarProducto={(p) => {
              setProductoSeleccionado(p);
              setModalProductoVisible(true);
            }}
            onManejarComponentes={(p) => {
              setProductoSeleccionado(p);
              setModalComponentesVisible(true);
            }}
            onManejarVariantes={(p) => {
              setProductoSeleccionado(p);
              setModalVariantesVisible(true);
            }}
          />
        </View>

        {/* Toast */}
        {toast && !modalProductoVisible && !modalVariantesVisible && !modalBarcodeVisible && !modalComponentesVisible && !menuVisible && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Modal de confirmación */}
        <ModalConfirmacion
          visible={!!productoAEliminar}
          mensaje={`¿Deseas eliminar el producto "${productoAEliminar?.nombre}"?`}
          onCancelar={() => setProductoAEliminar(null)}
          onConfirmar={confirmarEliminacion}
        />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
