# 🎨 Especificación Técnica: ERP Fase 2 - Frontend & Cotizador Inteligente

## 📌 Contexto
Se requiere implementar la interfaz de usuario para el módulo ERP en el frontend (`/erp/`), conectándose a los endpoints `/api/erp/*` recién construidos en la Fase 1.
La arquitectura debe seguir la estructura Feature-Based del proyecto (`src/modules/erp/`).

---

## 📁 Estructura de Directorios A Crear

```text
src/modules/erp/
├── domain/
│   ├── ParametrosErp.ts
│   ├── InsumoErp.ts
│   └── CotizacionErp.ts
├── infrastructure/
│   └── ErpApiRepository.ts
├── application/
│   ├── useParametrosErp.ts
│   ├── useInsumosErp.ts
│   └── useCotizacionesErp.ts
└── ui/
    ├── components/
    │   ├── SidebarErp.tsx
    │   ├── StatCard.tsx
    │   └── CotizadorItemForm.tsx
    ├── layout/
    │   └── ErpLayout.tsx
    └── pages/
        ├── ErpDashboardPage.tsx
        ├── ErpInsumosPage.tsx
        ├── ErpCotizadorPage.tsx
        ├── ErpCotizacionesListPage.tsx
        └── ErpCotizacionDetailPage.tsx