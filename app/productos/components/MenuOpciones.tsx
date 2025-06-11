// productos/views/MenuOpciones.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text, TouchableOpacity, TouchableWithoutFeedback,
  View
} from 'react-native';
import { Producto, VarianteProducto } from '../../../services/db';
import { colors } from '../../styles/theme';
import { styles } from '../styles/styles';

interface Props {
  visible: boolean;
  producto: Producto | null;
  onClose: () => void;
  onGenerarQR: (producto: Producto, variante?: VarianteProducto) => void;
  onEditarProducto: (producto: Producto) => void;
  onManejarComponentes: (producto: Producto) => void;
  onManejarVariantes: (producto: Producto) => void;
}

export default function MenuOpciones({
  visible,
  producto,
  onClose,
  onGenerarQR,
  onEditarProducto,
  onManejarComponentes,
  onManejarVariantes
}: Props) {
  if (!producto) return null;

  // Maneja la generación del QR, mostrando opciones si tiene variantes 
  const handleGenerarQR = () => {
    onClose();

    if (producto.variantes?.length) {
      // Si tiene variantes, mostrar opciones
      const opciones = producto.variantes.map((v) => ({
        text: v.nombre,
        onPress: () => onGenerarQR(producto, v),
      }));

      opciones.push({ text: "Cancelar", onPress: () => {} });

      // Esto asume que estás usando Alert de React Native para elegir
      // Podrías adaptarlo a un modal propio si querés más personalización
      // @ts-ignore
      alertMultiple("Seleccionar variante", opciones);
    } else {
      onGenerarQR(producto);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>

        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Opciones para {producto.nombre}</Text>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleGenerarQR}
          >
            <MaterialCommunityIcons name="qrcode" size={20} color={colors.primary} />
            <Text style={styles.menuButtonText}>Generar QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              onClose();
              onEditarProducto(producto);
            }}
          >
            <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
            <Text style={styles.menuButtonText}>Editar Producto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              onClose();
              onManejarComponentes(producto);
            }}
          >
            <MaterialCommunityIcons name="package-variant" size={20} color={colors.primary} />
            <Text style={styles.menuButtonText}>Manejar Componentes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              onClose();
              onManejarVariantes(producto);
            }}
          >
            <MaterialCommunityIcons name="format-list-bulleted" size={20} color={colors.primary} />
            <Text style={styles.menuButtonText}>Manejar Variantes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function alertMultiple(title: string, buttons: any[]) {
  Alert.alert(title, undefined, buttons);
}

