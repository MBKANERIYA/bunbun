import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from "./Component/Header";
import HomePage from "./Pages/HomePage";
import Footer from './Component/Footer';
import CollectionPage from './Pages/CollectionPage';
import Cart from './Component/Cart';
import CartSidebar from './Component/CartSidebar';
import { CartProvider } from './Component/CartContext';
import Wishlist from './Pages/Wishlist';
import { WishlistProvider } from './Component/WishlistContext';
import ProductDetails from './Pages/ProductDetails';
import About from './Pages/About';
import AddressForm from './Pages/Address';
import Contact from './Pages/Contact';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import ReturnPolicy from './Pages/ReturnPolicy';
import ShippingPolicy from './Pages/ShippingPolicy';
import Blog from './Pages/Blog';
import TermAndCondition from './Pages/TermAndCondition';
import BunbunClothingGold from './Pages/BunbunClothingGold';
import EditProfile from './Pages/EditProfile';
import AdminPanel from './Pages/AdminPanel';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout wrapper that hides Header/Footer on /admin
const AppLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <CartSidebar />}
      {!isAdmin && <Header />}
      <Routes>
        {/* ── Main Pages ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<CollectionPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/checkout/address" element={<AddressForm />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />

        {/* ── Policy Pages ── */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/terms-and-conditions" element={<TermAndCondition />} />

        {/* ── Brand Pages ── */}
        <Route path="/bunbun-clothing-gold" element={<BunbunClothingGold />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* ── Admin ── */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* ── Legacy Route Redirects (301-style for SEO) ── */}
        <Route path="/collection" element={<Navigate to="/collections" replace />} />
        <Route path="/PrivacyPolicy" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/privacyPolicy" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/ReturnPolicy" element={<Navigate to="/return-policy" replace />} />
        <Route path="/returnPolicy" element={<Navigate to="/return-policy" replace />} />
        <Route path="/ShippingPolicy" element={<Navigate to="/shipping-policy" replace />} />
        <Route path="/shippingPolicy" element={<Navigate to="/shipping-policy" replace />} />
        <Route path="/termAndCondtion" element={<Navigate to="/terms-and-conditions" replace />} />
        <Route path="/bunbunclothingGold" element={<Navigate to="/bunbun-clothing-gold" replace />} />
        <Route path="/editProfile" element={<Navigate to="/edit-profile" replace />} />
        <Route path="/address" element={<Navigate to="/checkout/address" replace />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <AppLayout />
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
