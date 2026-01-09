import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/modules/layout/ui/layouts/MainLayout";
import { HomePage } from "@/modules/catalog/ui/pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);
