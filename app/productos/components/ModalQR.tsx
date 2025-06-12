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
  <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
  <View style={styles.overlay}>
    <View style={styles.sheet}>
      <View style={styles.header}>
        <Text style={styles.title}>Código QR</Text>
        <TouchableOpacity onPress={onClose}>
          <MaterialCommunityIcons name="close" size={24} color="#334155" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.qrBox}>
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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={onClose}>
          <MaterialCommunityIcons name="close" size={20} color="#475569" />
          <Text style={styles.buttonSecondaryText}>Cerrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPrimary} onPress={compartirQR}>
          <MaterialCommunityIcons name="share" size={20} color="#fff" />
          <Text style={styles.buttonPrimaryText}>Compartir QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

  );
}
