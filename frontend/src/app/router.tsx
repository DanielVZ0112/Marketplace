import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/modules/layout/ui/layouts/MainLayout";
import { SkeletonLoader } from "@/shared/ui/components/SkeletonLoader";

const HomePage = lazy(() => import("@/modules/catalog/ui/pages/HomePage").then(module => ({ default: module.HomePage })));
const CatalogPage = lazy(() => import("@/modules/catalog/ui/pages/CatalogPage").then(module => ({ default: module.CatalogPage })));
const ProductDetailPage = lazy(() => import("@/modules/catalog/ui/pages/ProductDetailPage").then(module => ({ default: module.ProductDetailPage })));
const CheckoutPage = lazy(() => import("@/modules/checkout/ui/pages/CheckoutPage").then(module => ({ default: module.CheckoutPage })));
const CheckoutSuccessPage = lazy(() => import("@/modules/checkout/ui/pages/CheckoutSuccessPage").then(module => ({ default: module.CheckoutSuccessPage })));
const LoginPage = lazy(() => import("@/modules/auth/ui/pages/LoginPage").then(module => ({ default: module.LoginPage })));
const MyOrdersPage = lazy(() => import("@/modules/orders/ui/pages/MyOrdersPage").then(module => ({ default: module.MyOrdersPage })));
const OrderDetailPage = lazy(() => import("@/modules/orders/ui/pages/OrderDetailPage").then(module => ({ default: module.OrderDetailPage })));

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
]);
