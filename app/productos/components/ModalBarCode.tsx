// productos/views/modales/ModalBarcode.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import React, { useRef, useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ViewShot from 'react-native-view-shot';

import { Producto, VarianteProducto } from '../../../services/db';
import { styles } from '../styles/modals/ModalQR.styles';
import BarcodeSVG from './BarcodeSVG';

interface Props {
  visible: boolean;
  onClose: () => void;
  barcodeData: string;
  producto: Producto | null;
  variante?: VarianteProducto | null;
}

export default function ModalBarcode({ visible, onClose, barcodeData, producto, variante }: Props) {
  const barcodeRef = useRef<any>(null);
  const [barcodeError, setBarcodeError] = useState<string | null>(null);

const compartirBarcode = async () => {
  try {
    if (!barcodeRef.current || !producto) return;

    setTimeout(async () => {
      const uri = await barcodeRef.current.capture();
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: `Código de barras de ${producto.nombre}`,
      });
      onClose();
    }, 300); // espera 300ms para que el WebView renderice el SVG
  } catch (error) {
    console.error('Error al compartir código de barras:', error);
    alert('No se pudo compartir el código de barras');
  }
};


  const renderContenidoBarcode = () => {
    try {
      const parsed = JSON.parse(barcodeData);
      return (
        <>
          <Text style={styles.qrText}>{parsed.nombre}</Text>
          {parsed.varianteNombre && (
            <Text style={styles.qrVarianteText}>
              Variante: {parsed.varianteNombre}
            </Text>
          )}
          <Text style={styles.qrPrice}>${parsed.precioVenta}</Text>
        </>
      );
    } catch (e) {
      return (
        <>
          <Text style={{ color: 'red' }}>⚠️ Error en código</Text>
          <Text style={{ color: '#64748b' }}>{barcodeData}</Text>
        </>
      );
    }
  };

  // Validar si el dato es válido para EAN13
  let codigoBarras: string | null = null;
  try {
    const parsed = JSON.parse(barcodeData);
    codigoBarras = parsed?.codigoBarras?.toString() || null;
  } catch (e) {
    codigoBarras = typeof barcodeData === 'string' && barcodeData.length > 0 ? barcodeData : null;
  }

  const isCodigoValido = codigoBarras && /^[0-9]{13}$/.test(codigoBarras);

  console.log('🔍 Debug - Código de barras:', {
    codigoBarras,
    isCodigoValido,
    barcodeData
  });

  const handleBarcodeError = (error: any) => {
    console.error('Error al generar código de barras:', error);
    setBarcodeError(error.message);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose} presentationStyle="overFullScreen">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Código de Barras</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#334155" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.qrBox}>
              {isCodigoValido ? (
                <ViewShot ref={barcodeRef} options={{ format: 'png', quality: 1.0 }}>
                  <BarcodeSVG value={codigoBarras || ''} />
                </ViewShot>
              ) : (
                <Text style={{ color: 'red', marginBottom: 8 }}>
                  ❌ Código inválido para formato EAN (debe tener 13 dígitos)
                </Text>
              )}
              {barcodeError && (
                <Text style={{ color: 'red', marginTop: 8 }}>
                  Error: {barcodeError}
                </Text>
              )}
              {renderContenidoBarcode()}
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.buttonSecondary} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={20} color="#475569" />
              <Text style={styles.buttonSecondaryText}>Cerrar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.buttonPrimary, !isCodigoValido && { opacity: 0.5 }]} 
              onPress={compartirBarcode} 
              disabled={!isCodigoValido}
            >
              <MaterialCommunityIcons name="share" size={20} color="#fff" />
              <Text style={styles.buttonPrimaryText}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
