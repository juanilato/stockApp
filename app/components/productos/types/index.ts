import { Producto, VarianteProducto } from '../../../../services/db';

export interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric';
}

export interface ComponentesModalProps {
  visible: boolean;
  onClose: () => void;
  productoId: number;
  productos: Producto[];
}

export interface ProductoSeleccionado extends Producto {
  varianteSeleccionada?: VarianteProducto;
}

export interface ComponenteProducto {
  id?: number;
  productoId: number;
  materialId: number;
  cantidad: number;
}

export interface QRData {
  id?: number;
  nombre: string;
  precioVenta: number;
  varianteId?: number;
  varianteNombre?: string;
} 