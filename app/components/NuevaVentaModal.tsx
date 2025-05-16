import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Producto, obtenerProductos, setupProductosDB } from '../../services/db';
import { colors, commonStyles, spacing, typography } from '../styles/theme';

interface NuevaVentaModalProps {
  visible: boolean;
  onClose: () => void;
  onProductoSeleccionado: (producto: Producto, cantidad: number) => void;
}

export default function NuevaVentaModal({ visible, onClose, onProductoSeleccionado }: NuevaVentaModalProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [modalCantidadVisible, setModalCantidadVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
    }
  }, [visible]);

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

  const filtrarProductos = () => {
    if (!busqueda) return productos;
    return productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  const seleccionarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalCantidadVisible(true);
  };

  const confirmarCantidad = () => {
    if (!productoSeleccionado) return;

    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      Alert.alert('Error', 'Por favor ingrese una cantidad válida');
      return;
    }

    if (cantidadNum > productoSeleccionado.stock) {
      Alert.alert('Error', 'No hay suficiente stock disponible');
      return;
    }

    onProductoSeleccionado(productoSeleccionado, cantidadNum);
    setModalCantidadVisible(false);
    setProductoSeleccionado(null);
    setCantidad('1');
  };

  const renderItem = ({ item }: { item: Producto }) => (
    <TouchableOpacity
      style={commonStyles.listItem}
      onPress={() => seleccionarProducto(item)}
    >
      <View style={styles.productoInfo}>
        <Text style={commonStyles.listItemTitle}>{item.nombre}</Text>
        <View style={styles.productoDetalles}>
          <Text style={commonStyles.listItemSubtitle}>
            Precio: ${item.precioVenta}
          </Text>
          <Text style={commonStyles.listItemSubtitle}>
            Stock: {item.stock}
          </Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.gray[400]} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.emptyStateText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          commonStyles.modalContainer,
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
        <View style={[commonStyles.modalContent, { marginTop: 100 }]}>
          <View style={[commonStyles.modalHeader, { marginBottom: spacing.xl }]}>
            <Text style={[commonStyles.modalTitle, { fontSize: typography.sizes['2xl'] }]}>Seleccionar Producto</Text>
            <TouchableOpacity 
              onPress={onClose}
              style={{ padding: spacing.sm }}
            >
              <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={[commonStyles.input, { fontSize: typography.sizes.lg, marginBottom: spacing.lg }]}
            placeholder="Buscar producto..."
            value={busqueda}
            onChangeText={setBusqueda}
            placeholderTextColor={colors.gray[400]}
          />

          <FlatList
            data={filtrarProductos()}
            renderItem={renderItem}
            keyExtractor={(item) => item.id?.toString() || ''}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.md }}
            ListEmptyComponent={
              <View style={[commonStyles.emptyState, { padding: spacing.xl }]}>
                <Text style={[commonStyles.emptyStateText, { fontSize: typography.sizes.lg }]}>
                  No se encontraron productos
                </Text>
              </View>
            }
          />

          <Modal
            visible={modalCantidadVisible}
            animationType="none"
            transparent={true}
            onRequestClose={() => setModalCantidadVisible(false)}
          >
            <Animated.View 
              style={[
                commonStyles.modalContainer,
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
              <View style={[commonStyles.modalContent, { marginTop: 100 }]}>
                <View style={[commonStyles.modalHeader, { marginBottom: spacing.xl }]}>
                  <Text style={[commonStyles.modalTitle, { fontSize: typography.sizes['2xl'] }]}>
                    Cantidad de {productoSeleccionado?.nombre}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setModalCantidadVisible(false)}
                    style={{ padding: spacing.sm }}
                  >
                    <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={[commonStyles.input, { fontSize: typography.sizes.lg, marginBottom: spacing.xl }]}
                  value={cantidad}
                  onChangeText={setCantidad}
                  placeholder="Cantidad"
                  keyboardType="numeric"
                  placeholderTextColor={colors.gray[400]}
                  autoFocus
                />

                <View style={[styles.buttonContainer, { marginTop: spacing.xl }]}>
                  <TouchableOpacity
                    style={[commonStyles.button, commonStyles.buttonDanger, { flex: 1 }]}
                    onPress={() => setModalCantidadVisible(false)}
                  >
                    <Text style={[commonStyles.buttonText, { fontSize: typography.sizes.lg }]}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[commonStyles.button, commonStyles.buttonPrimary, { flex: 1 }]}
                    onPress={confirmarCantidad}
                  >
                    <Text style={[commonStyles.buttonText, { fontSize: typography.sizes.lg }]}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </Modal>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  productoInfo: {
    flex: 1,
  },
  productoDetalles: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
}); 