# 📦 Módulo de Materiales

Módulo modernizado y modularizado para la gestión de materiales en la aplicación de ventas.

## 🏗️ Estructura del Módulo

```
materiales/
├── main.tsx                 # Vista principal del módulo
├── components/              # Componentes reutilizables
│   ├── MaterialItem.tsx     # Componente para mostrar cada material
│   └── ModalMaterial.tsx    # Modal para agregar/editar materiales
├── hooks/                   # Hooks personalizados
│   ├── useMateriales.ts     # Hook para manejar la lista de materiales
│   ├── useModalMaterial.ts  # Hook para manejar el modal de materiales
│   └── useAnimaciones.ts    # Hook para animaciones y toast
└── README.md               # Documentación del módulo
```

## 🎨 Características de Diseño

### Header Moderno
- **Fondo oscuro** con gradiente y bordes redondeados
- **Iconografía** con iconos de Material Design
- **Tipografía** moderna con pesos variables
- **Efectos visuales** con sombras y transparencias

### Lista de Materiales
- **Cards modernas** con sombras suaves
- **Información organizada** en secciones claras
- **Indicadores visuales** para stock bajo
- **Animaciones fluidas** en las transiciones

### Botón Flotante (FAB)
- **Posición fija** en la esquina inferior derecha
- **Color distintivo** (#f59e0b - naranja)
- **Sombras profundas** para efecto de elevación
- **Animaciones** al presionar

### Modal de Material
- **Diseño limpio** con bordes redondeados
- **Campos organizados** con labels descriptivos
- **Validación visual** de campos obligatorios
- **Animaciones de entrada/salida**

## 🔧 Funcionalidades

### Gestión de Materiales
- ✅ **Agregar materiales** con información completa
- ✅ **Editar materiales** existentes
- ✅ **Eliminar materiales** con confirmación
- ✅ **Visualizar stock** con alertas de bajo inventario

### Interacciones
- ✅ **Swipe actions** para editar y eliminar
- ✅ **Animaciones fluidas** en todas las acciones
- ✅ **Toast notifications** para feedback
- ✅ **Estados de carga** y error

### Validaciones
- ✅ **Campos obligatorios** validados
- ✅ **Formato numérico** para precios y stock
- ✅ **Confirmaciones** para acciones destructivas

## 🎯 Componentes Principales

### MaterialItem
```tsx
interface MaterialItemProps {
  material: Material;
}
```

**Características:**
- Muestra nombre, precio, unidad y stock
- Indicador visual para stock bajo (≤10)
- Diseño de card con sombras y bordes redondeados

### ModalMaterial
```tsx
interface ModalMaterialProps {
  visible: boolean;
  material: Material | null;
  onClose: () => void;
  onSubmit: (nombre, precioCosto, unidad, stock) => Promise<Result>;
}
```

**Características:**
- Modal con animaciones de slide
- Manejo de estado interno para formularios
- Validación de campos en tiempo real
- Estados de carga durante guardado

## 🪝 Hooks Personalizados

### useMateriales
```tsx
const { materiales, cargarMateriales } = useMateriales();
```

**Funcionalidades:**
- Estado de la lista de materiales
- Función para recargar datos
- Manejo de errores de carga

### useModalMaterial
```tsx
const { 
  modalVisible, 
  materialSeleccionado, 
  abrirModal, 
  cerrarModal, 
  guardarMaterial,
  eliminarMaterial 
} = useModalMaterial(cargarMateriales);
```

**Funcionalidades:**
- Control del estado del modal
- Operaciones CRUD para materiales
- Confirmaciones de eliminación
- Manejo de errores

### useAnimaciones
```tsx
const { 
  toast, 
  setToast, 
  mostrarToast 
} = useAnimaciones();
```

**Funcionalidades:**
- Sistema de notificaciones toast
- Estados de animación para acciones
- Feedback visual para el usuario

## 🎨 Paleta de Colores

```css
/* Colores principales */
--primary: #3b82f6;        /* Azul para acciones principales */
--success: #10b981;        /* Verde para éxito */
--warning: #f59e0b;        /* Naranja para advertencias */
--danger: #ef4444;         /* Rojo para errores */

/* Colores de fondo */
--bg-primary: #f8fafc;     /* Fondo principal */
--bg-header: #1e293b;      /* Fondo del header */
--bg-card: #ffffff;        /* Fondo de cards */

/* Colores de texto */
--text-primary: #1e293b;   /* Texto principal */
--text-secondary: #64748b; /* Texto secundario */
--text-muted: #94a3b8;     /* Texto atenuado */
```

## 🚀 Beneficios del Diseño

### Para el Usuario
- **Interfaz intuitiva** con navegación clara
- **Feedback visual** inmediato en todas las acciones
- **Acceso rápido** a funciones principales
- **Experiencia fluida** con animaciones suaves

### Para el Desarrollador
- **Código modular** y fácil de mantener
- **Hooks reutilizables** para lógica de negocio
- **Componentes independientes** y testeables
- **Tipado fuerte** con TypeScript

### Para el Negocio
- **Gestión eficiente** del inventario de materiales
- **Control de costos** con precios actualizados
- **Alertas preventivas** para stock bajo
- **Escalabilidad** para futuras funcionalidades

## 🔄 Integración

El módulo se integra perfectamente con:
- **Sistema de base de datos** existente
- **Componentes globales** (CustomToast, etc.)
- **Sistema de navegación** principal
- **Tema y estilos** globales de la aplicación

## 📱 Responsive Design

- **Adaptable** a diferentes tamaños de pantalla
- **Optimizado** para dispositivos móviles
- **Accesible** con tamaños de toque apropiados
- **Consistente** con el resto de la aplicación 