# Estilos de Modales - Productos

Este directorio contiene los estilos modernizados para todos los modales del módulo de productos.

## Modales Modernizados

### 🎨 Diseño Consistente
Todos los modales ahora comparten un diseño moderno y consistente:

- **Overlay**: Fondo semi-transparente (`rgba(0, 0, 0, 0.5)`)
- **Bordes redondeados**: 24px para esquinas principales
- **Sombras**: Efectos de elevación modernos
- **Colores**: Paleta consistente y profesional
- **Tipografía**: Jerarquía clara y legible

## Modales Incluidos

### 1. **MenuOpciones.styles.tsx**
Modal de opciones del producto con:
- Menú deslizable desde abajo
- Opciones con iconos y texto
- Botones de acción modernos
- Animaciones suaves

**Características:**
- Header con título destacado
- Lista de opciones con separadores
- Botones con efectos de hover
- Diseño responsivo

### 2. **ModalComponentes.styles.tsx**
Modal para gestionar componentes del producto:
- Lista de materiales disponibles
- Selección múltiple con checkboxes
- Inputs modernos para agregar componentes
- Botones de acción con sombras

**Características:**
- Grid de materiales seleccionables
- Inputs con bordes y sombras
- Botones con efectos de elevación
- Estados visuales claros

### 3. **ModalVariantes.styles.tsx**
Modal para gestionar variantes del producto:
- Lista de variantes existentes
- Formulario para agregar nuevas variantes
- Botones de edición y eliminación
- Diseño de cards moderno

**Características:**
- Cards con sombras sutiles
- Inputs con diseño moderno
- Botones de acción destacados
- Estados vacíos informativos

### 4. **ModalQR.styles.tsx**
Modal para mostrar códigos QR de productos:
- Contenedor centrado para QR
- Información del producto
- Botones de acción principales y secundarios
- Diseño limpio y profesional

**Características:**
- QR box con fondo y sombras
- Información del producto destacada
- Botones con colores distintivos
- Layout centrado y equilibrado

## Paleta de Colores

### Colores Principales
- **Primary**: `#3b82f6` (Azul)
- **Background**: `#ffffff` (Blanco)
- **Surface**: `#f8fafc` (Gris muy claro)
- **Text**: `#1e293b` (Gris oscuro)

### Colores Secundarios
- **Secondary Text**: `#64748b` (Gris medio)
- **Placeholder**: `#94a3b8` (Gris claro)
- **Border**: `#e2e8f0` (Gris muy claro)
- **Success**: `#10b981` (Verde)

### Estados
- **Disabled**: `#cbd5e1` (Gris)
- **Selected**: `#eff6ff` (Azul claro)
- **Error**: `#ef4444` (Rojo)

## Tipografía

### Títulos
- **Tamaño**: 20px (RFValue)
- **Peso**: 800 (Extra Bold)
- **Color**: `#1e293b`
- **Letter Spacing**: -0.5

### Subtítulos
- **Tamaño**: 16px (RFValue)
- **Peso**: 700 (Bold)
- **Color**: `#334155`

### Texto Regular
- **Tamaño**: 15px (RFValue)
- **Peso**: 600 (Semi Bold)
- **Color**: `#1e293b`

### Texto Secundario
- **Tamaño**: 13-14px (RFValue)
- **Peso**: 500 (Medium)
- **Color**: `#64748b`

## Efectos Visuales

### Sombras
- **Cards**: `shadowRadius: 8-12px`
- **Botones**: `shadowRadius: 8px`
- **Modales**: `shadowRadius: 24px`
- **Elevación**: 2-16 (Android)

### Bordes
- **Radius Principal**: 16px
- **Radius Secundario**: 12px
- **Radius Botones**: 16px
- **Border Width**: 1px

### Espaciado
- **Padding Principal**: 24px
- **Padding Secundario**: 16px
- **Gap entre elementos**: 12-16px
- **Margin entre secciones**: 20-24px

## Responsive Design

Todos los modales son completamente responsivos:
- Uso de `RFValue` para tipografía escalable
- `heightPercentageToDP` y `widthPercentageToDP` para dimensiones
- Diseño adaptativo para diferentes tamaños de pantalla
- Espaciado proporcional

## Mejoras Implementadas

### ✅ Diseño Moderno
- Bordes redondeados consistentes
- Sombras y efectos de elevación
- Paleta de colores profesional
- Tipografía mejorada

### ✅ Experiencia de Usuario
- Estados visuales claros
- Feedback visual inmediato
- Controles intuitivos
- Animaciones suaves

### ✅ Consistencia
- Estilos unificados entre modales
- Colores y tipografía consistentes
- Espaciado y layout uniformes
- Patrones de diseño reutilizables

### ✅ Accesibilidad
- Contraste adecuado
- Tamaños de texto legibles
- Estados interactivos claros
- Navegación intuitiva 