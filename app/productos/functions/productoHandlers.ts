import { actualizarProducto, eliminarProducto, insertarProducto, Producto } from '../../../services/db';
import { generarEAN13 } from './productoUtils';

// Tipo para el toast
export type ToastType = { message: string; type?: 'success' | 'error' | 'warning' } | null;

// Manejador para guardar productos
export const manejarGuardarProducto = async (
  producto: Producto, 
  esNuevo: boolean,
  cargarProductos: () => Promise<void>,
  setToast: (toast: ToastType) => void
) => {
  try {
    // Si es nuevo y no trae código, lo generamos
    if (esNuevo && !producto.codigoBarras) {
      producto.codigoBarras = generarEAN13();
    }

    if (esNuevo) {
      await insertarProducto(producto);
      setToast({
        type: 'success',
        message: 'Producto creado correctamente',
      });
      console.log('🆕 Producto creado');
    } else {
      await actualizarProducto(producto);
      setToast({
        type: 'success',
        message: 'Producto editado correctamente',
      });
      console.log('✏️ Producto editado');
    }

    await cargarProductos(); // Refresca la lista
  } catch (error) {
    console.error('❌ Error al guardar producto:', error);
    setToast({
      type: 'error',
      message: 'Hubo un error al guardar el producto.',
    });
  }
};

// Manejador para eliminar productos
export const manejarEliminarProducto = async (
  id: number,
  cargarProductos: () => Promise<void>,
  setToast: (toast: ToastType) => void,
  setProductoAEliminar: (producto: Producto | null) => void
) => {
  try {
    await eliminarProducto(id);
    await cargarProductos();
    setToast({ type: 'success', message: 'Producto eliminado' });
    setProductoAEliminar(null);
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    setToast({
      type: 'error',
      message: 'Hubo un error al eliminar el producto.',
    });
  }
}; 