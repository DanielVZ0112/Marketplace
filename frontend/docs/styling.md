# 🎨 Sistema de Estilización

## Visión General

El proyecto utiliza **SCSS Modules** con un sistema de tokens de diseño centralizado para mantener consistencia y facilitar el mantenimiento.

## 📁 Estructura de Estilos

```
shared/styles/
├── _tokens.scss        # Tokens de diseño (colores, espaciado, etc.)
├── _typography.scss    # Tipografía y fuentes
└── main.scss          # Estilos globales y imports
```

## 🎨 Tokens de Diseño

### Colores

**Archivo:** `shared/styles/_tokens.scss`

```scss
// Colores Base
$color-black: #0F0F0F;
$color-white: #FFFFFF;
$color-surface: #F5F5F5;
$color-border: #E5E7EB;
$color-text-secondary: #6B7280;

// Colores Acento
$color-primary: #2563EB;

// Estados
$color-error: #DC2626;
$color-success: #16A34A;
$color-warning: #F59E0B;
```

### Espaciado

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;
$spacing-3xl: 64px;
```

### Border Radius

```scss
$radius-sm: 10px;
$radius-md: 12px;
$radius-lg: 16px;
```

### Sombras

```scss
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
$shadow-md: 0 2px 4px rgba(0, 0, 0, 0.06);
$shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.08);
$shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.1);
```

### Transiciones

```scss
$transition-fast: 150ms ease;
$transition-base: 200ms ease;
$transition-slow: 300ms ease;
```

### Breakpoints

```scss
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

## 📝 Tipografía

**Archivo:** `shared/styles/_typography.scss`

### Fuente

```scss
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

$font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Tamaños

```scss
$font-size-h1: 32px;
$font-size-h2: 24px;
$font-size-h3: 20px;
$font-size-body: 14px;
$font-size-label: 12px;
```

### Pesos

```scss
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

## 🎯 SCSS Modules

### Uso

Cada componente tiene su archivo `.module.scss`:

```tsx
// ProductCard.tsx
import styles from "./product-card.module.scss";

<div className={styles.productCard}>
  <div className={styles.productCard__imageWrapper}>
    ...
  </div>
</div>
```

### BEM Naming

Usamos BEM (Block Element Modifier) para nombrar clases:

```scss
// Block
.productCard {
  // Element
  &__imageWrapper { ... }
  &__content { ... }
  
  // Modifier
  &--featured { ... }
}
```

### Importar Tokens

```scss
@use '@/shared/styles/tokens' as *;

.myComponent {
  color: $color-primary;
  padding: $spacing-md;
  border-radius: $radius-md;
}
```

## 🌐 Estilos Globales

**Archivo:** `shared/styles/main.scss`

### Material-UI Overrides

```scss
:global(.MuiButton-root) {
  &.MuiButton-contained {
    background-color: $color-black;
    color: $color-white;
    
    &:hover {
      background-color: $color-text-secondary;
      color: $color-white;
    }
  }
}
```

### Reset y Normalización

- Material-UI CssBaseline
- Estilos base consistentes

## 📱 Responsive Design

### Media Queries

```scss
@media (max-width: $breakpoint-md) {
  .component {
    // Estilos móviles
  }
}
```

### Breakpoints en Material-UI

```tsx
<Box sx={{ 
  display: { xs: 'block', md: 'flex' },
  padding: { xs: 2, md: 4 }
}}>
```

## 🎭 Animaciones

### Transiciones

```scss
.element {
  transition: all $transition-base ease;
  
  &:hover {
    transform: scale(1.02);
  }
}
```

### Keyframes

```scss
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.element {
  animation: pulse 2s infinite;
}
```

## 🎨 Ejemplos de Uso

### Componente con Estilos

```tsx
// Component.tsx
import styles from "./component.module.scss";

export function Component() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Título</h1>
    </div>
  );
}
```

```scss
// component.module.scss
@use '@/shared/styles/tokens' as *;

.container {
  padding: $spacing-lg;
  background: $color-surface;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
}

.title {
  color: $color-black;
  font-size: $font-size-h1;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-md;
}
```

### Estilos Condicionales

```tsx
<div className={`${styles.card} ${isActive ? styles.cardActive : ''}`}>
```

```scss
.card {
  &Active {
    border: 2px solid $color-primary;
  }
}
```

## 🎯 Mejores Prácticas

### 1. Usar Tokens

✅ **Bien:**
```scss
padding: $spacing-md;
color: $color-primary;
```

❌ **Mal:**
```scss
padding: 16px;
color: #2563EB;
```

### 2. BEM Naming

✅ **Bien:**
```scss
.productCard__imageWrapper
.productCard__content
```

❌ **Mal:**
```scss
.productCardImageWrapper
.product-card-content
```

### 3. Scoped Styles

✅ **Bien:**
```scss
// Usar SCSS Modules
.productCard { ... }
```

❌ **Mal:**
```scss
// Estilos globales sin necesidad
:global(.product-card) { ... }
```

### 4. Responsive First

✅ **Bien:**
```scss
.container {
  padding: $spacing-sm;
  
  @media (min-width: $breakpoint-md) {
    padding: $spacing-lg;
  }
}
```

### 5. Performance

- ✅ Usar `transform` y `opacity` para animaciones
- ✅ Evitar `!important` (solo cuando sea necesario)
- ✅ Minimizar selectores anidados

## 🔧 Herramientas

### Vite + SCSS

Vite procesa automáticamente:
- SCSS Modules
- Variables SCSS
- Imports
- Minificación en producción

### TypeScript Support

Los estilos tienen soporte de TypeScript:

```tsx
import styles from "./component.module.scss";

// TypeScript conoce las clases
styles.container // ✅
styles.nonExistent // ❌ Error
```

## 📚 Recursos

- [SCSS Modules Documentation](https://github.com/css-modules/css-modules)
- [BEM Methodology](http://getbem.com/)
- [Material-UI Theming](https://mui.com/material-ui/customization/theming/)
