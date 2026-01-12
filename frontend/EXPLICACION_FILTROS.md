# 📚 Explicación: Filtros con Zustand y React Query

## 🎯 Visión General

El sistema de filtros funciona con **3 capas principales** que trabajan juntas:

1. **Zustand Store** → Almacena el estado de los filtros (fuente de verdad)
2. **React Query** → Gestiona el fetching y cache de datos
3. **URL** → Sincroniza los filtros para compartir y recargar páginas

---

## 🔄 Flujo Completo Paso a Paso

### **Paso 1: Usuario cambia un filtro**

```tsx
// En CategoryFilter.tsx
const setCategoryId = useCatalogFilters((s) => s.setCategoryId);

// Usuario selecciona una categoría
onChange={(e) => setCategoryId(Number(e.target.value))}
```

**¿Qué pasa?**
- Se llama a `setCategoryId()` del store de Zustand
- Zustand actualiza el estado global: `categoryId: 5`
- **Automáticamente** todos los componentes que usan `useCatalogFilters` se re-renderizan

---

### **Paso 2: React Query detecta el cambio**

```tsx
// En useGetProducts.ts
const categoryId = useCatalogFilters((s) => s.categoryId); // ← Lee del store

// Memoiza los filtros
const filters = useMemo(() => ({
  search,
  categoryId,  // ← Este valor cambió
  size,
  color,
  // ...
}), [search, categoryId, size, color, ...]);

// React Query usa los filtros como parte de la queryKey
return useQuery({
  queryKey: queryKeys.products.list(filters), // ← Key cambia = nueva query
  queryFn: () => CatalogApiRepository.getProducts(queryParams),
});
```

**¿Qué pasa?**
- React Query compara la `queryKey` anterior con la nueva
- Como `categoryId` cambió, la key es diferente: `["products", "list", { categoryId: 5 }]`
- React Query detecta que necesita hacer una nueva petición
- Cancela la petición anterior si está en curso
- Ejecuta `queryFn` con los nuevos parámetros

---

### **Paso 3: Se hace la petición HTTP**

```tsx
// En CatalogApiRepository.ts
static async getProducts(filters?: ProductFilters) {
  const params = new URLSearchParams();
  
  if (filters?.category_id) 
    params.append("category_id", filters.category_id.toString());
  
  const url = `/products?category_id=5`;
  const { data } = await api.get(url);
  return data.data;
}
```

**¿Qué pasa?**
- Se construye la URL con los parámetros de filtro
- Se hace la petición GET a `/products?category_id=5`
- El backend filtra los productos
- Se retorna la respuesta

---

### **Paso 4: React Query cachea y actualiza**

```tsx
// React Query automáticamente:
// 1. Guarda la respuesta en cache con la queryKey
// 2. Actualiza el componente que usa useGetProducts()
// 3. Muestra loading state mientras carga
```

**¿Qué pasa?**
- React Query guarda: `{ queryKey: ["products", "list", { categoryId: 5 }], data: [...] }`
- Si el usuario vuelve a esta misma combinación de filtros, **no hace petición**, usa cache
- El componente `CatalogPage` recibe los nuevos datos automáticamente

---

### **Paso 5: Sincronización con URL**

```tsx
// En CatalogPage.tsx
useEffect(() => {
  // Cuando cambian los filtros en Zustand...
  const params = toUrlParams(); // Convierte filtros a URL params
  setSearchParams(params, { replace: true }); // Actualiza URL
}, [search, categoryId, size, color, ...]);
```

**¿Qué pasa?**
- El `useEffect` detecta que `categoryId` cambió
- Llama a `toUrlParams()` que convierte el estado de Zustand a URLSearchParams
- Actualiza la URL: `/catalog?category_id=5`
- Ahora puedes compartir el link o recargar la página y mantiene los filtros

---

## 🏗️ Arquitectura: ¿Por qué esta separación?

### **Zustand (Estado Global)**
```tsx
// ✅ Ventajas:
// - Estado persistente entre componentes
// - No necesita props drilling
// - Actualizaciones reactivas automáticas
// - Fácil de testear

const search = useCatalogFilters((s) => s.search); // Lee
const setSearch = useCatalogFilters((s) => s.setSearch); // Escribe
```

**Responsabilidades:**
- Almacenar valores de filtros
- Proporcionar funciones para actualizar
- Sincronizar con URL (bidireccional)

---

### **React Query (Gestión de Datos)**
```tsx
// ✅ Ventajas:
// - Cache automático
// - Loading/error states
// - Refetch automático
// - Invalidación inteligente

const { data, isLoading, error } = useGetProducts();
```

**Responsabilidades:**
- Hacer peticiones HTTP cuando cambian los filtros
- Cachear respuestas
- Gestionar estados de carga/error
- Invalidar cache cuando es necesario

---

### **¿Por qué no poner los filtros en React Query?**

❌ **Mala práctica:**
```tsx
// Esto NO funciona bien porque:
const [categoryId, setCategoryId] = useState(null);
useQuery({
  queryKey: ["products", categoryId],
  // Problema: El estado está en el componente
  // No se puede compartir entre componentes
  // No persiste al navegar
});
```

✅ **Buena práctica (lo que tenemos):**
```tsx
// Zustand: Estado global compartido
const categoryId = useCatalogFilters((s) => s.categoryId);

// React Query: Solo se encarga de fetch
useQuery({
  queryKey: ["products", categoryId], // Lee de Zustand
});
```

---

## 🔍 Ejemplo Práctico Completo

### **Escenario: Usuario busca "camiseta" y filtra por categoría "Ropa"**

#### **1. Usuario escribe en SearchBar:**
```tsx
// SearchBar.tsx
const [localSearch, setLocalSearch] = useState(""); // Estado local
const debouncedSearch = useDebounce(localSearch, 500); // Espera 500ms

useEffect(() => {
  setSearch(debouncedSearch); // ← Actualiza Zustand después de 500ms
}, [debouncedSearch]);
```

**Timeline:**
- `t=0ms`: Usuario escribe "c" → `localSearch = "c"` (no hace nada)
- `t=100ms`: Usuario escribe "ca" → `localSearch = "ca"` (no hace nada)
- `t=500ms`: Debounce termina → `debouncedSearch = "ca"` → Actualiza Zustand
- `t=501ms`: React Query detecta cambio → Nueva petición

**¿Por qué debounce?**
- Evita hacer una petición por cada letra
- Solo busca cuando el usuario deja de escribir

---

#### **2. Usuario selecciona categoría:**
```tsx
// CategoryFilter.tsx
onChange={(e) => setCategoryId(Number(e.target.value))}
// Inmediatamente actualiza Zustand
```

**Timeline:**
- `t=0ms`: Usuario selecciona "Ropa" (id: 5)
- `t=1ms`: Zustand actualiza: `categoryId: 5`
- `t=2ms`: React Query detecta cambio en `queryKey`
- `t=3ms`: Nueva petición: `/products?search=ca&category_id=5`

---

#### **3. React Query hace la petición:**
```tsx
// useGetProducts.ts
queryKey: ["products", "list", { 
  search: "ca", 
  categoryId: 5 
}]
// Esta key es única para esta combinación de filtros
```

**Cache de React Query:**
```javascript
{
  "['products', 'list', { search: 'ca', categoryId: 5 }]": {
    data: [...productos...],
    timestamp: 1234567890,
    staleTime: 30000 // 30 segundos
  }
}
```

**Si el usuario vuelve a esta combinación en menos de 30 segundos:**
- ✅ No hace petición HTTP
- ✅ Usa datos del cache
- ✅ Respuesta instantánea

---

## 🔄 Sincronización URL ↔ Zustand

### **URL → Zustand (Al cargar página o compartir link)**

```tsx
// CatalogPage.tsx - useEffect inicial
useEffect(() => {
  syncWithUrl(searchParams); // Lee URL y actualiza Zustand
}, []);

// filters.store.ts
syncWithUrl: (params) => {
  const categoryId = params.get("category_id");
  set({ categoryId: categoryId ? Number(categoryId) : null });
}
```

**Flujo:**
1. Usuario entra a `/catalog?category_id=5&search=camisa`
2. `syncWithUrl()` lee los parámetros
3. Actualiza Zustand: `{ categoryId: 5, search: "camisa" }`
4. React Query detecta los valores y hace la petición

---

### **Zustand → URL (Cuando cambian los filtros)**

```tsx
// CatalogPage.tsx - useEffect de sincronización
useEffect(() => {
  const params = toUrlParams(); // Convierte Zustand a URL
  setSearchParams(params); // Actualiza URL
}, [search, categoryId, ...]);

// filters.store.ts
toUrlParams: () => {
  const params = new URLSearchParams();
  if (state.categoryId) params.set("category_id", state.categoryId.toString());
  return params;
}
```

**Flujo:**
1. Usuario cambia filtro en UI
2. Zustand se actualiza
3. `useEffect` detecta cambio
4. Convierte estado a URL params
5. Actualiza URL sin recargar página

---

## 🎨 Patrón: Selectores Individuales

### **¿Por qué usamos selectores individuales?**

```tsx
// ✅ BUENO - Selectores individuales
const search = useCatalogFilters((s) => s.search);
const categoryId = useCatalogFilters((s) => s.categoryId);

// ❌ MALO - Selector que crea objeto nuevo
const filters = useCatalogFilters((s) => ({
  search: s.search,
  categoryId: s.categoryId,
}));
```

**Problema del selector "malo":**
- Cada vez que se renderiza, crea un **nuevo objeto**
- React Query piensa que los filtros cambiaron
- Hace peticiones innecesarias
- Puede causar bucles infinitos

**Solución:**
- Usar selectores individuales
- Memoizar el objeto solo cuando cambian los valores

```tsx
const filters = useMemo(() => ({
  search,
  categoryId,
}), [search, categoryId]); // Solo recrea si cambian estos valores
```

---

## 📊 Diagrama de Flujo Visual

```
┌─────────────────┐
│   Usuario UI    │
│  (SearchBar,    │
│  CategoryFilter)│
└────────┬────────┘
         │ onChange
         ▼
┌─────────────────┐
│  Zustand Store  │ ← Estado global
│  - search       │
│  - categoryId   │
│  - size, etc.   │
└────────┬────────┘
         │ useCatalogFilters()
         ▼
┌─────────────────┐
│ useGetProducts  │ ← Hook de React Query
│ (lee de Zustand)│
└────────┬────────┘
         │ queryKey cambia
         ▼
┌─────────────────┐
│ React Query     │ ← Detecta cambio
│ - Cancela query │
│ - Nueva petición│
└────────┬────────┘
         │ HTTP GET
         ▼
┌─────────────────┐
│  Backend API    │
│  /products?     │
│  category_id=5  │
└────────┬────────┘
         │ Response
         ▼
┌─────────────────┐
│ React Query     │ ← Cachea respuesta
│ - Guarda cache  │
│ - Actualiza UI  │
└────────┬────────┘
         │ data
         ▼
┌─────────────────┐
│ CatalogPage     │ ← Muestra productos
│ - ProductGrid   │
└─────────────────┘

         │
         ▼ (en paralelo)
┌─────────────────┐
│ URL Sync         │
│ - toUrlParams()  │
│ - setSearchParams│
└─────────────────┘
```

---

## 🎯 Resumen: Responsabilidades

| Capa | Responsabilidad | Ejemplo |
|------|----------------|---------|
| **Zustand** | Estado de filtros | `categoryId: 5` |
| **React Query** | Fetching y cache | `useGetProducts()` |
| **URL** | Persistencia y compartir | `?category_id=5` |
| **Componentes UI** | Interacción usuario | `SearchBar`, `CategoryFilter` |

---

## 💡 Preguntas Frecuentes

### **¿Por qué no usar solo React Query para los filtros?**
- React Query no persiste entre navegaciones
- No se puede compartir fácilmente (URL)
- El estado estaría acoplado al fetching

### **¿Por qué no usar solo Zustand?**
- Zustand no hace peticiones HTTP
- No tiene cache automático
- No maneja loading/error states

### **¿Cuándo se hace la petición HTTP?**
- Cuando cambia cualquier valor en la `queryKey`
- Cuando el cache expira (staleTime)
- Cuando se invalida manualmente

### **¿Cómo funciona el debounce?**
- El usuario escribe → actualiza estado local
- Después de 500ms sin escribir → actualiza Zustand
- Zustand cambia → React Query hace petición

---

## 🚀 Ventajas de esta Arquitectura

✅ **Separación de responsabilidades**
✅ **Reutilizable** - Los filtros se pueden usar en cualquier componente
✅ **Persistente** - Los filtros se guardan en URL
✅ **Performante** - Cache evita peticiones innecesarias
✅ **Testeable** - Cada capa se puede testear independientemente
✅ **Escalable** - Fácil agregar nuevos filtros
