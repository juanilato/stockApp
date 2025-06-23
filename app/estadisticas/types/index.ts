export interface Estadisticas {
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
  // Nuevas métricas de rendimiento de ventas
  ticketPromedio: number;
  productosPorVenta: number;
  horariosPico: {
    hora: number;
    ventas: number;
  }[];
  diasActivos: {
    dia: string;
    ventas: number;
  }[];
  // Nuevas métricas de productos
  productosMasRentables: {
    nombre: string;
    rentabilidad: number;
    margen: number;
  }[];
  productosConMayorRotacion: {
    nombre: string;
    frecuencia: number;
    ultimaVenta: string;
  }[];
  productosEstancados: {
    nombre: string;
    diasSinVenta: number;
    stock: number;
  }[];
  tendenciaProductos: {
    nombre: string;
    crecimiento: number;
    ventasMesActual: number;
    ventasMesAnterior: number;
  }[];
  // Nuevas métricas financieras
  margenGananciaPromedio: number;
  roiProductos: {
    nombre: string;
    roi: number;
    inversion: number;
    ganancia: number;
  }[];
  flujoCaja: {
    entradas: number;
    salidas: number;
    balance: number;
  };
  proyeccionGanancias: {
    proximoMes: number;
    proximoTresMeses: number;
    tendencia: 'creciente' | 'decreciente' | 'estable';
  };
  // Nuevas métricas de inventario
  valorInventario: {
    costo: number;
    venta: number;
    diferencia: number;
  };
  productosProximosAgotarse: {
    nombre: string;
    stock: number;
    diasRestantes: number;
  }[];
  productosSobrestockeados: {
    nombre: string;
    stock: number;
    recomendacion: string;
  }[];
  rotacionInventario: {
    promedio: number;
    productos: {
      nombre: string;
      diasRotacion: number;
    }[];
  };
  // Nuevas métricas de cliente
  ventasRecurrentes: {
    totalClientes: number;
    porcentajeRecurrentes: number;
    clientesNuevos: number;
  };
  valorClientePromedio: number;
  productosPopularesPorSegmento: {
    segmento: string;
    productos: {
      nombre: string;
      ventas: number;
    }[];
  }[];
}

export interface ProductoCritico {
  id: number;
  nombre: string;
  stock: number;
}

export interface VentaMensual {
  mes: string;
  total: number;
}

export type TipoGanancia = 'dia' | 'mes' | 'anio';

export interface MetricasAvanzadas {
  rendimientoVentas: {
    ticketPromedio: number;
    productosPorVenta: number;
    horariosPico: { hora: number; ventas: number }[];
    diasActivos: { dia: string; ventas: number }[];
  };
  analisisProductos: {
    masRentables: { nombre: string; rentabilidad: number; margen: number }[];
    mayorRotacion: { nombre: string; frecuencia: number; ultimaVenta: string }[];
    estancados: { nombre: string; diasSinVenta: number; stock: number }[];
    tendencias: { nombre: string; crecimiento: number; ventasActual: number; ventasAnterior: number }[];
  };
  metricasFinancieras: {
    margenPromedio: number;
    roi: { nombre: string; roi: number; inversion: number; ganancia: number }[];
    flujoCaja: { entradas: number; salidas: number; balance: number };
    proyeccion: { proximoMes: number; proximoTresMeses: number; tendencia: string };
  };
  analisisInventario: {
    valorTotal: { costo: number; venta: number; diferencia: number };
    proximosAgotarse: { nombre: string; stock: number; diasRestantes: number }[];
    sobrestockeados: { nombre: string; stock: number; recomendacion: string }[];
    rotacion: { promedio: number; productos: { nombre: string; diasRotacion: number }[] };
  };
  metricasCliente: {
    recurrentes: { total: number; porcentaje: number; nuevos: number };
    valorPromedio: number;
    productosPopulares: { segmento: string; productos: { nombre: string; ventas: number }[] }[];
  };
}

export interface ConfiguracionEstadisticas {
  mostrarStockTotal: boolean;
  mostrarStockCritico: boolean;
  mostrarGanancias: boolean;
  mostrarProductoMasRentable: boolean;
  mostrarMetricasRendimiento: boolean;
  mostrarMetricasFinancieras: boolean;
  mostrarAnalisisInventario: boolean;
  mostrarGraficoVentas: boolean;
  mostrarTicketPromedio: boolean;
  mostrarProductosPorVenta: boolean;
  mostrarHorariosPico: boolean;
  mostrarDiasActivos: boolean;
  mostrarMargenPromedio: boolean;
  mostrarFlujoCaja: boolean;
  mostrarProyeccion: boolean;
  mostrarValorTotal: boolean;
  mostrarRotacion: boolean;
}

export const CONFIGURACION_DEFAULT: ConfiguracionEstadisticas = {
  mostrarStockTotal: true,
  mostrarStockCritico: true,
  mostrarGanancias: true,
  mostrarProductoMasRentable: true,
  mostrarMetricasRendimiento: true,
  mostrarMetricasFinancieras: true,
  mostrarAnalisisInventario: true,
  mostrarGraficoVentas: true,
  mostrarTicketPromedio: true,
  mostrarProductosPorVenta: true,
  mostrarHorariosPico: true,
  mostrarDiasActivos: true,
  mostrarMargenPromedio: true,
  mostrarFlujoCaja: true,
  mostrarProyeccion: true,
  mostrarValorTotal: true,
  mostrarRotacion: true,
}; 