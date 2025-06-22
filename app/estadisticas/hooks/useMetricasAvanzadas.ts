import { useState } from 'react';
import { getDb } from '../../../services/db';
import { MetricasAvanzadas } from '../types';

export const useMetricasAvanzadas = () => {
  const [metricasAvanzadas, setMetricasAvanzadas] = useState<MetricasAvanzadas | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cargarMetricasAvanzadas = async () => {
    setIsLoading(true);
    try {
      const db = getDb();
      
      // Métricas básicas para empezar
      const ticketPromedio = await calcularTicketPromedio(db);
      const productosPorVenta = await calcularProductosPorVenta(db);
      const margenPromedio = await calcularMargenPromedio(db);
      const valorInventario = await calcularValorInventario(db);

      const metricas: MetricasAvanzadas = {
        rendimientoVentas: {
          ticketPromedio,
          productosPorVenta,
          horariosPico: [],
          diasActivos: [],
        },
        analisisProductos: {
          masRentables: [],
          mayorRotacion: [],
          estancados: [],
          tendencias: [],
        },
        metricasFinancieras: {
          margenPromedio,
          roi: [],
          flujoCaja: { entradas: 0, salidas: 0, balance: 0 },
          proyeccion: { proximoMes: 0, proximoTresMeses: 0, tendencia: 'estable' },
        },
        analisisInventario: {
          valorTotal: valorInventario,
          proximosAgotarse: [],
          sobrestockeados: [],
          rotacion: { promedio: 0, productos: [] },
        },
        metricasCliente: {
          recurrentes: { total: 0, porcentaje: 0, nuevos: 0 },
          valorPromedio: ticketPromedio,
          productosPopulares: [],
        },
      };

      setMetricasAvanzadas(metricas);
    } catch (error) {
      console.error('Error al cargar métricas avanzadas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    metricasAvanzadas,
    isLoading,
    cargarMetricasAvanzadas,
  };
};

// Funciones auxiliares básicas
const calcularTicketPromedio = async (db: any): Promise<number> => {
  try {
    const result = await db.getFirstAsync(`
      SELECT AVG(precioTotal) as promedio 
      FROM ventas 
      WHERE precioTotal > 0
    `);
    return result?.promedio || 0;
  } catch (error) {
    console.error('Error calculando ticket promedio:', error);
    return 0;
  }
};

const calcularProductosPorVenta = async (db: any): Promise<number> => {
  try {
    const result = await db.getFirstAsync(`
      SELECT AVG(totalProductos) as promedio 
      FROM ventas 
      WHERE totalProductos > 0
    `);
    return result?.promedio || 0;
  } catch (error) {
    console.error('Error calculando productos por venta:', error);
    return 0;
  }
};

const calcularMargenPromedio = async (db: any): Promise<number> => {
  try {
    const result = await db.getFirstAsync(`
      SELECT AVG((p.precioVenta - p.precioCosto) / p.precioVenta * 100) as margenPromedio
      FROM productos p
      WHERE p.precioVenta > 0
    `);
    return result?.margenPromedio || 0;
  } catch (error) {
    console.error('Error calculando margen promedio:', error);
    return 0;
  }
};

const calcularValorInventario = async (db: any): Promise<{ costo: number; venta: number; diferencia: number }> => {
  try {
    const result = await db.getFirstAsync(`
      SELECT 
        SUM(p.precioCosto * p.stock) as costo,
        SUM(p.precioVenta * p.stock) as venta
      FROM productos p
    `);
    
    const costo = result?.costo || 0;
    const venta = result?.venta || 0;
    
    return {
      costo,
      venta,
      diferencia: venta - costo,
    };
  } catch (error) {
    console.error('Error calculando valor de inventario:', error);
    return { costo: 0, venta: 0, diferencia: 0 };
  }
};

// Funciones auxiliares para calcular métricas
const calcularHorariosPico = async (db: any): Promise<{ hora: number; ventas: number }[]> => {
  try {
    const result = await db.getAllAsync(`
      SELECT 
        CAST(substr(fecha, 12, 2) AS INTEGER) as hora,
        COUNT(*) as ventas
      FROM ventas 
      GROUP BY hora 
      ORDER BY ventas DESC 
      LIMIT 5
    `);
    return result || [];
  } catch (error) {
    console.error('Error calculando horarios pico:', error);
    return [];
  }
};

const calcularDiasActivos = async (db: any): Promise<{ dia: string; ventas: number }[]> => {
  try {
    const result = await db.getAllAsync(`
      SELECT 
        CASE 
          WHEN strftime('%w', fecha) = '0' THEN 'Domingo'
          WHEN strftime('%w', fecha) = '1' THEN 'Lunes'
          WHEN strftime('%w', fecha) = '2' THEN 'Martes'
          WHEN strftime('%w', fecha) = '3' THEN 'Miércoles'
          WHEN strftime('%w', fecha) = '4' THEN 'Jueves'
          WHEN strftime('%w', fecha) = '5' THEN 'Viernes'
          WHEN strftime('%w', fecha) = '6' THEN 'Sábado'
        END as dia,
        COUNT(*) as ventas
      FROM ventas 
      GROUP BY dia 
      ORDER BY ventas DESC
    `);
    return result || [];
  } catch (error) {
    console.error('Error calculando días activos:', error);
    return [];
  }
};

const calcularProductosMasRentables = async (db: any): Promise<{ nombre: string; rentabilidad: number; margen: number }[]> => {
  try {
    const result = await db.getAllAsync(`
      SELECT 
        p.nombre,
        SUM(vd.ganancia) as rentabilidad,
        AVG((p.precioVenta - p.precioCosto) / p.precioVenta * 100) as margen
      FROM productos p
      LEFT JOIN ventas_detalle vd ON p.id = vd.productoId
      GROUP BY p.id, p.nombre
      HAVING rentabilidad > 0
      ORDER BY rentabilidad DESC
      LIMIT 10
    `);
    return result || [];
  } catch (error) {
    console.error('Error calculando productos más rentables:', error);
    return [];
  }
};

const calcularProductosConMayorRotacion = async (db: any): Promise<{ nombre: string; frecuencia: number; ultimaVenta: string }[]> => {
  try {
    const result = await db.getAllAsync(`
      SELECT 
        p.nombre,
        COUNT(vd.id) as frecuencia,
        MAX(v.fecha) as ultimaVenta
      FROM productos p
      LEFT JOIN ventas_detalle vd ON p.id = vd.productoId
      LEFT JOIN ventas v ON vd.ventaId = v.id
      GROUP BY p.id, p.nombre
      HAVING frecuencia > 0
      ORDER BY frecuencia DESC
      LIMIT 10
    `);
    return result || [];
  } catch (error) {
    console.error('Error calculando productos con mayor rotación:', error);
    return [];
  }
};

const calcularProductosEstancados = async (db: any): Promise<{ nombre: string; diasSinVenta: number; stock: number }[]> => {
  try {
    const result = await db.getAllAsync(`
      SELECT 
        p.nombre,
        p.stock,
        JULIANDAY('now') - JULIANDAY(MAX(v.fecha)) as diasSinVenta
      FROM productos p
      LEFT JOIN ventas_detalle vd ON p.id = vd.productoId
      LEFT JOIN ventas v ON vd.ventaId = v.id
      GROUP BY p.id, p.nombre, p.stock
      HAVING diasSinVenta > 30 OR diasSinVenta IS NULL
      ORDER BY diasSinVenta DESC
      LIMIT 10
    `);
    return result || [];
  } catch (error) {
    console.error('Error calculando productos estancados:', error);
    return [];
  }
};

const calcularTendenciaProductos = async (db: any): Promise<{ nombre: string; crecimiento: number; ventasActual: number; ventasAnterior: number }[]> => {
  try {
    const result = await db.getAllAsync(`
      SELECT 
        p.nombre,
        COALESCE(ventas_actual.cantidad, 0) as ventasActual,
        COALESCE(ventas_anterior.cantidad, 0) as ventasAnterior,
        CASE 
          WHEN COALESCE(ventas_anterior.cantidad, 0) = 0 THEN 100
          ELSE ((COALESCE(ventas_actual.cantidad, 0) - COALESCE(ventas_anterior.cantidad, 0)) / COALESCE(ventas_anterior.cantidad, 0)) * 100
        END as crecimiento
      FROM productos p
      LEFT JOIN (
        SELECT 
          vd.productoId,
          SUM(vd.cantidad) as cantidad
        FROM ventas_detalle vd
        JOIN ventas v ON vd.ventaId = v.id
        WHERE v.fecha >= date('now', 'start of month')
        GROUP BY vd.productoId
      ) ventas_actual ON p.id = ventas_actual.productoId
      LEFT JOIN (
        SELECT 
          vd.productoId,
          SUM(vd.cantidad) as cantidad
        FROM ventas_detalle vd
        JOIN ventas v ON vd.ventaId = v.id
        WHERE v.fecha >= date('now', 'start of month', '-1 month')
        AND v.fecha < date('now', 'start of month')
        GROUP BY vd.productoId
      ) ventas_anterior ON p.id = ventas_anterior.productoId
      ORDER BY crecimiento DESC
      LIMIT 10
    `);
    return result || [];
  } catch (error) {
    console.error('Error calculando tendencia de productos:', error);
    return [];
  }
};

const calcularROIProductos = async (db: any): Promise<{ nombre: string; roi: number; inversion: number; ganancia: number }[]> => {
  try {
    const result = await db.getAllAsync(`
      SELECT 
        p.nombre,
        p.precioCosto * p.stock as inversion,
        SUM(vd.ganancia) as ganancia,
        CASE 
          WHEN p.precioCosto * p.stock > 0 
          THEN (SUM(vd.ganancia) / (p.precioCosto * p.stock)) * 100
          ELSE 0
        END as roi
      FROM productos p
      LEFT JOIN ventas_detalle vd ON p.id = vd.productoId
      GROUP BY p.id, p.nombre, p.precioCosto, p.stock
      HAVING ganancia > 0
      ORDER BY roi DESC
      LIMIT 10
    `);
    return result || [];
  } catch (error) {
    console.error('Error calculando ROI de productos:', error);
    return [];
  }
};

const calcularFlujoCaja = async (db: any): Promise<{ entradas: number; salidas: number; balance: number }> => {
  try {
    const entradas = await db.getFirstAsync(`
      SELECT SUM(precioTotal) as total
      FROM ventas
      WHERE fecha >= date('now', 'start of month')
    `);
    
    const salidas = await db.getFirstAsync(`
      SELECT SUM(p.precioCosto * p.stock) as total
      FROM productos p
    `);
    
    const entradasTotal = entradas?.total || 0;
    const salidasTotal = salidas?.total || 0;
    
    return {
      entradas: entradasTotal,
      salidas: salidasTotal,
      balance: entradasTotal - salidasTotal,
    };
  } catch (error) {
    console.error('Error calculando flujo de caja:', error);
    return { entradas: 0, salidas: 0, balance: 0 };
  }
};

const calcularProyeccionGanancias = async (db: any): Promise<{ proximoMes: number; proximoTresMeses: number; tendencia: string }> => {
  try {
    const gananciasActuales = await db.getAllAsync(`
      SELECT SUM(ganancia) as ganancia, fecha
      FROM ventas
      WHERE fecha >= date('now', '-3 months')
      GROUP BY strftime('%Y-%m', fecha)
      ORDER BY fecha DESC
      LIMIT 3
    `);
    
    if (gananciasActuales.length < 2) {
      return { proximoMes: 0, proximoTresMeses: 0, tendencia: 'estable' };
    }
    
    const gananciaActual = gananciasActuales[0]?.ganancia || 0;
    const gananciaAnterior = gananciasActuales[1]?.ganancia || 0;
    
    const crecimiento = gananciaAnterior > 0 ? (gananciaActual - gananciaAnterior) / gananciaAnterior : 0;
    const proximoMes = gananciaActual * (1 + crecimiento);
    const proximoTresMeses = gananciaActual * Math.pow(1 + crecimiento, 3);
    
    let tendencia = 'estable';
    if (crecimiento > 0.1) tendencia = 'creciente';
    else if (crecimiento < -0.1) tendencia = 'decreciente';
    
    return { proximoMes, proximoTresMeses, tendencia };
  } catch (error) {
    console.error('Error calculando proyección de ganancias:', error);
    return { proximoMes: 0, proximoTresMeses: 0, tendencia: 'estable' };
  }
};

const calcularProductosProximosAgotarse = async (db: any): Promise<{ nombre: string; stock: number; diasRestantes: number }[]> => {
  try {
    const result = await db.getAllAsync(`
      SELECT 
        p.nombre,
        p.stock,
        CASE 
          WHEN p.stock = 0 THEN 0
          ELSE p.stock * 30 / COALESCE(ventas_mensuales.cantidad, 1)
        END as diasRestantes
      FROM productos p
      LEFT JOIN (
        SELECT 
          vd.productoId,
          SUM(vd.cantidad) as cantidad
        FROM ventas_detalle vd
        JOIN ventas v ON vd.ventaId = v.id
        WHERE v.fecha >= date('now', '-30 days')
        GROUP BY vd.productoId
      ) ventas_mensuales ON p.id = ventas_mensuales.productoId
      WHERE p.stock <= 10
      ORDER BY diasRestantes ASC
      LIMIT 10
    `);
    return result || [];
  } catch (error) {
    console.error('Error calculando productos próximos a agotarse:', error);
    return [];
  }
};

const calcularProductosSobrestockeados = async (db: any): Promise<{ nombre: string; stock: number; recomendacion: string }[]> => {
  try {
    const result = await db.getAllAsync(`
      SELECT 
        p.nombre,
        p.stock,
        CASE 
          WHEN p.stock > 100 THEN 'Reducir stock'
          WHEN p.stock > 50 THEN 'Mantener nivel actual'
          ELSE 'Stock normal'
        END as recomendacion
      FROM productos p
      WHERE p.stock > 50
      ORDER BY p.stock DESC
      LIMIT 10
    `);
    return result || [];
  } catch (error) {
    console.error('Error calculando productos sobrestockeados:', error);
    return [];
  }
};

const calcularRotacionInventario = async (db: any): Promise<{ promedio: number; productos: { nombre: string; diasRotacion: number }[] }> => {
  try {
    const productos = await db.getAllAsync(`
      SELECT 
        p.nombre,
        CASE 
          WHEN COALESCE(ventas_mensuales.cantidad, 0) = 0 THEN 999
          ELSE 30 / (ventas_mensuales.cantidad / p.stock)
        END as diasRotacion
      FROM productos p
      LEFT JOIN (
        SELECT 
          vd.productoId,
          SUM(vd.cantidad) as cantidad
        FROM ventas_detalle vd
        JOIN ventas v ON vd.ventaId = v.id
        WHERE v.fecha >= date('now', '-30 days')
        GROUP BY vd.productoId
      ) ventas_mensuales ON p.id = ventas_mensuales.productoId
      WHERE p.stock > 0
      ORDER BY diasRotacion ASC
      LIMIT 10
    `);
    
    const promedio = productos.reduce((acc: number, p: any) => acc + p.diasRotacion, 0) / productos.length;
    
    return { promedio, productos: productos || [] };
  } catch (error) {
    console.error('Error calculando rotación de inventario:', error);
    return { promedio: 0, productos: [] };
  }
};

const calcularVentasRecurrentes = async (db: any): Promise<{ total: number; porcentaje: number; nuevos: number }> => {
  try {
    const totalClientes = await db.getFirstAsync(`
      SELECT COUNT(DISTINCT v.id) as total
      FROM ventas v
    `);
    
    const clientesRecurrentes = await db.getFirstAsync(`
      SELECT COUNT(*) as total
      FROM (
        SELECT v.id
        FROM ventas v
        GROUP BY v.id
        HAVING COUNT(*) > 1
      )
    `);
    
    const total = totalClientes?.total || 0;
    const recurrentes = clientesRecurrentes?.total || 0;
    const nuevos = total - recurrentes;
    const porcentaje = total > 0 ? (recurrentes / total) * 100 : 0;
    
    return { total, porcentaje, nuevos };
  } catch (error) {
    console.error('Error calculando ventas recurrentes:', error);
    return { total: 0, porcentaje: 0, nuevos: 0 };
  }
};

const calcularValorClientePromedio = async (db: any): Promise<number> => {
  try {
    const result = await db.getFirstAsync(`
      SELECT AVG(precioTotal) as promedio
      FROM ventas
      WHERE precioTotal > 0
    `);
    return result?.promedio || 0;
  } catch (error) {
    console.error('Error calculando valor cliente promedio:', error);
    return 0;
  }
};

const calcularProductosPopularesPorSegmento = async (db: any): Promise<{ segmento: string; productos: { nombre: string; ventas: number }[] }[]> => {
  try {
    // Por ahora retornamos productos populares generales
    // En el futuro se puede segmentar por rangos de precio
    const productos = await db.getAllAsync(`
      SELECT 
        p.nombre,
        SUM(vd.cantidad) as ventas
      FROM productos p
      LEFT JOIN ventas_detalle vd ON p.id = vd.productoId
      GROUP BY p.id, p.nombre
      HAVING ventas > 0
      ORDER BY ventas DESC
      LIMIT 10
    `);
    
    return [{
      segmento: 'Productos Populares',
      productos: productos || []
    }];
  } catch (error) {
    console.error('Error calculando productos populares por segmento:', error);
    return [];
  }
}; 