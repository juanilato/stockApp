import { useState } from 'react';
import { getDb } from '../../../services/db';

export const useProductosCriticos = () => {
  const [productosCriticos, setProductosCriticos] = useState<{ id: number; nombre: string; stock: number }[]>([]);
  const [mostrarStockCritico, setMostrarStockCritico] = useState(false);

  const cargarProductosCriticos = async () => {
    try {
      const db = getDb();
      const criticos = await db.getAllAsync(`SELECT id, nombre, stock FROM productos WHERE stock <= 5`);
      setProductosCriticos(criticos as { id: number; nombre: string; stock: number }[]);
    } catch (error) {
      console.error("❌ Error al obtener productos críticos:", error);
    }
  };

  return {
    productosCriticos,
    mostrarStockCritico,
    setMostrarStockCritico,
    cargarProductosCriticos,
  };
}; 