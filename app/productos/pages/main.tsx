// productos/views/ProductosView.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Pressable,
  ScrollView,
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
import ProductoItem from '../components/ProductoItem';
import ProductosHeader from '../components/ProductosHeader';

// Importar funciones separadas
import ModalGestionProductos from '@/app/components/ModalGestionProductos';
import AIFloatingButton from '@/components/AIFloatingButton';
import {
  generarCodigoBarrasPayload,
  manejarEliminarProducto,
  manejarGuardarProducto,
  ToastType
} from '../functions';
import { interpretarArchivo } from '../../../config/backend';

// Generador EAN13 simple
function generarCodigoBarras() {
  const base = Math.floor(100000000000 + Math.random() * 899999999999).toString();
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(base[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return base + checkDigit;
}

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
  const [produdctoPriceVisible,setProductoPriceVisible] = useState(false);
  // Estados para los filtros
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [costoDesde, setCostoDesde] = useState('');
  const [costoHasta, setCostoHasta] = useState('');
  const [ventaDesde, setVentaDesde] = useState('');
  const [ventaHasta, setVentaHasta] = useState('');
  const [stockDesde, setStockDesde] = useState('');
  const [stockHasta, setStockHasta] = useState('');
  const [filtrosExpanded, setFiltrosExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalProductosVisible, setModalProductosVisible] = useState(false);
  const [productosPrecargados, setProductosPrecargados] = useState<any[]>([]);
  const [backendProductos, setBackendProductos] = useState<any[] | null>(null);
  console.log('Render principal', { productosPrecargados, modalProductosVisible });

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

const generarCodigoBarras = (
  producto?: Producto, 
  variante?: VarianteProducto
) => {
  const safeProducto: Producto = producto ?? {
    id: -1,
    nombre: 'Producto Desconocido',
    precioCosto: 0,
    precioVenta: 0,
    stock: 0,
    componentes: [],
    variantes: [],
  };

  const payload = generarCodigoBarrasPayload(safeProducto, variante);
  setProductoSeleccionado(safeProducto);
  setVarianteSeleccionada(variante || null);
  setBarcodeData(JSON.stringify(payload));
  setModalBarcodeVisible(true);
};
  const handleGuardarProducto = async (producto: Producto, esNuevo: boolean) => {
    await manejarGuardarProducto(producto, esNuevo, cargarProductos, setToast);
    setModalProductoVisible(false);
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

  const handleScan = () => {
    setScannerVisible(true);
    setFiltrosExpanded(false);
  };


  const handlePriceChange = () =>{
    setProductoPriceVisible(true);
  }
  const handleAgregarProducto = () => {
    setProductoSeleccionado(null);
    setModalProductoVisible(true);
    setFiltrosExpanded(false);
  };
  
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const nombreMatch = nombreFiltro === '' || p.nombre.toLowerCase().includes(nombreFiltro.toLowerCase());
      const costoDesdeMatch = costoDesde === '' || (p.precioCosto && p.precioCosto >= parseFloat(costoDesde));
      const costoHastaMatch = costoHasta === '' || (p.precioCosto && p.precioCosto <= parseFloat(costoHasta));
      const ventaDesdeMatch = ventaDesde === '' || (p.precioVenta && p.precioVenta >= parseFloat(ventaDesde));
      const ventaHastaMatch = ventaHasta === '' || (p.precioVenta && p.precioVenta <= parseFloat(ventaHasta));
      const stockDesdeMatch = stockDesde === '' || (p.stock && p.stock >= parseInt(stockDesde, 10));
      const stockHastaMatch = stockHasta === '' || (p.stock && p.stock <= parseInt(stockHasta, 10));
      
      return nombreMatch && costoDesdeMatch && costoHastaMatch && ventaDesdeMatch && ventaHastaMatch && stockDesdeMatch && stockHastaMatch;
    });
  }, [productos, nombreFiltro, costoDesde, costoHasta, ventaDesde, ventaHasta, stockDesde, stockHasta]);

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

  function AddListItem({ onPress, label }: { onPress: () => void; label: string }) {
    return (
      <TouchableOpacity style={styles.addListItem} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.addIconBox}>
          <MaterialCommunityIcons name="plus" size={22} color="#2563eb" />
        </View>
        <Text style={styles.addListItemText}>{label}</Text>
      </TouchableOpacity>
    );
  }

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'application/pdf', // .pdf
          'application/vnd.google-apps.document', // Google Docs
          'application/vnd.google-apps.spreadsheet', // Google Sheets
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        setUploadResult(null);
        uploadFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

    const uploadFile = async (file: DocumentPicker.DocumentPickerAsset) => {
    if (!file.uri) return;
    setUploading(true);
    setUploadResult(null);
    try {
      const data = await interpretarArchivo({
        uri: file.uri,
        name: file.name || 'document',
        type: file.mimeType || 'application/octet-stream',
      });
      
      console.log('Respuesta del backend:', data);
      if (Array.isArray(data)) {
        // Es una lista de productos
        setBackendProductos(data);
      } else if (data && data.tipo === 'factura') {
        setUploadResult('Factura interpretada. Pronto se abrirá el modal de venta.');
        Alert.alert('Factura detectada', 'Se detectó una factura. Pronto se abrirá el modal de precarga de venta editable.');
      } else {
        setUploadResult((data && data.error) ? `Error: ${data.error}` : 'No se pudo interpretar el archivo');
        console.error('Respuesta inesperada del backend:', data);
      }
    } catch (error) {
      setUploadResult('Error al interpretar el archivo');
      console.error('Error al interpretar archivo:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (backendProductos) {
const productosConBarra = backendProductos
  .filter(Boolean)
  .map((prod, idx) => ({
    ...prod,
    id: prod.id ?? `temp-${Date.now()}-${idx}`,
    codigoBarras: generarCodigoBarras(),
    stock: prod.stock == null ? 0 : prod.stock,
  }));
setProductosPrecargados(productosConBarra);
      setModalProductosVisible(true);
    }
  }, [backendProductos]);

  // Vista principal
  return (
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={commonStyles.container}>
         
            <ProductosHeader
              nombre={nombreFiltro}
              setNombre={setNombreFiltro}
              precioCostoDesde={costoDesde}
              setPrecioCostoDesde={setCostoDesde}
              precioCostoHasta={costoHasta}
              setPrecioCostoHasta={setCostoHasta}
              precioVentaDesde={ventaDesde}
              setPrecioVentaDesde={setVentaDesde}
              precioVentaHasta={ventaHasta}
              setPrecioVentaHasta={setVentaHasta}
              stockDesde={stockDesde}
              setStockDesde={setStockDesde}
              stockHasta={stockHasta}
              setStockHasta={setStockHasta}
              onAgregar={handleAgregarProducto}
              onScan={handleScan}
              onPrice={handlePriceChange}
              cantidad={productos.length}
              isExpanded={filtrosExpanded}
              setExpanded={setFiltrosExpanded}
            />
 <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
            <Pressable onPress={() => filtrosExpanded && setFiltrosExpanded(false)} style={{ flex: 1}}>
              <FlatList
                data={productosFiltrados}
                keyExtractor={(item) => item.id?.toString() || ''}
                renderItem={({ item }) => (
                  <ProductoItem
                    producto={item}
                    onEdit={(prod) => {
                      setProductoSeleccionado(prod);
                      setModalProductoVisible(true);
                    }}
                    onDelete={(prod) => handleEliminarProducto(prod.id!)}
                    onComponentes={(prod) => {
                      setProductoSeleccionado(prod);
                      setModalComponentesVisible(true);
                    }}
                    onVariantes={(prod) => {
                      setProductoSeleccionado(prod);
                      setModalVariantesVisible(true);
                    }}
                  />
                )}
                ListEmptyComponent={
                  <View style={commonStyles.emptyState}>
                    <MaterialCommunityIcons name="package-variant-closed" size={64} color="#94a3b8" />
                    <Text style={commonStyles.emptyStateText}>No se encontraron productos</Text>
                 
                  </View>
                }
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                showsVerticalScrollIndicator={false}
              />
            </Pressable>

            {/* MODALES */}
            <ModalProducto
              visible={modalProductoVisible}
              onClose={() => setModalProductoVisible(false)}
              onSubmit={handleGuardarProducto}
              productoEditado={productoSeleccionado}
            />
            <ModalGestionProductos
              visible={produdctoPriceVisible}
              onClose={() => setProductoPriceVisible(false)}
            />
            <ModalGestionProductos
              visible={modalProductosVisible}
              onClose={() => setModalProductosVisible(false)}
              productosPrecargados={productosPrecargados}
              onConfirmarPrecarga={async (productosEditados) => {
                console.log('Intentando guardar productos precargados:', productosEditados);
                try {
                  const productosSanitizados = productosEditados.map((producto) => {
                    if (typeof producto.id === 'string' && (producto.id as string).startsWith('temp-')) {
                      const { id, ...rest } = producto;
                      producto = { ...rest };
                    }
                    // Sanitizar campos
                    return {
                      nombre: String(producto.nombre ?? ''),
                      precioCosto: Number(producto.precioCosto ?? 0),
                      precioVenta: Number(producto.precioVenta ?? 0),
                      stock: Number(producto.stock ?? 0),
                      codigoBarras: producto.codigoBarras ? String(producto.codigoBarras) : undefined,
                    };
                  });
                  console.log('🚀 Productos sanitizados a guardar:', productosSanitizados);
                  if (productosSanitizados.length === 0) {
                    setToast({ message: 'No hay productos para importar', type: 'warning' });
                    return;
                  }
                  for (let producto of productosSanitizados) {
                    console.log('⏳ Guardando producto:', producto);
                    await manejarGuardarProducto(producto, true, cargarProductos, setToast);
                    console.log('✅ Producto guardado:', producto);
                  }
                  await cargarProductos();
                  setToast({ message: 'Productos importados correctamente', type: 'success' });
                  setModalProductosVisible(false);
                } catch (error) {
                  console.error('Error al importar productos:', error);
                  setToast({ message: 'Error al importar productos', type: 'error' });
                  // No cierres el modal si hay error
                }
              }}
              
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

            {/* Toast de resultado arriba */}
            {uploadResult && (
              <View style={{ position: 'absolute', top: 30, left: 20, right: 20, zIndex: 10, alignItems: 'center' }}>
                <Text style={{
                  backgroundColor: uploadResult.startsWith('Error') ? '#fee2e2' : uploadResult.includes('Factura') ? '#fef9c3' : '#d1fae5',
                  color: uploadResult.startsWith('Error') ? '#b91c1c' : uploadResult.includes('Factura') ? '#b45309' : '#065f46',
                  padding: 12,
                  borderRadius: 8,
                  fontWeight: '600',
                  fontSize: 16,
                  textAlign: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 4,
                }}>
                  {uploadResult}
                </Text>
              </View>
            )}

          </ScrollView>

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

          {/* Botón de IA */}
          <AIFloatingButton
            onPress={handlePickDocument}
            disabled={uploading}
            description="Subir documento para interpretar productos"
          />
        </View>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
