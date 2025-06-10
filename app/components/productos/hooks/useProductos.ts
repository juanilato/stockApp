import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
    actualizarProducto,
    eliminarProducto, insertarProducto, obtenerProductos, Producto, setupProductosDB
} from '../../../../services/db';

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    inicializarDB();
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
    try {
      await obtenerProductos((productos: Producto[]) => {
        setProductos(productos);
      });
    } catch (error) {
      console.error('Error al cargar productos:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    }
  };

  const guardarProducto = async (productoData: Producto) => {
    try {
      if (productoData.id) {
        await actualizarProducto(productoData);
      } else {
        await insertarProducto(productoData);
      }
      await cargarProductos();
      return true;
    } catch (error) {
      console.error('Error al guardar producto:', error);
      Alert.alert('Error', 'No se pudo guardar el producto');
      return false;
    }
  };

  const eliminarProductoById = async (id: number) => {
    try {
      await eliminarProducto(id);
      await cargarProductos();
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      Alert.alert('Error', 'No se pudo eliminar el producto');
      return false;
    }
  };

  return {
    productos,
    isLoading,
    cargarProductos,
    guardarProducto,
    eliminarProductoById,
  };
} 