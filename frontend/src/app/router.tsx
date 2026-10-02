import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/modules/layout/ui/layouts/MainLayout";
import { ErpLayout } from "@/modules/erp/ui/layout/ErpLayout";
import { SkeletonLoader } from "@/shared/ui/components/SkeletonLoader";

const HomePage = lazy(() => import("@/modules/catalog/ui/pages/HomePage").then(module => ({ default: module.HomePage })));
const CatalogPage = lazy(() => import("@/modules/catalog/ui/pages/CatalogPage").then(module => ({ default: module.CatalogPage })));
const ProductDetailPage = lazy(() => import("@/modules/catalog/ui/pages/ProductDetailPage").then(module => ({ default: module.ProductDetailPage })));
const CheckoutPage = lazy(() => import("@/modules/checkout/ui/pages/CheckoutPage").then(module => ({ default: module.CheckoutPage })));
const CheckoutSuccessPage = lazy(() => import("@/modules/checkout/ui/pages/CheckoutSuccessPage").then(module => ({ default: module.CheckoutSuccessPage })));
const LoginPage = lazy(() => import("@/modules/auth/ui/pages/LoginPage").then(module => ({ default: module.LoginPage })));
const MyOrdersPage = lazy(() => import("@/modules/orders/ui/pages/MyOrdersPage").then(module => ({ default: module.MyOrdersPage })));
const OrderDetailPage = lazy(() => import("@/modules/orders/ui/pages/OrderDetailPage").then(module => ({ default: module.OrderDetailPage })));
const ErpDashboardPage = lazy(() => import("@/modules/erp/ui/pages/ErpDashboardPage").then(module => ({ default: module.ErpDashboardPage })));
const ErpCotizadorPage = lazy(() => import("@/modules/erp/ui/pages/ErpCotizadorPage").then(module => ({ default: module.ErpCotizadorPage })));
const ErpCotizacionesListPage = lazy(() => import("@/modules/erp/ui/pages/ErpCotizacionesListPage").then(module => ({ default: module.ErpCotizacionesListPage })));
const ErpCotizacionDetailPage = lazy(() => import("@/modules/erp/ui/pages/ErpCotizacionDetailPage").then(module => ({ default: module.ErpCotizacionDetailPage })));
const ErpInsumosPage = lazy(() => import("@/modules/erp/ui/pages/ErpInsumosPage").then(module => ({ default: module.ErpInsumosPage })));
const ErpParametrosPage = lazy(() => import("@/modules/erp/ui/pages/ErpParametrosPage").then(module => ({ default: module.ErpParametrosPage })));

const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<SkeletonLoader count={1} variant="page" />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyRoute>
            <HomePage />
          </LazyRoute>
        ),
      },
      {
        path: "catalog",
        element: (
          <LazyRoute>
            <CatalogPage />
          </LazyRoute>
        ),
      },
      {
        path: "catalog/:id",
        element: (
          <LazyRoute>
            <ProductDetailPage />
          </LazyRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <LazyRoute>
            <CheckoutPage />
          </LazyRoute>
        ),
      },
      {
        path: "checkout/success",
        element: (
          <LazyRoute>
            <CheckoutSuccessPage />
          </LazyRoute>
        ),
      },
      {
        path: "login",
        element: (
          <LazyRoute>
            <LoginPage />
          </LazyRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <LazyRoute>
            <MyOrdersPage />
          </LazyRoute>
        ),
      },
      {
        path: "orders/:id",
        element: (
          <LazyRoute>
            <OrderDetailPage />
          </LazyRoute>
        ),
      },
    ],
  },
  {
    path: "/erp",
    element: <ErpLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyRoute>
            <ErpDashboardPage />
          </LazyRoute>
        ),
      },
      {
        path: "cotizador",
        element: (
          <LazyRoute>
            <ErpCotizadorPage />
          </LazyRoute>
        ),
      },
      {
        path: "cotizador/:id",
        element: (
          <LazyRoute>
            <ErpCotizadorPage />
          </LazyRoute>
        ),
      },
      {
        path: "cotizaciones",
        element: (
          <LazyRoute>
            <ErpCotizacionesListPage />
          </LazyRoute>
        ),
      },
      {
        path: "cotizaciones/:id",
        element: (
          <LazyRoute>
            <ErpCotizacionDetailPage />
          </LazyRoute>
        ),
      },
      {
        path: "insumos",
        element: (
          <LazyRoute>
            <ErpInsumosPage />
          </LazyRoute>
        ),
      },
      {
        path: "parametros",
        element: (
          <LazyRoute>
            <ErpParametrosPage />
          </LazyRoute>
        ),
      },
    ],
  },
]);
