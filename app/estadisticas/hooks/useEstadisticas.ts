import { useState } from 'react';
import { obtenerEstadisticas } from '../../../services/db';

interface Estadisticas {
  ventasTotales: number;
  productosVendidos: number;
  gananciaTotal: number;
  productosMasVendidos: {
    nombre: string;
    cantidad: number;
  }[];
  stockTotal: number;
  productosStockCritico: number;
  gananciaMesActual: number;
  productoMasRentable: {
    nombre: string;
    rentabilidad: number;
  } | null;
  ganancias: {
    dia: number;
    mes: number;
    anio: number;
  };
}

export const useEstadisticas = () => {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);

  const cargarEstadisticas = async () => {
    try {
      const stats = await obtenerEstadisticas();
      setEstadisticas(stats);
      return stats.ganancias; // Retornamos las ganancias para que el componente principal las use
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      return { dia: 0, mes: 0, anio: 0 };
    }
  };

  return {
    estadisticas,
    cargarEstadisticas,
  };
}; 