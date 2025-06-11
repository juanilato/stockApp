// productos/views/MenuOpciones.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text, TouchableOpacity, TouchableWithoutFeedback,
  View
} from 'react-native';
import { Producto, VarianteProducto } from '../../../services/db';
import { colors } from '../../styles/theme';
import { styles } from '../styles/modals/MenuOpciones.styles';

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
  const [modalVariantesVisible, setModalVariantesVisible] = useState(false);
  if (!producto) return null;
  // Maneja la generación del QR, mostrando opciones si tiene variantes 
  const handleGenerarQR = () => {

    if (producto.variantes?.length) {
      // Si tiene variantes, mostrar opciones
    setModalVariantesVisible(true); 
    } else {
      onGenerarQR(producto);
      onClose();
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
      {modalVariantesVisible && (
  <Modal transparent animationType="fade" visible={modalVariantesVisible} onRequestClose={() => setModalVariantesVisible(false)}>
    <View style={styles.modalOverlay}>
      <View style={styles.variantModal}>
        <Text style={styles.modalTitle}>Seleccionar Variante</Text>
        {producto?.variantes?.map((variante) => (
          <TouchableOpacity
            key={variante.id}
            style={styles.variantItem}
            onPress={() => {
              onGenerarQR(producto, variante);
              setModalVariantesVisible(false);
              onClose();
            }}
          >
            <Text style={styles.variantText}>{variante.nombre}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => setModalVariantesVisible(false)} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}

    </Modal>
  );
}


