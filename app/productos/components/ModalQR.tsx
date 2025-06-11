// productos/views/modales/ModalQR.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useRef } from 'react';
import {
    Modal,
    Text, TouchableOpacity,
    View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Producto } from '../../../services/db';
import { colors } from '../../styles/theme';
import { styles } from '../styles/modals/ModalQR.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  qrData: string;
  producto: Producto | null;
}

export default function ModalQR({ visible, onClose, qrData, producto }: Props) {
  const qrRef = useRef<any>(null);


  // Función para compartir el código QR
  const compartirQR = async () => {
    try {
      if (!qrRef.current || !producto) return;

      const path = `${FileSystem.cacheDirectory}qr-${producto.id}.png`;

      // @ts-ignore - QRCode ref workaround
      qrRef.current.toDataURL(async (data: string) => {
        await FileSystem.writeAsStringAsync(path, data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(path, {
          mimeType: 'image/png',
          dialogTitle: `QR de ${producto.nombre}`,
        });

        onClose();
      });
    } catch (error) {
      console.error('Error al compartir QR:', error);
      alert('No se pudo compartir el código QR');
    }
  };

  // Renderiza el contenido del QR, mostrando nombre, variante (si existe) y precio
  const renderContenidoQR = () => {
    try {
      const parsed = JSON.parse(qrData);
      return (
        <>
          <Text style={styles.qrText}>{parsed.nombre}</Text>
          {parsed.varianteNombre && parsed.varianteId && (
            <Text style={styles.qrVarianteText}>
              Variante: {parsed.varianteNombre} (ID: {parsed.varianteId})
            </Text>
          )}
          <Text style={styles.qrPrice}>${producto?.precioVenta}</Text>
        </>
      );
    } catch {
      return <Text style={{ color: 'red' }}>⚠️ Error al leer QR</Text>;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Código QR</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.qrContainer}>
              <QRCode
                value={qrData}
                size={200}
                backgroundColor="white"
                color="black"
                getRef={(ref) => (qrRef.current = ref)}
              />
              {qrData ? renderContenidoQR() : null}
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={onClose}
            >
              <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
              <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={compartirQR}
            >
              <MaterialCommunityIcons name="share" size={20} color={colors.white} />
              <Text style={styles.modalButtonText}>Compartir QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
