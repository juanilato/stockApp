// productos/views/ProductosView.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated, FlatList,
  Text, TouchableOpacity, View
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

import { actualizarProducto, eliminarProducto, insertarProducto, Material, obtenerMateriales, obtenerProductos, Producto, setupProductosDB, VarianteProducto } from '../../../services/db';
import { commonStyles } from '../../styles/theme';
import { styles } from '../styles/styles';

import ModalConfirmacion from '@/components/ModalConfirmacion';
import CustomToast from '../../../components/CustomToast';
import MenuOpciones from '../components/MenuOpciones';
import ModalBarCode from '../components/ModalBarCode';
import ModalComponentes from '../components/ModalComponentes';
import ModalProducto from '../components/ModalProducto';
import ModalScanner from '../components/ModalScanner';
import ModalVariantes from '../components/ModalVariantes';


export default function ProductosView() {
  const [productos, setProductos] = useState<Producto[]>([]); // productos de la db
  const [materiales, setMateriales] = useState<Material[]>([]); // materiales de la db
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null); // producto seleccionado para editar o ver detalles
  const [modalProductoVisible, setModalProductoVisible] = useState(false); // modal para crear/editar producto
  const [modalVariantesVisible, setModalVariantesVisible] = useState(false); // modal para ver variantes del producto
  const [modalBarcodeVisible, setModalBarcodeVisible] = useState(false);
  const [barcodeData, setBarcodeData] = useState(''); // Modal para generar código de barras
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
const generarCodigoBarras = (producto: Producto, variante?: VarianteProducto) => {
  const payload = variante
    ? {
        nombre: producto.nombre,
        precioVenta: producto.precioVenta,
        varianteNombre: variante.nombre,
        codigoBarras: variante.codigoBarras,
      }
    : {
        nombre: producto.nombre,
        precioVenta: producto.precioVenta,
        codigoBarras: producto.codigoBarras,
      };

  setProductoSeleccionado(producto);
  setVarianteSeleccionada(variante || null);
  setBarcodeData(JSON.stringify(payload));
  setModalBarcodeVisible(true);
};

  // genera un código EAN13 válido
  const generarEAN13 = (): string => {
    // Prefijo para Argentina (779)
    const prefijo = '779';
    // Generar 9 dígitos aleatorios
    const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const base = prefijo + random;
    const checkDigit = calcularDigitoControlEAN13(base);
    return base + checkDigit;
  };

  const calcularDigitoControlEAN13 = (codigo: string): string => {
    const nums = codigo.split('').map(n => parseInt(n));
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
      // En EAN13, las posiciones pares (0-based) se multiplican por 3
      sum += i % 2 === 1 ? nums[i] * 3 : nums[i];
    }
    const check = (10 - (sum % 10)) % 10;
    return check.toString();
  };

  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'warning' } | null>(null);
const manejarGuardarProducto = async (producto: Producto, esNuevo: boolean) => {
  try {
    // Si es nuevo y no trae código, lo generamos
    if (esNuevo && !producto.codigoBarras) {
      producto.codigoBarras = generarEAN13();
    }

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
const [scannerVisible, setScannerVisible] = useState(false);


 // controla la visibilidad del escáner de código de barras
const handleBarcodeScanned = (codigo: string) => {
  const productoEncontrado = productos.find(p =>
    p.codigoBarras === codigo ||
    p.variantes?.some(v => v.codigoBarras === codigo)
  );

  if (productoEncontrado) {
    setProductoSeleccionado(productoEncontrado);
    setModalProductoVisible(true);
  } else {
    Alert.alert("Producto no encontrado", "Este código no está registrado.");
  }

  setScannerVisible(false);
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

<View style={{ flexDirection: 'row', gap: 12 }}>
  <TouchableOpacity
    style={styles.addButtonPunch}
    onPress={() => {
      setProductoSeleccionado(null);
      setModalProductoVisible(true);
    }}
  >
    <MaterialCommunityIcons name="plus" size={22} color="#ffffff" />
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.addButtonPunch}
    onPress={() => {
      setScannerVisible(true);
    }}
  >
    <MaterialCommunityIcons name="barcode-scan" size={22} color="#ffffff" />
  </TouchableOpacity>
</View>


  
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


<ModalScanner
  visible={scannerVisible}
  productos={productos}
  onClose={() => setScannerVisible(false)}
  onSubmit={manejarGuardarProducto}
/>



        {/** Modal para generar QR (si tiene variantes se mostrara menu para seleccionar variante*/}
      <ModalBarCode
        visible={modalBarcodeVisible}
        onClose={() => setModalBarcodeVisible(false)}
        barcodeData={barcodeData}
        producto={productoSeleccionado!}
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
      </Animated.View>
{toast && !modalProductoVisible && !modalVariantesVisible && !modalBarcodeVisible && !modalComponentesVisible && !menuVisible && (
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
