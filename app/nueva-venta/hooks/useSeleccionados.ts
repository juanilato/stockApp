// hooks/useNuevaVenta/useSeleccionados.ts
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { Producto, VarianteProducto } from '../../../services/db';

export interface ProductoSeleccionado extends Producto {
  cantidad: number;
  varianteSeleccionada?: VarianteProducto | null;
}

export const useSeleccionados = (productos: Producto[]) => {
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);

  const agregarProducto = (producto: Producto, cantidad: number = 1, variante?: VarianteProducto | null) => {
    if ((producto.variantes && producto.variantes.length > 0) && variante === undefined) {
      Alert.alert('Error', 'Este producto solo se puede vender por variante');
      return;
    }

    const existente = productosSeleccionados.find(p =>
      p.id === producto.id &&
      ((!p.varianteSeleccionada && !variante) ||
        (p.varianteSeleccionada?.id === variante?.id))
    );

    const stockDisponible = variante ? variante.stock : producto.stock;

    if (existente) {
      if (existente.cantidad + cantidad > stockDisponible) {
        Alert.alert('Error', 'No hay suficiente stock disponible');
        return;
      }

      setProductosSeleccionados(prev =>
        prev.map(p =>
          p.id === producto.id &&
          ((!p.varianteSeleccionada && !variante) ||
            (p.varianteSeleccionada?.id === variante?.id))
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        )
      );
    } else {
      if (stockDisponible <= 0) {
        Alert.alert('Error', 'No hay stock disponible');
        return;
      }

      setProductosSeleccionados(prev => [
        ...prev,
        {
          ...producto,
          cantidad,
          varianteSeleccionada: variante,
        },
      ]);
    }
  };

  const actualizarCantidad = (productoId: number, nuevaCantidad: number, varianteId?: number) => {
    const producto = productosSeleccionados.find(p =>
      p.id === productoId &&
      ((!p.varianteSeleccionada && !varianteId) ||
        (p.varianteSeleccionada?.id === varianteId))
    );
    if (!producto) return;

    const productoOriginal = productos.find(p => p.id === productoId);
    if (!productoOriginal) return;

    const stockDisponible = producto.varianteSeleccionada
      ? producto.varianteSeleccionada.stock
      : productoOriginal.stock;

    if (nuevaCantidad > stockDisponible) {
      Alert.alert('Error', 'No hay suficiente stock disponible');
      return;
    }

    if (nuevaCantidad < 1) {
      eliminarProducto(productoId, varianteId);
      return;
    }

    setProductosSeleccionados(prev =>
      prev.map(p =>
        p.id === productoId &&
        ((!p.varianteSeleccionada && !varianteId) ||
          (p.varianteSeleccionada?.id === varianteId))
          ? { ...p, cantidad: nuevaCantidad }
          : p
      )
    );
  };

  const eliminarProducto = (productoId: number, varianteId?: number) => {
    setProductosSeleccionados(prev =>
      prev.filter(p =>
        !(p.id === productoId &&
          ((!p.varianteSeleccionada && !varianteId) ||
            (p.varianteSeleccionada?.id === varianteId)))
      )
    );
  };

  const calcularTotal = () =>
    productosSeleccionados.reduce((total, p) => total + p.precioVenta * p.cantidad, 0);

  const calcularGanancia = () =>
    productosSeleccionados.reduce((total, p) =>
      total + (p.precioVenta - p.precioCosto) * p.cantidad, 0);

  const resetSeleccionados = () => setProductosSeleccionados([]);

  const limpiarVenta = () => {
    setProductosSeleccionados([]);
  };

  const total = useMemo(() => {
    return productosSeleccionados.reduce((sum, p) => sum + p.precioVenta * p.cantidad, 0);
  }, [productosSeleccionados]);

  return {
    productosSeleccionados,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    calcularTotal,
    calcularGanancia,
    resetSeleccionados,
    limpiarVenta,
    total,
    setProductosSeleccionados,
  };
};

export default useSeleccionados;
