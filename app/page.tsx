import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCatalog from "@/components/ProductCatalog";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import ReceiptModal from "@/components/ReceiptModal";
import ToastContainer from "@/components/ToastContainer";

export default function HomePage() {
  return (
    <>
      <ToastContainer />
      <Header />
      <main className="flex flex-col flex-grow">
        <Hero />
        <ProductCatalog />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <CheckoutModal />
      <ReceiptModal />
    </>
  );
}
