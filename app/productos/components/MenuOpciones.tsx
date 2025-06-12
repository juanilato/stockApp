import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Producto, VarianteProducto } from '../../../services/db';
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

  const handleGenerarQR = () => {
    if (producto.variantes?.length) {
      setModalVariantesVisible(true);
    } else {
      onGenerarQR(producto);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>{producto.nombre}</Text>

        <View style={styles.buttonList}>
          <TouchableOpacity style={styles.optionRow} onPress={handleGenerarQR}>
            <MaterialCommunityIcons name="qrcode" size={20} color="#334155" />
            <Text style={styles.optionText}>Generar QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => { onClose(); onEditarProducto(producto); }}>
            <MaterialCommunityIcons name="pencil" size={20} color="#334155" />
            <Text style={styles.optionText}>Editar Producto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => { onClose(); onManejarComponentes(producto); }}>
            <MaterialCommunityIcons name="package-variant" size={20} color="#334155" />
            <Text style={styles.optionText}>Componentes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => { onClose(); onManejarVariantes(producto); }}>
            <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#334155" />
            <Text style={styles.optionText}>Variantes</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      {modalVariantesVisible && (
        <Modal transparent animationType="fade" visible={modalVariantesVisible} onRequestClose={() => setModalVariantesVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.variantModal}>
              <Text style={styles.variantTitle}>Elegí una variante</Text>
              {producto.variantes?.map((variante) => (
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
              <TouchableOpacity onPress={() => setModalVariantesVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
}
