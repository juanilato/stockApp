import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { obtenerProductos, Producto, registrarVenta, setupProductosDB, VarianteProducto, Venta } from '../../services/db';
import { generatePaymentQR, generateTransferQR, PaymentData, TransferData } from '../../services/mercadopago';
import { borderRadius, colors, spacing, typography } from '../../styles/theme';
interface ProductoSeleccionado extends Producto {
  cantidad: number;
  varianteSeleccionada?: VarianteProducto;
}

export default function NuevaVentaView() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [modalCantidadVisible, setModalCantidadVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState('1');
  const [permission, requestPermission] = useCameraPermissions();
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrData, setQrData] = useState('');
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferQRData, setTransferQRData] = useState('');
  const [transferAlias, setTransferAlias] = useState('');
  const [transferAccountId, setTransferAccountId] = useState('');
  const [transferType, setTransferType] = useState<'alias' | 'account'>('alias');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;


  const [showSaveAnimation, setShowSaveAnimation] = useState(false);

  const cartScale = React.useRef(new Animated.Value(0)).current;
  const cartOpacity = React.useRef(new Animated.Value(0)).current;
  const [modalVarianteVisible, setModalVarianteVisible] = useState(false);
  const [productoParaVariante, setProductoParaVariante] = useState<Producto | null>(null);

  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [lastScanTime, setLastScanTime] = useState<number>(0);
  const SCAN_DELAY = 3000; // 2 segundos de delay entre escaneos
  const isScanningRef = useRef(false);
  const [modoRapido, setModoRapido] = useState(false);
const [mensajeFlotante, setMensajeFlotante] = useState('');
const [visibleMensajeFlotante, setVisibleMensajeFlotante] = useState(false);
const mensajeAnim = useRef(new Animated.Value(0)).current;
const sonidoCheck = useRef<Audio.Sound | null>(null);
const sonidoError = useRef<Audio.Sound | null>(null);
const sonidoCompra = useRef<Audio.Sound | null>(null);
useEffect(() => {
  const cargarSonidos = async () => {
    const [check, error, purchase] = await Promise.all([
      Audio.Sound.createAsync(require('../../assets/sounds/succcess.mp3')),
      Audio.Sound.createAsync(require('../../assets/sounds/error.mp3')),
      Audio.Sound.createAsync(require('../../assets/sounds/purchase.mp3'))
    ]);

    sonidoCheck.current = check.sound;
    sonidoError.current = error.sound;
    sonidoCompra.current = purchase.sound;
  };

  cargarSonidos();

  return () => {
    sonidoCheck.current?.unloadAsync();
    sonidoError.current?.unloadAsync();
    sonidoCompra.current?.unloadAsync();
  };
}, []);
const mostrarMensajeFlotante = async (texto: string) => {
  setMensajeFlotante(texto);
  setVisibleMensajeFlotante(true);
  mensajeAnim.setValue(0);

  // ▶️ Sonido según contenido del texto
  const lower = texto.toLowerCase();
  if (lower.includes('agregado')) {
    await sonidoCheck.current?.replayAsync();
  } else if (lower.includes('ya escaneado')) {
    await sonidoError.current?.replayAsync();
  }

  Animated.timing(mensajeAnim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start(() => {
    setTimeout(() => {
      Animated.timing(mensajeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisibleMensajeFlotante(false);
        setMensajeFlotante('');
      });
    }, 1200);
  });
};


  useEffect(() => {
    inicializarDB();
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

  const inicializarDB = async () => {
    try {
      await setupProductosDB();
      await cargarProductos();
 
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
      Alert.alert('Error', 'No se pudo inicializar la base de datos');
    } finally {
      setIsLoading(false);
    }
  };

  const cargarProductos = async () => {
    obtenerProductos((productos) => {
      setProductos(productos);
       
    });
  };

  const agregarProducto = (producto: Producto) => {
    if (producto.variantes && producto.variantes.length > 0) {
      setProductoParaVariante(producto);
      setModalVarianteVisible(true);
      return;
    }

    agregarProductoConCantidad(producto, 1);
  };

  const agregarProductoConCantidad = (producto: Producto, cantidad: number, variante?: VarianteProducto) => {
    if (producto.variantes && producto.variantes.length > 0 && !variante) {
      Alert.alert('Error', 'Este producto solo se puede vender por variante');
      return;
    }

    const existente = productosSeleccionados.find(p => 
      p.id === producto.id && 
      ((!p.varianteSeleccionada && !variante) || 
       (p.varianteSeleccionada?.id === variante?.id))
    );
    
    if (existente) {
      const stockDisponible = variante ? variante.stock : producto.stock;
      if (existente.cantidad + cantidad > stockDisponible) {
        Alert.alert('Error', 'No hay suficiente stock disponible');
        return;
      }
      setProductosSeleccionados(prev => 
        prev.map(p => 
          (p.id === producto.id && 
           ((!p.varianteSeleccionada && !variante) || 
            (p.varianteSeleccionada?.id === variante?.id)))
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        )
      );
    } else {
      const stockDisponible = variante ? variante.stock : producto.stock;
      if (stockDisponible <= 0) {
        Alert.alert('Error', 'No hay stock disponible');
        return;
      }
      setProductosSeleccionados(prev => [...prev, { 
        ...producto, 
        cantidad,
        varianteSeleccionada: variante
      }]);
    }
  };

  const actualizarCantidad = (productoId: number, nuevaCantidad: number, varianteId?: number) => {
    const producto = productosSeleccionados.find(p => 
      p.id === productoId && 
      ((!p.varianteSeleccionada && !varianteId) || 
       (p.varianteSeleccionada?.id === varianteId))
    );
    if (!producto) return;

    const productoOriginal = productos.find(p => p.id === productoId);
    if (!productoOriginal) return;

    const stockDisponible = producto.varianteSeleccionada 
      ? producto.varianteSeleccionada.stock 
      : productoOriginal.stock;

    if (nuevaCantidad > stockDisponible) {
      Alert.alert('Error', 'No hay suficiente stock disponible');
      return;
    }

    if (nuevaCantidad < 1) {
      quitarProducto(productoId, varianteId);
      return;
    }

    setProductosSeleccionados(prev =>
      prev.map(p => 
        (p.id === productoId && 
         ((!p.varianteSeleccionada && !varianteId) || 
          (p.varianteSeleccionada?.id === varianteId)))
          ? { ...p, cantidad: nuevaCantidad }
          : p
      )
    );
  };

  const quitarProducto = (productoId: number, varianteId?: number) => {
    setProductosSeleccionados(prev => 
      prev.filter(p => 
        !(p.id === productoId && 
          ((!p.varianteSeleccionada && !varianteId) || 
           (p.varianteSeleccionada?.id === varianteId)))
      )
    );
  };

  const calcularTotal = () => {
    return productosSeleccionados.reduce((total, producto) => 
      total + (producto.precioVenta * producto.cantidad), 0
    );
  };

  const calcularGanancia = () => {
    return productosSeleccionados.reduce((total, producto) => 
      total + ((producto.precioVenta - producto.precioCosto) * producto.cantidad), 0
    );
  };

  const animateSave = () => {
    setShowSaveAnimation(true);
    Animated.sequence([
      // Fade in
      Animated.timing(cartOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      // Scale up with bounce
      Animated.spring(cartScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      // Hold for a moment
      Animated.delay(800),
      // Fade out
      Animated.timing(cartOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSaveAnimation(false);
      cartScale.setValue(0);
    });
  };

  const guardarVenta = async () => {
    if (productosSeleccionados.length === 0) {
      Alert.alert('Error', 'Debe seleccionar al menos un producto');
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
      animateSave();
      await sonidoCompra.current?.replayAsync();
      setProductosSeleccionados([]);
      await cargarProductos();

    } catch (error) {
      console.error('Error al guardar la venta:', error);
      Alert.alert('Error', 'No se pudo registrar la venta');
    }
  };

const handleBarCodeScanned = async ({ data }: { data: string }) => {
  const currentTime = Date.now();

  // ✅ Bloqueo inmediato sin esperar re-render
  if (isScanningRef.current || (lastScannedCode === data && currentTime - lastScanTime < SCAN_DELAY)) {
    return;
  }

  isScanningRef.current = true; // 🔒 Bloqueo inmediato
  setLastScannedCode(data);
  setLastScanTime(currentTime);
  
if (!modoRapido) {
  setScannerVisible(false);
}


  try {
    const productoData = JSON.parse(data);
    const productoId = Number(productoData.productoId ?? productoData.id);
    const producto = productos.find(p => p.id === productoId);

    if (!producto) {
      mostrarMensajeFlotante('❌ Producto no encontrado');
      return;
    }

    const yaAgregado = productosSeleccionados.some(p =>
      p.id === producto.id &&
      (!productoData.varianteId || p.varianteSeleccionada?.id === productoData.varianteId)
    );

    if (yaAgregado) {
        mostrarMensajeFlotante(`⚠️ Ya escaneado: ${producto.nombre}`);
      return;
    }

    if (productoData.varianteId) {
      const variante = producto.variantes?.find(v => v.id === productoData.varianteId);
      if (!variante) {
        Alert.alert('Error', 'Variante no encontrada');
        return;
      }
      if (variante.stock <= 0) {
        Alert.alert('Sin stock', 'No hay stock disponible de esta variante');
        return;
      }

      agregarProductoConCantidad(producto, 1, variante);
mostrarMensajeFlotante(`✅ Agregado: ${producto.nombre} - ${variante.nombre}`);
    } else {
      if (producto.stock <= 0) {
        Alert.alert('Sin stock', 'No hay stock disponible');
        return;
      }

      agregarProductoConCantidad(producto, 1);
mostrarMensajeFlotante(`✅ Agregado: ${producto.nombre}`);
    }

  } catch (error) {
    console.error('❌ QR inválido:', error);
    Alert.alert('Error', 'Código QR inválido');
  } finally {


    setTimeout(() => {
      isScanningRef.current = false;
    }, SCAN_DELAY);
  }
};


  const agregarProductoEscaneado = () => {
    if (productoSeleccionado && cantidad) {
      const cantidadNum = parseInt(cantidad);
      if (cantidadNum > 0) {
        if (cantidadNum > productoSeleccionado.stock) {
          Alert.alert('Error', 'No hay suficiente stock disponible');
          return;
        }
        
        const existente = productosSeleccionados.find(p => p.id === productoSeleccionado.id);
        
        if (existente) {
          const nuevaCantidad = existente.cantidad + cantidadNum;
          if (nuevaCantidad > productoSeleccionado.stock) {
            Alert.alert('Error', 'No hay suficiente stock disponible');
            return;
          }
          setProductosSeleccionados(prev => 
            prev.map(p => p.id === productoSeleccionado.id 
              ? { ...p, cantidad: nuevaCantidad }
              : p
            )
          );
        } else {
          setProductosSeleccionados(prev => [...prev, { ...productoSeleccionado, cantidad: cantidadNum }]);
        }
        
        setModalCantidadVisible(false);
        setCantidad('1');
        setProductoSeleccionado(null);
      }
    }
  };

  const generarQRPago = async () => {
    if (productosSeleccionados.length === 0) {
      Alert.alert('Error', 'Debe seleccionar al menos un producto');
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
          currency_id: "ARS"
        })),
        total_amount: total
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
      Alert.alert('Error', 'No se pudo generar el código QR de pago');
    }
  };

  const handleConfirmarPago = async () => {
    try {
      await guardarVenta();
      setQrModalVisible(false);
    } catch (error) {
      console.error('Error al confirmar el pago:', error);
      Alert.alert('Error', 'No se pudo confirmar el pago');
    }
  };

  const generarQRTransferencia = async () => {
    if (!transferAmount || isNaN(Number(transferAmount))) {
      Alert.alert('Error', 'Por favor ingrese un monto válido');
      return;
    }

    if (transferType === 'alias' && !transferAlias) {
      Alert.alert('Error', 'Por favor ingrese un alias');
      return;
    }

    if (transferType === 'account' && !transferAccountId) {
      Alert.alert('Error', 'Por favor ingrese un ID de cuenta');
      return;
    }

    try {
      const transferData: TransferData = {
        amount: Number(transferAmount),
        description: `Transferencia ${new Date().toLocaleDateString()}`,
        ...(transferType === 'alias' ? { alias: transferAlias } : { recipient_id: transferAccountId })
      };

      const qrResponse = generateTransferQR(transferData);
      if (qrResponse.qr_code) {
        setTransferQRData(qrResponse.qr_code);
        setTransferModalVisible(true);
      } else {
        throw new Error('No se pudo generar el código QR');
      }
    } catch (error) {
      console.error('Error al generar QR de transferencia:', error);
      Alert.alert('Error', 'No se pudo generar el código QR de transferencia. Por favor, asegúrese de que el alias sea válido.');
    }
  };

  const renderProducto = ({ item }: { item: Producto }) => (
    <TouchableOpacity
      style={styles.productoItem}
      onPress={() => agregarProducto(item)}
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

  const renderProductoSeleccionado = ({ item }: { item: ProductoSeleccionado }) => (
    <View style={styles.productoSeleccionado}>
      <View style={styles.productoSeleccionadoInfo}>
        <Text style={styles.productoSeleccionadoNombre} numberOfLines={1}>
          {item.nombre}
          {item.varianteSeleccionada && ` - ${item.varianteSeleccionada.nombre}`}
        </Text>
        <View style={styles.productoSeleccionadoDetails}>
          <Text style={styles.productoSeleccionadoPrecio}>${item.precioVenta}</Text>
          <View style={styles.cantidadContainer}>
            <TouchableOpacity
              onPress={() => actualizarCantidad(item.id!, item.cantidad - 1, item.varianteSeleccionada?.id)}
              style={styles.cantidadButton}
            >
              <MaterialCommunityIcons name="minus" size={20} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.cantidadText}>{item.cantidad}</Text>
            <TouchableOpacity
              onPress={() => actualizarCantidad(item.id!, item.cantidad + 1, item.varianteSeleccionada?.id)}
              style={styles.cantidadButton}
            >
              <MaterialCommunityIcons name="plus" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => quitarProducto(item.id!, item.varianteSeleccionada?.id)}
      >
        <MaterialCommunityIcons name="close" size={20} color={colors.gray[500]} />
      </TouchableOpacity>
    </View>
  );



  const closeModal = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start(() => {
      setModalCantidadVisible(false);
      setCantidad('1');
      setProductoSeleccionado(null);
    });
  };

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
          <MaterialCommunityIcons name="qrcode-scan" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.productsGrid}>
            <View style={styles.productsList}>
              <Text style={styles.sectionTitle}>Productos Disponibles</Text>
              <FlatList
                data={productos}
                renderItem={renderProducto}
                keyExtractor={item => item.id?.toString() || ''}
                style={styles.lista}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                columnWrapperStyle={styles.productRow}
                scrollEnabled={false}
              />
            </View>

            <View style={styles.selectedProducts}>
              <View style={styles.selectedHeader}>
                <Text style={styles.sectionTitle}>Total</Text>
                
              <FlatList
                data={productosSeleccionados}
                renderItem={renderProductoSeleccionado}
                keyExtractor={item => item.id?.toString() || ''}
                style={styles.lista}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No hay productos seleccionados</Text>
                }
              />
                <View style={styles.totalsContainer}>
                  <View style={styles.totalItem}>
                    <Text style={styles.totalLabel}>Productos</Text>
                    <Text style={styles.totalValue}>
                      {productosSeleccionados.reduce((total, p) => total + p.cantidad, 0)}
                    </Text>
                  </View>
                  <View style={styles.totalItem}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>${calcularTotal()}</Text>
                  </View>
                  <View style={styles.totalItem}>
                    <Text style={styles.totalLabel}>Ganancia</Text>
                    <Text style={styles.totalValue}>${calcularGanancia()}</Text>
                  </View>
                </View>
              </View>

            </View>
          </View>
        </ScrollView>

        <View style={styles.fixedBottom}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.qrButton,
                productosSeleccionados.length === 0 && styles.actionButtonDisabled
              ]}
              onPress={generarQRPago}
              disabled={productosSeleccionados.length === 0}
            >
              <MaterialCommunityIcons 
                name="qrcode" 
                size={24} 
                color={productosSeleccionados.length === 0 ? colors.gray[400] : colors.white} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.saveButton,
                productosSeleccionados.length === 0 && styles.actionButtonDisabled
              ]}
              onPress={guardarVenta}
              disabled={productosSeleccionados.length === 0}
            >
              <MaterialCommunityIcons 
                name="content-save" 
                size={24} 
                color={productosSeleccionados.length === 0 ? colors.gray[400] : colors.white} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showSaveAnimation && (
        <View style={styles.saveAnimationContainer}>
          <Animated.View
            style={[
              styles.saveAnimation,
              {
                transform: [{ scale: cartScale }],
                opacity: cartOpacity,
              },
            ]}
          >
            <View style={styles.checkmarkCircle}>
              <MaterialCommunityIcons 
                name="check" 
                size={40} 
                color={colors.white} 
              />
            </View>
            <Text style={styles.saveAnimationText}>Venta Guardada</Text>

        
          </Animated.View>
        </View>
      )}


      <Modal
        visible={scannerVisible}
        animationType="slide"
        onRequestClose={() => setScannerVisible(false)}
      >
        <View style={styles.scannerContainer}>
          {permission?.granted && (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={scannerVisible ? handleBarCodeScanned : undefined}
            >
<View style={styles.scannerHeader}>
  <TouchableOpacity
    style={styles.scannerCloseButton}
    onPress={() => setScannerVisible(false)}
  >
    <MaterialCommunityIcons name="close" size={24} color="white" />
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.modoRapidoButton, modoRapido && styles.modoRapidoButtonActive]}
    onPress={() => setModoRapido(prev => !prev)}
  >
    <MaterialCommunityIcons
      name={modoRapido ? "flash" : "flash-off"}
      size={24}
      color="white"
    />
  </TouchableOpacity>
</View>

            </CameraView>
          )}
          {visibleMensajeFlotante && (
  <Animated.View
    style={[
      styles.mensajeFlotante,
      {
        opacity: mensajeAnim,
        transform: [
          {
            translateY: mensajeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
        ],
      },
    ]}
  >
    <Text style={styles.mensajeTexto}>{mensajeFlotante}</Text>
  </Animated.View>
)}
        </View>
      </Modal>

      <Modal
        visible={modalCantidadVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <Animated.View 
              style={[
                styles.modalContent,
                styles.modalContentTop,
                {
                  transform: [{
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-300, 0]
                    })
                  }]
                }
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Cantidad</Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <TextInput
                  style={styles.input}
                  value={cantidad}
                  onChangeText={setCantidad}
                  keyboardType="numeric"
                  placeholder="Cantidad"
                  autoFocus={true}
                  returnKeyType="done"
                  onSubmitEditing={agregarProductoEscaneado}
                />
              </View>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={closeModal}
                >
                  <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
                  <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={agregarProductoEscaneado}
                >
                  <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                  <Text style={styles.modalButtonText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={qrModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Pago con Mercado Pago</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setQrModalVisible(false)}
                >
                  <MaterialCommunityIcons name="close-circle" size={28} color={colors.gray[500]} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.qrContainer}>
                <View style={styles.qrWrapper}>
                  <QRCode
                    value={qrData}
                    size={250}
                    backgroundColor="white"
                    color="black"
                  />
                  <View style={styles.qrOverlay}>
                    <View style={styles.qrCorner} />
                    <View style={[styles.qrCorner ]} />
                    <View style={[styles.qrCorner ]} />
                    <View style={[styles.qrCorner ]} />
                  </View>
                </View>
                <View style={styles.qrInfo}>
                  <Text style={styles.qrTotal}>Total: ${calcularTotal()}</Text>
                  <Text style={styles.qrInstructions}>
                    Escanea este código con la app de Mercado Pago para pagar
                  </Text>
                </View>
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setQrModalVisible(false)}
                >
                  <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
                  <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleConfirmarPago}
                >
                  <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                  <Text style={styles.modalButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={transferModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTransferModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Transferencia</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setTransferModalVisible(false)}
                >
                  <MaterialCommunityIcons name="close-circle" size={28} color={colors.gray[500]} />
                </TouchableOpacity>
              </View>

              {!transferQRData ? (
                <>
                  <View style={styles.transferTypeContainer}>
                    <TouchableOpacity
                      style={[
                        styles.transferTypeButton,
                        transferType === 'alias' && styles.transferTypeButtonActive
                      ]}
                      onPress={() => setTransferType('alias')}
                    >
                      <MaterialCommunityIcons 
                        name="account" 
                        size={24} 
                        color={transferType === 'alias' ? colors.white : colors.gray[700]} 
                      />
                      <Text style={[
                        styles.transferTypeText,
                        transferType === 'alias' && styles.transferTypeTextActive
                      ]}>Alias</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.transferTypeButton,
                        transferType === 'account' && styles.transferTypeButtonActive
                      ]}
                      onPress={() => setTransferType('account')}
                    >
                      <MaterialCommunityIcons 
                        name="bank" 
                        size={24} 
                        color={transferType === 'account' ? colors.white : colors.gray[700]} 
                      />
                      <Text style={[
                        styles.transferTypeText,
                        transferType === 'account' && styles.transferTypeTextActive
                      ]}>ID Cuenta</Text>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.input}
                    value={transferAmount}
                    onChangeText={setTransferAmount}
                    keyboardType="numeric"
                    placeholder="Monto a transferir"
                    autoFocus={true}
                    returnKeyType="next"
                  />

                  {transferType === 'alias' ? (
                    <TextInput
                      style={styles.input}
                      value={transferAlias}
                      onChangeText={setTransferAlias}
                      placeholder="Alias de Mercado Pago"
                      returnKeyType="done"
                      onSubmitEditing={generarQRTransferencia}
                    />
                  ) : (
                    <TextInput
                      style={styles.input}
                      value={transferAccountId}
                      onChangeText={setTransferAccountId}
                      placeholder="ID de cuenta de Mercado Pago"
                      keyboardType="numeric"
                      returnKeyType="done"
                      onSubmitEditing={generarQRTransferencia}
                    />
                  )}

                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonSecondary]}
                      onPress={() => setTransferModalVisible(false)}
                    >
                      <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
                      <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonPrimary]}
                      onPress={generarQRTransferencia}
                    >
                      <MaterialCommunityIcons name="qrcode" size={20} color={colors.white} />
                      <Text style={styles.modalButtonText}>Generar QR</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.qrContainer}>
                    <QRCode
                      value={transferQRData}
                      size={250}
                      backgroundColor="white"
                      color="black"
                    />
                    <Text style={styles.qrTotal}>Total: ${transferAmount}</Text>
                    <Text style={styles.qrInstructions}>
                      Escanea este código con la app de Mercado Pago
                    </Text>
                    <Text style={[styles.qrInstructions, { marginTop: 8, fontSize: 14, color: colors.gray[500] }]}>
                      Asegúrate de tener la última versión de la app instalada
                    </Text>
                  </View>

                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonSecondary]}
                      onPress={() => {
                        setTransferQRData('');
                        setTransferAmount('');
                        setTransferAlias('');
                        setTransferAccountId('');
                        setTransferModalVisible(false);
                      }}
                    >
                      <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
                      <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cerrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonPrimary]}
                      onPress={() => {
                        setTransferQRData('');
                        setTransferAmount('');
                        setTransferAlias('');
                        setTransferAccountId('');
                        setTransferModalVisible(false);
                      }}
                    >
                      <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                      <Text style={styles.modalButtonText}>Listo</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={modalVarianteVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVarianteVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Seleccionar Variante - {productoParaVariante?.nombre}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVarianteVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {productoParaVariante?.variantes?.map(variante => (
                <TouchableOpacity
                  key={variante.id}
                  style={styles.varianteItem}
                  onPress={() => {
                    agregarProductoConCantidad(productoParaVariante, 1, variante);
                    setModalVarianteVisible(false);
                  }}
                >
                  <View style={styles.varianteInfo}>
                    <Text style={styles.varianteNombre}>{variante.nombre}</Text>
                    <Text style={styles.varianteStock}>Stock: {variante.stock}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color={colors.gray[400]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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