import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Producto } from '../../../services/db';
import { ProductoItem } from './components/ProductoItem';
import { useProductos } from './hooks/useProductos';
import { ProductoModal } from './modals/ProductoModal';
import { styles } from './styles';

export default function ProductosView() {
  const { productos, isLoading, guardarProducto, eliminarProductoById } = useProductos();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
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

  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    const success = await eliminarProductoById(id);
    if (success) {
      // Aquí podrías agregar una animación de eliminación si lo deseas
    }
  };

  const handleSave = async (producto: Producto) => {
    const success = await guardarProducto(producto);
    if (success) {
      setModalVisible(false);
      setEditingProduct(null);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📦 Productos</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingProduct(null);
              setModalVisible(true);
            }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Nuevo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={productos}
          renderItem={({ item }) => (
            <ProductoItem
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMenuPress={() => {}} // Implementar según necesidad
            />
          )}
          keyExtractor={(item) => item.id?.toString() || ''}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#64748b' }}>No hay productos registrados</Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />

        <ProductoModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
          producto={editingProduct || undefined}
        />
      </Animated.View>
    </GestureHandlerRootView>
  );
} 