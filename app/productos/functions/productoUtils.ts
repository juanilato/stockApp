import { Producto, VarianteProducto } from '../../../services/db';

// Genera un código EAN13 válido
export const generarEAN13 = (): string => {
  // Prefijo para Argentina (779)
  const prefijo = '779';
  // Generar 9 dígitos aleatorios
  const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  const base = prefijo + random;
  const checkDigit = calcularDigitoControlEAN13(base);
  return base + checkDigit;
};

// Calcula el dígito de control para EAN13
export const calcularDigitoControlEAN13 = (codigo: string): string => {
  const nums = codigo.split('').map(n => parseInt(n));
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    // En EAN13, las posiciones pares (0-based) se multiplican por 3
    sum += i % 2 === 1 ? nums[i] * 3 : nums[i];
  }
  const check = (10 - (sum % 10)) % 10;
  return check.toString();
};

// Genera el payload para código de barras
export const generarCodigoBarrasPayload = (producto: Producto, variante?: VarianteProducto) => {
  return variante
    ? {
        nombre: producto.nombre,
        precioVenta: producto.precioVenta,
        varianteNombre: variante.nombre,
        codigoBarras: variante.codigoBarras,
      }
    : {
        nombre: producto.nombre,
        precioVenta: producto.precioVenta,
        codigoBarras: producto.codigoBarras,
      };
};

// Busca un producto por código de barras
export const buscarProductoPorCodigo = (productos: Producto[], codigo: string) => {
  const producto = productos.find(p =>
    p.codigoBarras === codigo || p.variantes?.some(v => v.codigoBarras === codigo)
  );

  if (producto) {
    const variante = producto.variantes?.find(v => v.codigoBarras === codigo);
    return { producto, variante };
  }

  return { producto: null, variante: null };
}; 