import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CartDrawer } from "../components/CartDrawer";

export function MainLayout() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
