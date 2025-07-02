import { useUser } from '@clerk/clerk-expo';
import { useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
// @ts-ignore
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import AIFloatingButton from '../../components/AIFloatingButton';
import { obtenerProductoPorCodigo, registrarVenta, setupProductosDB, Venta } from '../../services/db';
import { colors, spacing } from '../../styles/theme';
import { useNavigation } from '../context/NavigationContext';
import ModalApiKeyMercadoPago from './components/ModalApiKeyMercadoPago';
import ModalCantidad from './components/modalCantidad';
import ModalInterpretacionVoz from './components/ModalInterpretacionVoz';
import ModalVariante from './components/modalVariante';
import ProductosDisponibles from './components/productosDisponibles';
import ProductosSeleccionados from './components/productosSeleccionados';
import ScannerModal from './components/scannerModal';
import VentasHeader from './components/VentasHeader';
import { useMensajeFlotante } from './hooks/useMensajeFlotante';
import { useProductos } from './hooks/useProductos';
import { useSeleccionados } from './hooks/useSeleccionados';
import { useSonidos } from './hooks/useSonidos';

// Coloca tu API Key de AssemblyAI aquí:
const ASSEMBLYAI_API_KEY = 'f25169eacdf54ff0955289f5dd43568f'; // <-- REEMPLAZA AQUÍ
import { interpretarVoz } from '../../config/backend';

export default function NuevaVentaView() {
  const { productos, isLoading: isLoadingProductos } = useProductos();
  const { user } = useUser();
  const { reproducirCompra } = useSonidos();
  const apikey = user?.unsafeMetadata?.mercadopago_apikey as string | undefined;

  const { shouldOpenScanner, setShouldOpenScanner } = useNavigation();

  const {
    productosSeleccionados,
    agregarProducto,
    eliminarProducto,
    actualizarCantidad,
    limpiarVenta,
    total,
    calcularGanancia,
  } = useSeleccionados(productos);

  const {
    mensaje,
    visible: visibleMensajeFlotante,
    anim: mensajeAnim,
    mostrarMensaje: mostrarMensajeFlotante,
  } = useMensajeFlotante();

  const [permission, requestPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
  const [varianteModalVisible, setVarianteModalVisible] = useState(false);
  const [productoConVariantes, setProductoConVariantes] = useState<any>(null);
  const [modalApiKeyVisible, setModalApiKeyVisible] = useState(false);
  const [modalInterpretacionVisible, setModalInterpretacionVisible] = useState(false);
  const [productosInterpretados, setProductosInterpretados] = useState<any[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Estados para el sistema de voz
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setupProductosDB();
  }, []);

  useEffect(() => {
    if (scannedData) {
      handleBarCodeScanned({ data: scannedData });
      setScannedData(null);
    }
  }, [scannedData]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScannerVisible(false);
    const producto = await obtenerProductoPorCodigo(data);

    if (producto) {
      if (producto.variantes && producto.variantes.length > 0) {
        setProductoConVariantes(producto);
        setVarianteModalVisible(true);
      } else {
        agregarProducto(producto, 1);
      }
    } else {
      Alert.alert('Producto no encontrado', 'El código de barras no corresponde a ningún producto.');
    }
  };

  const mostrarModalCantidad = (producto: any) => {
    setProductoSeleccionado(producto);
    setModalVisible(true);
  };

  const guardarVenta = async () => {
    if (productosSeleccionados.length === 0) return;

    const venta: Venta = {
      fecha: new Date().toISOString(),
      totalProductos: productosSeleccionados.reduce((sum, p) => sum + p.cantidad, 0),
      precioTotal: total,
      ganancia: calcularGanancia(),
      productos: productosSeleccionados.map((p) => ({
        productoId: p.id!,
        cantidad: p.cantidad,
        precioUnitario: p.precioVenta,
        ganancia: (p.precioVenta - p.precioCosto) * p.cantidad,
        varianteId: p.varianteSeleccionada?.id,
      })),
    };

    try {
      await registrarVenta(venta);
      mostrarMensajeFlotante('Venta guardada con éxito');
      reproducirCompra();
      limpiarVenta();
    } catch (error) {
      console.error('Error al guardar la venta:', error);
      Alert.alert('Error', 'No se pudo guardar la venta.');
    }
  };

  const handleGuardarApiKey = async (apikey: string) => {
    if (!user) return;
    try {
      await user.update({ unsafeMetadata: { ...user.unsafeMetadata, mercadopago_apikey: apikey } });
      await user.reload();
      setModalApiKeyVisible(false);
    } catch (e) {
      throw new Error('No se pudo guardar el Access Token. Intenta de nuevo.');
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (shouldOpenScanner) {
      if (permission?.granted) {
        setScannerVisible(true);
      } else {
        requestPermission();
      }
      setShouldOpenScanner(false);
    }
  }, [shouldOpenScanner, permission?.granted, requestPermission, setShouldOpenScanner]);

  const startRecording = async () => {
    try {
      console.log('[VOZ] Solicitando permisos e iniciando grabación...');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
      console.log('[VOZ] Grabando...');
    } catch (err) {
      setIsRecording(false);
      setRecording(null);
      setAudioUri(null);
      console.log('[VOZ][ERROR] No se pudo iniciar la grabación:', err);
    }
  };

  const stopRecording = async (): Promise<string | null> => {
    setIsRecording(false);
    if (!recording) return null;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioUri(uri);
    setRecording(null);
    console.log('[VOZ] Grabación detenida. Archivo guardado en:', uri);
    return uri;
  };

  const uploadAudioToAssemblyAI = async (uri: string, apiKey: string) => {
    console.log('[VOZ] Subiendo audio a AssemblyAI...');
    const response = await FileSystem.uploadAsync(
      'https://api.assemblyai.com/v2/upload',
      uri,
      {
        httpMethod: 'POST',
        headers: {
          authorization: apiKey,
        },
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      }
    );
    const data = JSON.parse(response.body);
    console.log('[VOZ] Audio subido. upload_url:', data.upload_url);
    return data.upload_url;
  };

  const requestTranscription = async (uploadUrl: string, apiKey: string) => {
    console.log('[VOZ] Solicitando transcripción a AssemblyAI...');
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ audio_url: uploadUrl, language_code: 'es' }),
    });
    const data = await response.json();
    console.log('[VOZ] Transcripción solicitada. transcript_id:', data.id);
    return data.id;
  };

  const pollTranscription = async (id: string, apiKey: string) => {
    let completed = false;
    let text = '';
    let intentos = 0;
    console.log('[VOZ] Esperando transcripción de AssemblyAI...');
    while (!completed) {
      await new Promise(res => setTimeout(res, 2000));
      intentos++;
      const response = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
        headers: { authorization: apiKey },
      });
      const data = await response.json();
      console.log(`[VOZ] Polling intento ${intentos}: status =`, data.status);
      if (data.status === 'completed') {
        completed = true;
        text = data.text;
        console.log('[VOZ] Transcripción completada:', text);
      } else if (data.status === 'error') {
        completed = true;
        console.log('[VOZ][ERROR] Error en transcripción:', data.error);
        throw new Error(data.error);
      }
    }
    return text;
  };

  const handleVoiceAssistant = async () => {
    if (!isRecording && !isProcessing) {
      // Iniciar grabación
      await startRecording();
    } else if (isRecording && !isProcessing) {
      // Detener grabación y procesar
      setIsProcessing(true); // Deshabilitar el botón inmediatamente
      const uri = await stopRecording();
      setIsTranscribing(true);
      try {
        if (!uri) {
          console.log('[VOZ][ERROR] No hay audioUri para subir a AssemblyAI');
          setIsProcessing(false);
          setIsTranscribing(false);
          return;
        }
        const uploadUrl = await uploadAudioToAssemblyAI(uri, ASSEMBLYAI_API_KEY);
        const transcriptId = await requestTranscription(uploadUrl, ASSEMBLYAI_API_KEY);
        const text = await pollTranscription(transcriptId, ASSEMBLYAI_API_KEY);
        setTranscript(text);
        // --- FLUJO DE INTERPRETACIÓN ---
        const nombresProductos = productos.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          precioVenta: p.precioVenta,
          precioCosto: p.precioCosto,
        }));
        const data = await interpretarVoz(text, nombresProductos);
        setProductosInterpretados(data.productos || []);
        setModalInterpretacionVisible(true);
        // --- FIN FLUJO DE INTERPRETACIÓN ---
      } catch (e) {
        console.log('[VOZ][ERROR] Error en el flujo de voz:', e);
      }
      setIsTranscribing(false);
      setAudioUri(null);
      setIsProcessing(false);
    }
  };

  const handleAgregarProductosInterpretados = (productos: any[]) => {
    productos.forEach(producto => {
      agregarProducto(producto, producto.cantidad);
    });
    setModalInterpretacionVisible(false);
    setProductosInterpretados([]);
    setTranscript('');
  };

  if (isLoadingProductos) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <VentasHeader
        onScan={() => {
          if (!permission?.granted) {
            requestPermission();
          } else {
            setScannerVisible(true);
          }
        }}
        onVerVentas={() => {}}
      />
      <View style={styles.content}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <ProductosDisponibles
            productos={productos}
            onAgregar={(producto) => agregarProducto(producto, 1)}
            onSeleccionarProducto={(producto) => {
              setProductoConVariantes(producto);
              setVarianteModalVisible(true);
            }}
          />
          <ProductosSeleccionados
            productosSeleccionados={productosSeleccionados}
            actualizarCantidad={actualizarCantidad}
            quitarProducto={eliminarProducto}
            calcularTotal={() => total}
            calcularGanancia={calcularGanancia}
            onGuardar={guardarVenta}
            onQR={() => {}}
          />
        </ScrollView>
      </View>
      <ModalCantidad
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        producto={productoSeleccionado}
        onUpdateCantidad={(p, c) => {
          if (p.id) {
            actualizarCantidad(p.id, c, p.varianteSeleccionada?.id);
          }
          setModalVisible(false);
        }}
        onDelete={(p) => {
          if (p.id) {
            eliminarProducto(p.id, p.varianteSeleccionada?.id);
          }
          setModalVisible(false);
        }}
      />
      <ModalVariante
        visible={varianteModalVisible}
        onClose={() => setVarianteModalVisible(false)}
        producto={productoConVariantes}
        onSelectVariante={(producto, variante) => {
          agregarProducto(producto, 1, variante);
          setVarianteModalVisible(false);
        }}
      />
      <ScannerModal
        visible={scannerVisible}
        productos={productos}
        onClose={() => setScannerVisible(false)}
        onBarCodeScanned={handleBarCodeScanned}
      />
      <ModalApiKeyMercadoPago
        visible={modalApiKeyVisible}
        onClose={() => setModalApiKeyVisible(false)}
        onSaved={handleGuardarApiKey}
        currentApiKey={apikey}
      />
      {visibleMensajeFlotante && (
        <Animated.View style={[styles.mensajeFlotante, { transform: [{ translateY: mensajeAnim }] }]}>
          <Text style={styles.mensajeFlotanteText}>{mensaje}</Text>
        </Animated.View>
      )}
      <Toast />
      <AIFloatingButton
        onPress={handleVoiceAssistant}
        description={isRecording ? (isProcessing ? 'Procesando...' : 'Grabando...') : isProcessing ? 'Procesando...' : 'Asistente de voz para ventas'}
        icon={isRecording ? (isProcessing ? 'cloud-upload' : 'record-circle') : isProcessing ? 'cloud-upload' : 'microphone'}
        isRecording={isRecording || isProcessing}
        disabled={isProcessing}
      />
      <ModalInterpretacionVoz
        visible={modalInterpretacionVisible}
        onClose={() => setModalInterpretacionVisible(false)}
        productosInterpretados={productosInterpretados}
        onAgregarAlCarrito={handleAgregarProductosInterpretados}
        textoOriginal={transcript}
      />
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
  content: {
    flex: 1,
    padding: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
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