# Módulo de Nueva Venta

Este módulo maneja la funcionalidad de creación de ventas con un diseño moderno y funcionalidad mejorada.

## Características Principales

### 🎨 Diseño Moderno
- **Header elegante** con gradiente oscuro y sombras
- **Cards modernas** con bordes redondeados y efectos de elevación
- **Colores consistentes** con la paleta de la aplicación
- **Tipografía mejorada** con mejor jerarquía visual

### 📱 Scanner Funcional
- **Scanner integrado** basado en el scanner de productos
- **Escaneo múltiple** permite agregar varios productos sin cerrar
- **Modal de cantidad** para especificar cantidad de cada producto
- **Lista de productos escaneados** en tiempo real
- **Toast notifications** para confirmar acciones

### 🔧 Funcionalidades Mejoradas

#### Scanner Modal
- Escaneo de códigos EAN13
- Animaciones de confirmación
- Modal de cantidad con controles +/-
- Lista de productos escaneados
- Soporte para productos no registrados
- Toast notifications

#### Productos Disponibles
- Grid de 2 columnas para mejor visualización
- Iconos para indicar variantes vs stock
- Botón de agregar en cada producto
- Estados vacíos informativos

#### Productos Seleccionados
- Lista de productos con controles de cantidad
- Totales destacados (Total y Ganancia)
- Botones de acción modernos
- Estados vacíos con iconos

#### Acciones de Venta
- Botones con texto e iconos
- Estados deshabilitados
- Efectos de sombra y elevación
- Colores distintivos para cada acción

## Estructura de Componentes

```
app/nueva-venta/
├── main.tsx                    # Vista principal modernizada
├── components/
│   ├── scannerModal.tsx        # Scanner funcional para ventas
│   ├── productosDisponibles.tsx # Grid de productos disponibles
│   ├── productosSeleccionados.tsx # Lista de productos seleccionados
│   ├── accionesVenta.tsx       # Botones de acción
│   ├── modalCantidad.tsx       # Modal para especificar cantidad
│   ├── modalQRPago.tsx         # Modal de QR de pago
│   ├── modalTransferencia.tsx  # Modal de transferencia
│   └── modalVariante.tsx       # Modal de selección de variantes
└── hooks/                      # Hooks personalizados
```

## Mejoras Implementadas

### 1. Scanner Funcional
- ✅ Scanner que permite múltiples escaneos
- ✅ Modal de cantidad integrado
- ✅ Lista de productos escaneados
- ✅ Toast notifications
- ✅ Mismo estilo que el scanner de productos

### 2. Interfaz Moderna
- ✅ Header con diseño moderno
- ✅ Cards con sombras y bordes redondeados
- ✅ Colores consistentes y profesionales
- ✅ Tipografía mejorada
- ✅ Estados vacíos informativos

### 3. Experiencia de Usuario
- ✅ Animaciones suaves
- ✅ Feedback visual inmediato
- ✅ Controles intuitivos
- ✅ Estados de carga mejorados
- ✅ Mensajes informativos

## Uso del Scanner

```typescript
// Abrir scanner
setScannerVisible(true);

// El scanner maneja automáticamente:
// - Escaneo de códigos
// - Búsqueda de productos
// - Modal de cantidad
// - Agregado a la lista
// - Toast notifications
```

## Colores Utilizados

- **Primary**: `#3b82f6` (Azul)
- **Success**: `#10b981` (Verde)
- **Background**: `#f8fafc` (Gris claro)
- **Cards**: `#ffffff` (Blanco)
- **Text**: `#1e293b` (Gris oscuro)
- **Border**: `#e2e8f0` (Gris medio)

## Responsive Design

- Diseño adaptativo para diferentes tamaños de pantalla
- Grid responsivo para productos
- Espaciado consistente
- Tipografía escalable 