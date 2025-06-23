# Módulo de Estadísticas

Este módulo proporciona un dashboard completo de estadísticas para la aplicación de ventas, con funcionalidades avanzadas de análisis y configuración personalizable.

## Características Principales

### 📊 Dashboard de Estadísticas
- **Estadísticas Básicas**: Stock total, stock crítico, ganancias y producto más rentable
- **Métricas de Rendimiento**: Ticket promedio, productos por venta, horarios pico y días activos
- **Métricas Financieras**: Margen promedio, flujo de caja y proyecciones
- **Análisis de Inventario**: Valor total y rotación de productos
- **Gráfico de Ventas**: Visualización de ventas mensuales

### ⚙️ Configuración Personalizable
- **Modal de Configuración**: Interfaz moderna con selectores de encendido/apagado
- **Almacenamiento Local**: Las configuraciones se guardan automáticamente usando SecureStore
- **Configuración por Defecto**: Opción para restablecer a valores predeterminados
- **17 Opciones Configurables**: Control granular sobre cada elemento del dashboard

## Componentes

### Componentes Principales
- `EstadisticasView` - Componente principal del dashboard
- `ModalConfiguracion` - Modal para configurar elementos visibles
- `EstadisticasCard` - Tarjetas de estadísticas individuales

### Componentes de Métricas
- `MetricasRendimiento` - Métricas de rendimiento de ventas
- `MetricasFinancieras` - Análisis financiero
- `AnalisisInventario` - Análisis de inventario
- `GraficoVentas` - Gráfico de ventas mensuales

### Componentes de Interacción
- `ModalStockCritico` - Modal para productos con stock crítico
- `SelectorGanancias` - Selector de período de ganancias

## Hooks

### Hooks de Datos
- `useEstadisticas` - Estadísticas generales
- `useGanancias` - Gestión de ganancias por período
- `useVentasMensuales` - Datos de ventas mensuales
- `useProductosCriticos` - Productos con stock bajo
- `useMetricasAvanzadas` - Métricas avanzadas de análisis

### Hooks de Configuración
- `useConfiguracionEstadisticas` - Gestión de configuración personalizable

## Configuración Disponible

### Estadísticas Básicas
- `mostrarStockTotal` - Stock total de productos
- `mostrarStockCritico` - Productos con stock crítico
- `mostrarGanancias` - Ganancias por período
- `mostrarProductoMasRentable` - Producto más rentable

### Métricas de Rendimiento
- `mostrarTicketPromedio` - Valor promedio por venta
- `mostrarProductosPorVenta` - Cantidad promedio de productos
- `mostrarHorariosPico` - Horarios de mayor actividad
- `mostrarDiasActivos` - Días con mayor ventas

### Métricas Financieras
- `mostrarMargenPromedio` - Margen de ganancia promedio
- `mostrarFlujoCaja` - Entradas y salidas de caja
- `mostrarProyeccion` - Proyecciones futuras

### Análisis de Inventario
- `mostrarValorTotal` - Valor total del inventario
- `mostrarRotacion` - Rotación de inventario

### Elementos Generales
- `mostrarMetricasRendimiento` - Sección completa de rendimiento
- `mostrarMetricasFinancieras` - Sección completa financiera
- `mostrarAnalisisInventario` - Sección completa de inventario
- `mostrarGraficoVentas` - Gráfico de ventas mensuales

## Uso

### Acceso a la Configuración
1. Abrir la pantalla de Estadísticas
2. Tocar el botón de configuración (ícono de engranaje) en el header
3. Configurar los elementos deseados usando los selectores
4. Los cambios se guardan automáticamente

### Restablecer Configuración
- Usar el botón "Restablecer configuración" en el modal para volver a valores por defecto

## Almacenamiento

La configuración se guarda localmente usando `expo-secure-store` con la clave `estadisticas_configuracion`. Los datos se mantienen entre sesiones y se cargan automáticamente al abrir la aplicación.

## Estructura de Datos

```typescript
interface ConfiguracionEstadisticas {
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
```

## Tecnologías Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desarrollo
- **Expo SecureStore** - Almacenamiento seguro de configuración
- **React Native Chart Kit** - Gráficos de ventas
- **Material Community Icons** - Iconografía
- **TypeScript** - Tipado estático

## Características de UX

- **Interfaz Moderna**: Diseño limpio y profesional
- **Animaciones Suaves**: Transiciones fluidas entre estados
- **Feedback Visual**: Indicadores claros de estado activo/inactivo
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Accesibilidad**: Controles fáciles de usar y entender

## 🚀 **Nuevas Métricas Implementadas**

### **1. Métricas de Rendimiento de Ventas**
- ✅ **Ticket promedio**: Valor promedio por venta
- ✅ **Productos por venta**: Cantidad promedio de productos por transacción
- ✅ **Horarios pico**: Horas con más ventas
- ✅ **Días de la semana más activos**: Análisis de patrones semanales

### **2. Métricas Financieras**
- ✅ **Margen de ganancia promedio**: Porcentaje promedio
- ✅ **Flujo de caja**: Entradas vs salidas del mes
- ✅ **Balance neto**: Diferencia entre entradas y salidas
- ✅ **Proyección de ganancias**: Basada en tendencias
- ✅ **Tendencia de ganancias**: Creciente, decreciente o estable

### **3. Análisis de Inventario**
- ✅ **Valor total del inventario**: En costo y venta
- ✅ **Potencial ganancia**: Diferencia entre valor de venta y costo
- ✅ **Rotación de inventario**: Tiempo promedio de venta
- ✅ **Productos próximos a agotarse**: Stock < 10 unidades
- ✅ **Productos sobrestockeados**: Stock > 50 unidades

### **4. Métricas de Cliente**
- ✅ **Valor del cliente promedio**: Gasto promedio por cliente
- ✅ **Ventas recurrentes**: Análisis de clientes que compran regularmente
- ✅ **Productos más populares**: Análisis de preferencias

## 📁 **Estructura del Módulo**

```
estadisticas/
├── components/                    # Componentes reutilizables
│   ├── EstadisticasCard.tsx      # Tarjetas de métricas
│   ├── GraficoVentas.tsx         # Gráfico de barras
│   ├── ModalStockCritico.tsx     # Modal de productos críticos
│   ├── SelectorGanancias.tsx     # Selector de período
│   ├── MetricasRendimiento.tsx   # 🆕 Métricas de rendimiento
│   ├── MetricasFinancieras.tsx   # 🆕 Métricas financieras
│   └── AnalisisInventario.tsx    # 🆕 Análisis de inventario
├── hooks/                        # Hooks personalizados
│   ├── useEstadisticas.ts        # Hook para estadísticas básicas
│   ├── useGanancias.ts           # Hook para ganancias
│   ├── useVentasMensuales.ts     # Hook para ventas mensuales
│   ├── useProductosCriticos.ts   # Hook para productos críticos
│   └── useMetricasAvanzadas.ts   # 🆕 Hook para métricas avanzadas
├── types/                        # Definiciones de tipos
│   └── index.ts                  # 🆕 Tipos actualizados
├── main.tsx                      # Componente principal
├── page.tsx                      # Página de Expo Router
└── README.md                     # Esta documentación
```

## 🎯 **Componentes Nuevos**

### **MetricasRendimiento**
Muestra métricas clave del rendimiento de ventas:
- Ticket promedio
- Productos por venta
- Hora más activa
- Día más activo

### **MetricasFinancieras**
Presenta análisis financiero completo:
- Margen promedio
- Flujo de caja (entradas/salidas/balance)
- Proyección de ganancias
- Tendencia de ganancias

### **AnalisisInventario**
Visualiza el estado del inventario:
- Valor en costo vs venta
- Potencial ganancia
- Rotación promedio

## 🔧 **Hooks Nuevos**

### **useMetricasAvanzadas**
Hook principal que maneja todas las métricas avanzadas:
- Cálculos complejos de rendimiento
- Análisis financiero
- Gestión de inventario
- Métricas de cliente

## 📊 **Tipos Actualizados**

### **MetricasAvanzadas**
Interfaz completa que incluye:
```typescript
interface MetricasAvanzadas {
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
```

## 🎨 **Características de Diseño**

### **Header Moderno**
- Fondo oscuro con gradiente
- Bordes redondeados en la parte inferior
- Icono decorativo con fondo semitransparente
- Tipografía jerárquica clara

### **Cards de Estadísticas**
- Diseño de 2 columnas responsivo
- Sombras suaves y bordes redondeados
- Iconos con fondos de color semitransparente
- Estados interactivos para elementos presionables

### **Secciones Organizadas**
- **Estadísticas Básicas**: Métricas fundamentales
- **Rendimiento de Ventas**: Análisis de patrones
- **Métricas Financieras**: Análisis económico
- **Análisis de Inventario**: Gestión de stock
- **Gráfico de Ventas**: Visualización temporal

## 🚀 **Mejoras de UX**

1. **Estados de carga**: Indicador visual durante la carga de datos
2. **Animaciones**: Transiciones suaves con Animated API
3. **Feedback táctil**: Estados activos en elementos interactivos
4. **Scroll optimizado**: Indicadores ocultos para mejor experiencia
5. **Responsividad**: Diseño adaptable a diferentes tamaños de pantalla
6. **Accesibilidad**: Contraste adecuado y tamaños de toque apropiados

## 📈 **Beneficios para el Negocio**

### **Toma de Decisiones Informada**
- Identificar productos más rentables
- Optimizar precios basado en márgenes
- Gestionar inventario eficientemente
- Planificar compras y ventas

### **Análisis de Rendimiento**
- Detectar patrones de venta
- Identificar horarios y días pico
- Optimizar horarios de atención
- Mejorar la experiencia del cliente

### **Gestión Financiera**
- Control de flujo de caja
- Proyecciones de ganancias
- Análisis de rentabilidad
- Identificación de oportunidades

## 🔗 **Integración**

El módulo se integra perfectamente con:
- **Expo Router**: Navegación automática
- **Base de datos SQLite**: Consultas optimizadas
- **React Native Chart Kit**: Gráficos profesionales
- **Material Community Icons**: Iconografía consistente

## 🎯 **Próximas Mejoras**

- [ ] Análisis de tendencias más detallado
- [ ] Comparativas año a año
- [ ] Alertas automáticas de stock crítico
- [ ] Exportación de reportes
- [ ] Dashboard personalizable
- [ ] Métricas en tiempo real

¡El módulo de estadísticas ahora te proporciona una visión completa y profesional de tu negocio! 📊✨ 