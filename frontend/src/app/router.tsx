import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/modules/layout/ui/layouts/MainLayout";
import { HomePage } from "@/modules/catalog/ui/pages/HomePage";
import { CatalogPage } from "@/modules/catalog/ui/pages/CatalogPage";
import { ProductDetailPage } from "@/modules/catalog/ui/pages/ProductDetailPage";
import { CheckoutPage } from "@/modules/checkout/ui/pages/CheckoutPage";
import { CheckoutSuccessPage } from "@/modules/checkout/ui/pages/CheckoutSuccessPage";
import { LoginPage } from "@/modules/auth/ui/pages/LoginPage";
import { MyOrdersPage } from "@/modules/orders/ui/pages/MyOrdersPage";
import { OrderDetailPage } from "@/modules/orders/ui/pages/OrderDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "catalog",
        element: <CatalogPage />,
      },
      {
        path: "catalog/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "checkout/success",
        element: <CheckoutSuccessPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "orders",
        element: <MyOrdersPage />,
      },
      {
        path: "orders/:id",
        element: <OrderDetailPage />,
      },
    ],
  },
]);
