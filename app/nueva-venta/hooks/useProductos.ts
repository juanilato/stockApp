// hooks/useNuevaVenta/useProductos.ts
import { useEffect, useState } from 'react';
import { Producto, obtenerProductos, setupProductosDB } from '../../../services/db';

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const inicializarDB = async () => {
      try {
        await setupProductosDB();
        await cargarProductos();
      } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const cargarProductos = async () => {
      obtenerProductos(setProductos);
    };

    inicializarDB();
  }, []);

  return {
    productos,
    isLoading,
    setProductos
  };
};
