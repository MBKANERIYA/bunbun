import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from "./Component/Header";
import Footer from './Component/Footer';
import CartSidebar from './Component/CartSidebar';
import { CartProvider } from './Component/CartContext';
import { WishlistProvider } from './Component/WishlistContext';
import ChatbotWidget from './Component/ChatbotWidget';

// Lazy loaded page components
const HomePage = lazy(() => import("./Pages/HomePage"));
const CollectionPage = lazy(() => import('./Pages/CollectionPage'));
const Cart = lazy(() => import('./Component/Cart'));
const Wishlist = lazy(() => import('./Pages/Wishlist'));
const ProductDetails = lazy(() => import('./Pages/ProductDetails'));
const About = lazy(() => import('./Pages/About'));
const AddressForm = lazy(() => import('./Pages/Address'));
const Contact = lazy(() => import('./Pages/Contact'));
const PrivacyPolicy = lazy(() => import('./Pages/PrivacyPolicy'));
const ReturnPolicy = lazy(() => import('./Pages/ReturnPolicy'));
const ShippingPolicy = lazy(() => import('./Pages/ShippingPolicy'));
const Blog = lazy(() => import('./Pages/Blog'));
const BlogDetails = lazy(() => import('./Pages/BlogDetails'));
const TermAndCondition = lazy(() => import('./Pages/TermAndCondition'));
const BunbunClothingGold = lazy(() => import('./Pages/BunbunClothingGold'));
const EditProfile = lazy(() => import('./Pages/EditProfile'));
const AdminPanel = lazy(() => import('./Pages/AdminPanel'));
const MyOrders = lazy(() => import('./Pages/MyOrders'));

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
      {!isAdmin && <ChatbotWidget />}
      
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#64748b' }}>Loading...</div>}>
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
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/contact" element={<Contact />} />

          {/* ── Policy Pages ── */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/terms-and-conditions" element={<TermAndCondition />} />

          {/* ── Brand Pages ── */}
          <Route path="/bunbun-clothing-gold" element={<BunbunClothingGold />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/my-orders" element={<MyOrders />} />

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
      </Suspense>

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
