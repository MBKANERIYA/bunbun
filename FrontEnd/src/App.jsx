import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import NadhaagaGold from './Pages/NadhaagaGold';
import EditProfile from './Pages/EditProfile';
import AdminPanel from './Pages/AdminPanel';

// Layout wrapper that hides Header/Footer on /admin
const AppLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <CartSidebar />}
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/:id/:name" element={<ProductDetails />} />
        <Route path="/address" element={<AddressForm />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/ReturnPolicy" element={<ReturnPolicy />} />
        <Route path="/ShippingPolicy" element={<ShippingPolicy />} />
        <Route path="/termAndCondtion" element={<TermAndCondition />} />
        <Route path="/navdhaagaGold" element={<NadhaagaGold />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/admin" element={<AdminPanel />} />
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
