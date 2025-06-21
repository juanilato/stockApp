import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Producto, registrarVenta, Venta } from '../../services/db';
import { generatePaymentQR, PaymentData } from '../../services/mercadopago';
import { colors, spacing } from '../../styles/theme';
import ModalCantidad from './components/modalCantidad';
import ModalQRPago from './components/modalQRPago';
import ModalTransferencia from './components/modalTransferencia';
import ModalVariante from './components/modalVariante';
import ProductosDisponibles from './components/productosDisponibles';
import ProductosSeleccionados from './components/productosSeleccionados';
import ScannerModal from './components/scannerModal';
import { useMensajeFlotante } from './hooks/useMensajeFlotante';
import { useProductos } from './hooks/useProductos';
import { useSeleccionados } from './hooks/useSeleccionados';

export default function NuevaVentaView() {
  const { productos, isLoading } = useProductos();

  const guardarVenta = async () => {
    if (productosSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un producto');
      return;
    }

    const venta: Venta = {
      fecha: new Date().toISOString(),
      totalProductos: productosSeleccionados.reduce((total, p) => total + p.cantidad, 0),
      precioTotal: calcularTotal(),
      ganancia: calcularGanancia(),
      productos: productosSeleccionados.map(p => ({
        productoId: p.id!,
        cantidad: p.cantidad,
        precioUnitario: p.precioVenta,
        ganancia: (p.precioVenta - p.precioCosto) * p.cantidad,
        varianteId: p.varianteSeleccionada?.id
      }))
    };

    try {
      await registrarVenta(venta);
      resetSeleccionados();
      mostrarMensajeFlotante('✅ Venta guardada');
    } catch (error) {
      console.error('Error al guardar la venta:', error);
      alert('No se pudo guardar la venta');
    }
  };

  const generarQRPago = async () => {
    if (productosSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un producto');
      return;
    }

    try {
      const total = calcularTotal();
      const paymentData: PaymentData = {
        external_reference: `VENTA_${Date.now()}`,
        items: productosSeleccionados.map(p => ({
          id: p.id?.toString() || '',
          title: p.nombre,
          quantity: p.cantidad,
          unit_price: p.precioVenta,
          currency_id: 'ARS',
        })),
        total_amount: total,
      };

      const qrResponse = await generatePaymentQR(paymentData);
      if (qrResponse.qr_code) {
        setQrData(qrResponse.qr_code);
        setQrModalVisible(true);
      } else {
        throw new Error('No se pudo generar el código QR');
      }
    } catch (error) {
      console.error('Error al generar QR de pago:', error);
      alert('No se pudo generar el código QR de pago');
    }
  };

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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header moderno */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerSectionLabel}>Ventas</Text>
            <Text style={styles.headerTitle}>Nueva Venta</Text>
          </View>
          
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
            <MaterialCommunityIcons name="barcode-scan" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido principal */}
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
              onGuardar={guardarVenta}
              onQR={generarQRPago}
            />
          </View>
        </ScrollView>
      </View>

      {/* Modales */}
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

      {/* Scanner Modal */}
      <ScannerModal
        visible={scannerVisible}
        productos={productos}
        onClose={() => setScannerVisible(false)}
        onAgregarProducto={agregarProducto}
      />

      {/* Mensaje flotante */}
      {visibleMensajeFlotante && (
        <Animated.View style={[styles.mensajeFlotante, { transform: [{ translateY: mensajeAnim }] }]}>
          <Text style={styles.mensajeFlotanteText}>{mensaje}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerSectionLabel: {
    fontSize: 14,
    color: '#94a3b8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  scanButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    paddingBottom: 80,
  },
  productsList: {
    flex: 0.6,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  selectedProducts: {
    flex: 0.4,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  selectedHeader: {
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: spacing.md,
  },
  totalsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  totalLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: spacing.md,
  },
  lista: {
    flex: 1,
  },
  productoItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: spacing.xs,
    borderRadius: 16,
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productoInfo: {
    flex: 1,
  },
  productoNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: spacing.xs,
  },
  productoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productoPrecio: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '700',
  },
  mensajeFlotante: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  mensajeFlotanteText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 