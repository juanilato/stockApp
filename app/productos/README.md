# Módulo de Productos

Este módulo maneja toda la funcionalidad relacionada con productos en la aplicación.

## Estructura de Carpetas

```
app/productos/
├── components/          # Componentes reutilizables
├── functions/           # Funciones y utilidades
│   ├── index.ts         # Exportaciones centralizadas
│   ├── productoUtils.ts # Utilidades para productos
│   └── productoHandlers.ts # Manejadores de eventos
├── pages/              # Páginas principales
│   └── main.tsx        # Vista principal de productos
├── styles/             # Estilos del módulo
│   └── styles.tsx      # Estilos modernos y responsivos
└── README.md           # Este archivo
```

## Funciones Organizadas

### `functions/productoUtils.ts`
Contiene utilidades puras para productos:
- `generarEAN13()`: Genera códigos EAN13 válidos
- `calcularDigitoControlEAN13()`: Calcula dígito de control
- `generarCodigoBarrasPayload()`: Genera payload para códigos de barras
- `buscarProductoPorCodigo()`: Busca productos por código

### `functions/productoHandlers.ts`
Contiene manejadores de eventos:
- `manejarGuardarProducto()`: Maneja guardado de productos
- `manejarEliminarProducto()`: Maneja eliminación de productos
- `ToastType`: Tipo para notificaciones toast

## Características Modernas

### Estilos Actualizados
- Header con diseño moderno y sombras
- Cards de productos con bordes redondeados
- Botones con efectos de sombra
- Colores consistentes y profesionales
- Diseño responsivo

### Sistema de Toast
- Notificaciones consistentes en toda la app
- Funciona tanto en la vista principal como en el scanner
- Tipos: success, error, warning

### Organización del Código
- Funciones separadas por responsabilidad
- Importaciones centralizadas
- Código más mantenible y escalable
- Mejor separación de concerns

## Uso

```typescript
// Importar funciones
import { 
  manejarGuardarProducto, 
  generarEAN13,
  ToastType 
} from '../functions';

// Usar en componentes
const handleSave = async (producto: Producto, esNuevo: boolean) => {
  await manejarGuardarProducto(producto, esNuevo, cargarProductos, setToast);
};
``` 