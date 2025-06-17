import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Producto } from '../../services/db';
import { borderRadius, colors, spacing, typography } from '../../styles/theme';
import ModalCantidad from './components/modalCantidad';
import ModalVariante from './components/modalVariante';
import ProductosDisponibles from './components/productosDisponibles';
import ProductosSeleccionados from './components/productosSeleccionados';
import { useMensajeFlotante } from './hooks/useMensajeFlotante';
import { useSeleccionados } from './hooks/useSeleccionados';

import { useCameraPermissions } from 'expo-camera';
import ModalQRPago from './components/modalQRPago';
import ModalTransferencia from './components/modalTransferencia';
import { useProductos } from './hooks/useProductos';


export default function NuevaVentaView() {
const { productos, isLoading } = useProductos();
  

const [scannerVisible, setScannerVisible] = useState(false);
const [modalCantidadVisible, setModalCantidadVisible] = useState(false);
const [modalVarianteVisible, setModalVarianteVisible] = useState(false);
const [productoParaVariante, setProductoParaVariante] = useState<Producto | null>(null);
const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
const [cantidad, setCantidad] = useState('1');
const [qrModalVisible, setQrModalVisible] = useState(false);
const [qrData, setQrData] = useState('');
const [transferModalVisible, setTransferModalVisible] = useState(false);
const [transferAmount, setTransferAmount] = useState('');
const [transferAlias, setTransferAlias] = useState('');
const [transferAccountId, setTransferAccountId] = useState('');
const [transferQRData, setTransferQRData] = useState('');
const [transferType, setTransferType] = useState<'alias' | 'account'>('alias');
const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(0)).current;
const [permission, requestPermission] = useCameraPermissions();
const closeModal = () => {
  setModalCantidadVisible(false);
  setCantidad('1');
  setProductoSeleccionado(null);
};

const handleConfirmarPago = () => {
  // Lógica para guardar venta y cerrar QR modal
};

const agregarProductoEscaneado = () => {
  // Lógica para agregar productoSeleccionado con cantidad
};

const generarQRTransferencia = () => {
  // Lógica de validación y generación de QR con alias o cuenta ID
};

useEffect(() => {
  Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }),
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }),
  ]).start();
}, []);

const {
  productosSeleccionados,
  agregarProducto,
  actualizarCantidad,
  quitarProducto,
  calcularTotal,
  calcularGanancia,
  resetSeleccionados,
} = useSeleccionados(productos);


const {
  mensaje,
  visible: visibleMensajeFlotante,
  anim: mensajeAnim,
  mostrarMensaje: mostrarMensajeFlotante
} = useMensajeFlotante();


  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nueva Venta</Text>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => {
            if (!permission?.granted) {
              requestPermission();
            } else {
              setScannerVisible(true);
            }
          }}
        >
          <MaterialCommunityIcons name="barcode-scan" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

    <View style={styles.content}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.productsGrid}>
          <ProductosDisponibles productos={productos} onAgregar={agregarProducto} />

          <ProductosSeleccionados
            productosSeleccionados={productosSeleccionados}
            actualizarCantidad={actualizarCantidad}
            quitarProducto={quitarProducto}
            calcularTotal={calcularTotal}
            calcularGanancia={calcularGanancia}
          />
        </View>
      </ScrollView>
    </View>



<ModalCantidad
  visible={modalCantidadVisible}
  cantidad={cantidad}
  setCantidad={setCantidad}
  onAgregar={agregarProductoEscaneado}
  onClose={closeModal}
  slideAnim={slideAnim}
/>
<ModalVariante
  visible={modalVarianteVisible}
  producto={productoParaVariante}
  onClose={() => setModalVarianteVisible(false)}
  onSelectVariante={(producto, variante) => agregarProducto(producto, 1, variante)}
/>

<ModalQRPago
  visible={qrModalVisible}
  qrData={qrData}
  total={calcularTotal()}
  onClose={() => setQrModalVisible(false)}
  onConfirmarPago={handleConfirmarPago}
/>
<ModalTransferencia
  visible={transferModalVisible}
  transferQRData={transferQRData}
  transferAmount={transferAmount}
  transferAlias={transferAlias}
  transferAccountId={transferAccountId}
  transferType={transferType}
  onChangeAmount={setTransferAmount}
  onChangeAlias={setTransferAlias}
  onChangeAccountId={setTransferAccountId}
  onChangeType={setTransferType}
  onClose={() => setTransferModalVisible(false)}
  onGenerarQR={generarQRTransferencia}
  onReset={() => {
    setTransferQRData('');
    setTransferAmount('');
    setTransferAlias('');
    setTransferAccountId('');
    setTransferModalVisible(false);
  }}
/>

    </Animated.View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.gray[800],
  },
  scanButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  productsGrid: {
    flex: 1,
    flexDirection: 'column',
    gap: spacing.md,
    paddingBottom: 80, // Espacio para los botones fijos
  },
  productsList: {
    flex: 0.6,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedProducts: {
    flex: 0.4,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedHeader: {
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingBottom: spacing.md,
  },
  totalsContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  totalLabel: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
    fontWeight: '500',
  },
  totalValue: {
    fontSize: typography.sizes.base,
    fontWeight: '700',
    color: colors.gray[800],
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  lista: {
    flex: 1,
  },
  productoItem: {
    flex: 1,
    backgroundColor: colors.gray[50],
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  productoInfo: {
    flex: 1,
  },
  productoNombre: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  productoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productoPrecio: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: '700',
  },
  productoStock: {
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
  },
  productoSeleccionado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productoSeleccionadoInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  productoSeleccionadoNombre: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  productoSeleccionadoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productoSeleccionadoPrecio: {
    fontSize: typography.sizes.base,
    color: colors.primary,
    fontWeight: '700',
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.full,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  cantidadButton: {
    padding: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cantidadText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[800],
    marginHorizontal: spacing.sm,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: spacing.sm,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.full,
    marginLeft: spacing.xs,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
scannerHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingTop: 40,
},

modoRapidoButton: {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: 20,
  padding: 8,
},

modoRapidoButtonActive: {
  backgroundColor: '#10b981',
},

  scannerCloseButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  scannerFrame: {
    flex: 1,
    margin: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: 'white',
    position: 'relative',
  },
  scannerCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    top: -2,
    left: -2,
  },
  scannerCornerTopRight: {
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderLeftWidth: 0,
    right: -2,
    left: undefined,
  },
  scannerCornerBottomLeft: {
    borderBottomWidth: 4,
    borderTopWidth: 0,
    bottom: -2,
    top: undefined,
  },
  scannerCornerBottomRight: {
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    bottom: -2,
    right: -2,
    top: undefined,
    left: undefined,
  },
  scannerText: {
    color: 'white',
    fontSize: typography.sizes.lg,
    textAlign: 'center',
    marginTop: spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  qrContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  qrWrapper: {
    backgroundColor: 'white',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  qrOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  qrCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    top: -2,
    left: -2,
  },
  qrInfo: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  qrTotal: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  qrInstructions: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    width: '90%',
    maxWidth: 400,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    maxHeight: '80%',
  },
  modalContentTop: {
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalBody: {
    padding: spacing.lg,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.gray[800],
  },
  closeButton: {
    padding: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.sizes.lg,
    backgroundColor: colors.white,
    color: colors.gray[800],
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: colors.gray[100],
  },
  modalButtonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: colors.gray[700],
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  transferButton: {
    backgroundColor: '#7c3aed',
  },
  transferTypeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  transferTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
  },
  transferTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  transferTypeText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[700],
  },
  transferTypeTextActive: {
    color: colors.white,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[500],
    marginTop: spacing.xl,
    fontSize: typography.sizes.base,
    fontStyle: 'italic',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonDisabled: {
    backgroundColor: colors.gray[200],
    shadowOpacity: 0,
    elevation: 0,
  },
  qrButton: {
    backgroundColor: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.success,
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  saveAnimationContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 1000,
  },
  saveAnimation: {
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveAnimationText: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.gray[800],
    letterSpacing: 0.5,
  },
  varianteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  varianteInfo: {
    flex: 1,
  },
  varianteNombre: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  varianteStock: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
mensajeFlotante: {
  position: 'absolute',
  top: 80,
  left: 20,
  right: 20,
  padding: 12,
  backgroundColor: '#0f172a',
  borderRadius: 10,
  alignItems: 'center',
  zIndex: 1000,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 4,
},
mensajeTexto: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},


}); 