// productos/views/ProductosView.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Animated, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

import { actualizarProducto, eliminarProducto, insertarProducto, Material, obtenerMateriales, obtenerProductos, Producto, setupProductosDB, VarianteProducto } from '../../../services/db';
import { commonStyles } from '../../styles/theme';
import { styles } from '../styles/styles';

import ModalConfirmacion from '@/components/ModalConfirmacion';
import CustomToast from '../../../components/CustomToast';
import MenuOpciones from '../components/MenuOpciones';
import ModalComponentes from '../components/ModalComponentes';
import ModalProducto from '../components/ModalProducto';
import ModalQR from '../components/ModalQR';
import ModalVariantes from '../components/ModalVariantes';


export default function ProductosView() {
  const [productos, setProductos] = useState<Producto[]>([]); // productos de la db
  const [materiales, setMateriales] = useState<Material[]>([]); // materiales de la db
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null); // producto seleccionado para editar o ver detalles
  const [modalProductoVisible, setModalProductoVisible] = useState(false); // modal para crear/editar producto
  const [modalVariantesVisible, setModalVariantesVisible] = useState(false); // modal para ver variantes del producto
  const [modalQRVisible, setModalQRVisible] = useState(false); // modal para generar QR del producto
  const [modalComponentesVisible, setModalComponentesVisible] = useState(false); // modal para ver componentes del producto
  const [menuVisible, setMenuVisible] = useState(false); // menu de opciones del producto 
  const [qrData, setQrData] = useState(''); // datos del QR a generar
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | null>(null);

  const fadeAnim = new Animated.Value(0); 

  useEffect(() => {
    inicializar();
  }, []);

  // setea los productos y materiales al iniciar la vista
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


  // carga los productos de la db guarda en productos
  const cargarProductos = async () => {
    await obtenerProductos(setProductos);
  };


  // carga los materiales de la db y guarda en materiales
  const cargarMateriales = async () => {
    await obtenerMateriales(setMateriales);
  };

  // abre el menu de opciones para el producto seleccionado
  const abrirMenu = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setMenuVisible(true);
  };


  // genera el QR donde incluye:
  // - Si tiene variante, incluye id, nombre y precio de venta de la variante (variante.id, variante.nombre, variante.precioVenta)
  // - Si no tiene variante, incluye id, nombre y precio de venta del producto 
const generarQR = (producto: Producto, variante?: VarianteProducto) => {
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

  setProductoSeleccionado(producto);
  setVarianteSeleccionada(variante || null); // ← guardar variante
  setQrData(JSON.stringify(payload));
  setModalQRVisible(true);
};

  // maneja el guardado del producto (nuevo o editado)

  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'warning' } | null>(null);
  const manejarGuardarProducto = async (producto: Producto, esNuevo: boolean) => {
 try {

    if (esNuevo) {
      await insertarProducto(producto);
      setToast({
        type: 'success',
        message: 'Producto creado correctamente',
      });
      console.log('🆕 Producto creado');
    } else {
      await actualizarProducto(producto);
      setToast({
        type: 'success',
        message: 'Producto editado correctamente',
      });
      console.log('✏️ Producto editado');
    }
    await cargarProductos(); // Refresca la lista
  } catch (error) {
    console.error('❌ Error al guardar producto:', error);
    alert('Hubo un error al guardar el producto.');
  }
  };

  // maneja la eliminación del producto, muestra un alert de confirmación

  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);

const manejarEliminar = (id: number) => {
  const producto = productos.find((p) => p.id === id);
  if (producto) {
    setProductoAEliminar(producto);
  }
};


  // renderiza cada producto en la lista, incluyendo acciones de swipe para editar y eliminar
  const renderProducto = ({ item }: { item: Producto }) => {
const renderRightActions = () => (
<View style={styles.swipeActionsContainer}>
  <TouchableOpacity
    style={[styles.swipeButton, styles.swipeButtonEdit]}
    onPress={() => abrirMenu(item)}
  >
    <MaterialCommunityIcons name="dots-horizontal" size={20} color="#fff" />
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.swipeButton, styles.swipeButtonDelete]}
    onPress={() => manejarEliminar(item.id!)}
  >
    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#fff" />
  </TouchableOpacity>
</View>
);



return (
  <View style={styles.productoWrapper}>

    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      
      <View style={styles.productoItemCompact}>

        <View style={styles.productoInfo}>
          <Text style={styles.productoNombreCompact}>{item.nombre}</Text>

<View style={styles.productoTagsCompact}>
  <View style={styles.tagCompact}>
    <Text style={styles.tagLabelCompact}>Venta</Text>
    <Text style={[styles.tagValueCompact, { color: '#10b981' }]}>
      ${item.precioVenta}
    </Text>
  </View>
  <View style={styles.tagCompact}>
    <Text style={styles.tagLabelCompact}>Costo</Text>
    <Text style={[styles.tagValueCompact, { color: '#ef4444' }]}>
      ${item.precioCosto}
    </Text>
  </View>
  <View style={styles.tagCompact}>
    <Text style={styles.tagLabelCompact}>Stock</Text>
    <Text style={[styles.tagValueCompact, { color: '#0ea5e9' }]}>
      {item.stock}
    </Text>
  </View>
</View>

        </View>
        
      </View>
      
    </Swipeable>
 
  </View>
);


  };


  // Vista principal de productos 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={[commonStyles.container, { opacity: 1 }]}>
<View style={styles.headerProductos}>
  <View>
<Text style={[styles.headerSectionLabel, { color: '#bfdbfe' }]}>
  Catálogo
</Text>
<Text style={[styles.headerTitleProductos, { color: '#ffffff' }]}>
  Mis productos
</Text>

  </View>

  <TouchableOpacity
    style={styles.addButtonPunch}
    onPress={() => {
      setProductoSeleccionado(null);
      setModalProductoVisible(true);
    }}
  >
    <MaterialCommunityIcons name="plus" size={18} color="#ffffff" />
    <Text style={styles.addButtonTextPunch}>Agregar</Text>
  </TouchableOpacity>
</View>

        {/* Lista de productos */}
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id?.toString() || ''}
          renderItem={renderProducto}
          ListEmptyComponent={
            <View style={commonStyles.emptyState}>
              <Text style={commonStyles.emptyStateText}>No hay productos</Text>
            </View>
          }
          ListHeaderComponent={<View style={{ height: 16 }} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />

        {/* MODALES */}
        {/* Modal para crear/editar producto (segun si se pasa productoEditado) */}
      <ModalProducto
        visible={modalProductoVisible}
        onClose={() => setModalProductoVisible(false)}
        onSubmit={manejarGuardarProducto}
        productoEditado={productoSeleccionado}
      />

        
      { /* Modal para ver variantes del producto */}
        {modalVariantesVisible && productoSeleccionado && (
        <ModalVariantes
            visible={modalVariantesVisible}
            onClose={() => setModalVariantesVisible(false)}
            producto={productoSeleccionado}
            onActualizar={cargarProductos}
        />
        )}


        {/** Modal para generar QR (si tiene variantes se mostrara menu para seleccionar variante*/}
        <ModalQR
          visible={modalQRVisible}
          onClose={() => setModalQRVisible(false)}
          qrData={qrData}
          producto={productoSeleccionado}
          variante={varianteSeleccionada}
          
        />

{ /* Modal para manejar componentes del producto  (componen precio total)*/}
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

{ /* Menu de opciones del producto seleccionado desliza a la derecha opciones se abre el menu (apertura de modales) */}
        <MenuOpciones
          visible={menuVisible}
          producto={productoSeleccionado}
          onClose={() => setMenuVisible(false)}
          onGenerarQR={generarQR}
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
      </Animated.View>
{toast && !modalProductoVisible && !modalVariantesVisible && !modalQRVisible && !modalComponentesVisible && !menuVisible && (
  <CustomToast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast(null)}
  />
)}
<ModalConfirmacion
  visible={!!productoAEliminar}
  mensaje={`¿Deseas eliminar el producto "${productoAEliminar?.nombre}"?`}
  onCancelar={() => setProductoAEliminar(null)}
  onConfirmar={async () => {
    if (productoAEliminar?.id) {
      await eliminarProducto(productoAEliminar.id);
      await cargarProductos();
      setToast({ type: 'success', message: 'Producto eliminado' });
    }
    setProductoAEliminar(null);
  }}
/>

    </GestureHandlerRootView>
  );
}
