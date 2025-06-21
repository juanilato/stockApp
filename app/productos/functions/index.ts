// Exportar utilidades de productos
export {
    buscarProductoPorCodigo, calcularDigitoControlEAN13,
    generarCodigoBarrasPayload, generarEAN13
} from './productoUtils';

// Exportar manejadores de productos
export {
    ToastType, manejarEliminarProducto, manejarGuardarProducto
} from './productoHandlers';
