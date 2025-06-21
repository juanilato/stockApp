import { useState } from 'react';
import { obtenerVentasPorMes } from '../../../services/db';

export const useVentasMensuales = () => {
  const [ventasMensuales, setVentasMensuales] = useState<{ mes: string; total: number }[]>([]);

  const cargarVentasMensuales = async () => {
    try {
      const ventas = await obtenerVentasPorMes();
      setVentasMensuales(ventas);
    } catch (error) {
      console.error('Error al cargar ventas mensuales:', error);
    }
  };

  return {
    ventasMensuales,
    cargarVentasMensuales,
  };
}; 