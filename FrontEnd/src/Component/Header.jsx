import React, { useState } from "react";
import { Heart, Search, ShoppingBag, X, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import LoginModal from "./LoginModel";
import UserProfileModal from "./UserProfileModel";

const Header = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { wishlistIds } = useWishlist();
    const wishlistCount = wishlistIds.size;
    const { itemCount } = useCart();
    const navigate = useNavigate();

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    // Add new state for the profile modal
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Mobile menu state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);

    const handleAccountClick = () => {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
            // If user is logged in, open the profile modal
            setIsProfileModalOpen(true);
        } else {
            // If user is not logged in, open the login modal
            setIsLoginModalOpen(true);
        }
    };

    const closeLoginModal = () => setIsLoginModalOpen(false);
    const closeProfileModal = () => setIsProfileModalOpen(false);

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    const handleCategoryClick = (category) => {
        navigate(`/collections?category=${encodeURIComponent(category)}`);
    };

    const openMobileMenu = () => {
        setMobileMenuOpen(true);
        setActiveSubmenu(null);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setActiveSubmenu(null);
    };

    const handleMobileNavClick = (path) => {
        navigate(path);
        closeMobileMenu();
    };

    return (
        <header className="main-header sticky-top">
            <nav className="navbar navbar-expand-lg navbar-light bg-white">
                <div className="container-fluid align-items-center">

                    {showSearch ? (
                        // --- VIEW 1: WHEN SEARCH IS ACTIVE ---
                        <div className="w-100 d-flex align-items-center search-header-active">
                            <Search className="search-bar-icon" />
                            <input
                                type="text"
                                className="form-control form-control-lg border-0 bg-transparent search-bar-input"
                                placeholder="Search our store..."
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="icon-btn close-search-btn" title="Close Search" onClick={toggleSearch}>
                                <X />
                            </button>
                        </div>

                    ) : (
                        // --- VIEW 2: NORMAL HEADER ---
                        <>
                            {/* Logo */}
                            <Link className="navbar-brand" to="/">
                                <img
                                    src="/bunbun_logo.png"
                                    alt="Bunbun Clothing Logo"
                                    className="logo-img"
                                />
                            </Link>

                            {/* Mobile Toggler - custom handler instead of Bootstrap collapse */}
                            <button
                                className="navbar-toggler"
                                type="button"
                                onClick={openMobileMenu}
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            {/* Desktop Navigation Links (hidden on mobile, shown on lg+) */}
                            <div className="collapse navbar-collapse" id="mainNav">
                                <ul className="navbar-nav mx-auto">
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle text-danger" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Shop</a>
                                        <div className="dropdown-menu mega-menu">
                                            <div className="row g-4">

                                                {/* Column 1: Shop by Category */}
                                                <div className="col-md-4">
                                                    <h5>By Category</h5>
                                                    <a className="dropdown-item" onClick={() => handleCategoryClick("Blouse")} style={{ cursor: "pointer" }}>Blouse</a>
                                                    <a className="dropdown-item" onClick={() => handleCategoryClick("Shapewear")} style={{ cursor: "pointer" }}>Shapewear</a>
                                                    <Link className="dropdown-item" to="/collections?category=Essentials">Essentials</Link>
                                                </div>
                                                {/* Column 2: Shop by Collection */}
                                                <div className="col-md-4">
                                                    <h5>By Collection</h5>
                                                    <Link className="dropdown-item" to="/collections">Explore Collections</Link>
                                                    <Link className="dropdown-item" to="/collections?sort=trending">Trending Now</Link>
                                                    <Link className="dropdown-item" to="/collections?sort=bestsellers">Best Sellers</Link>
                                                    <Link className="dropdown-item" to="/collections?category=Heritage">Indian Heritage</Link>
                                                </div>

                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item" ><Link to="/collections?category=Blouse" className="nav-link">Blouse</Link></li>
                                    <li className="nav-item" ><Link to="/collections?category=Shapewear" className="nav-link">Shapewear</Link></li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/about">About Us</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/sale">SALE</Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Action Icons */}
                            <div className="d-flex align-items-center fs-5 header-icons">
                                <button className="icon-btn" title="Search" onClick={toggleSearch}>
                                    <Search />
                                </button>
                                <button className="icon-btn d-none d-lg-block" title="Account" onClick={handleAccountClick}>
                                    <User />
                                </button>
                                <Link to="/wishlist" className="icon-btn" title="Wishlist">
                                    <Heart />

                                    {/* Conditionally render the badge only if count > 0 */}
                                    {wishlistCount > 0 && (
                                        <span className="count-badge">{wishlistCount}</span>
                                    )}
                                </Link>
                                <Link to="/cart" className="icon-btn" title="Shopping Cart">
                                    <ShoppingBag />
                                    {itemCount > 0 && (
                                        <span className="count-badge">{itemCount}</span>
                                    )}
                                </Link>
                            </div>

                        </>
                    )}
                </div>
            </nav>

            {/* ===== MOBILE OVERLAY MENU ===== */}
            <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}></div>
            <div className={`mobile-menu-panel ${mobileMenuOpen ? 'open' : ''}`}>
                {/* Panel Header */}
                <div className="mobile-menu-header">
                    <button className="mobile-menu-close" onClick={closeMobileMenu}>
                        <X />
                    </button>
                    <Link to="/cart" className="mobile-menu-cart" onClick={closeMobileMenu}>
                        <ShoppingBag />
                        {itemCount > 0 && (
                            <span className="count-badge">{itemCount}</span>
                        )}
                    </Link>
                </div>

                {/* Main Menu (slides out when submenu is active) */}
                <div className={`mobile-menu-body ${activeSubmenu ? 'slide-out' : ''}`}>
                    <ul className="mobile-nav-list">
                        <li>
                            <a onClick={() => setActiveSubmenu('shop')}>
                                SHOP
                                <ChevronRight className="mobile-nav-arrow" />
                            </a>
                        </li>
                        <li>
                            <a onClick={() => handleMobileNavClick('/collections?category=Blouse')}>
                                BLOUSE
                            </a>
                        </li>
                        <li>
                            <a onClick={() => handleMobileNavClick('/collections?category=Shapewear')}>
                                SHAPEWEAR
                            </a>
                        </li>
                        <li>
                            <a onClick={() => setActiveSubmenu('collections')}>
                                COLLECTIONS
                                <ChevronRight className="mobile-nav-arrow" />
                            </a>
                        </li>
                        <li>
                            <a onClick={() => handleMobileNavClick('/sale')}>
                                SALE
                            </a>
                        </li>
                        <li>
                            <a onClick={() => handleMobileNavClick('/about')}>
                                ABOUT US
                            </a>
                        </li>
                    </ul>
                    <div className="mt-auto px-4 pb-4 pt-3">
                        <button 
                            className="btn w-100"
                            onClick={() => { handleAccountClick(); closeMobileMenu(); }}
                            style={{ padding: '12px', fontWeight: '600', letterSpacing: '1px', backgroundColor: '#8E44AD', color: '#fff', borderRadius: '6px' }}
                        >
                            {localStorage.getItem('authToken') ? 'PROFILE / LOGOUT' : 'LOGIN / REGISTER'}
                        </button>
                    </div>
                </div>

                {/* Shop Submenu */}
                <div className={`mobile-submenu ${activeSubmenu === 'shop' ? 'slide-in' : ''}`}>
                    <button className="mobile-submenu-back" onClick={() => setActiveSubmenu(null)}>
                        <ChevronLeft />
                        <span>BACK</span>
                    </button>
                    <h4 className="mobile-submenu-title">SHOP</h4>
                    <ul className="mobile-nav-list">
                        <li><a onClick={() => handleMobileNavClick('/collections?category=Blouse')}>Blouse</a></li>
                        <li><a onClick={() => handleMobileNavClick('/collections?category=Shapewear')}>Shapewear</a></li>
                        <li><a onClick={() => handleMobileNavClick('/collections?category=Essentials')}>Essentials</a></li>
                    </ul>
                </div>

                {/* Collections Submenu */}
                <div className={`mobile-submenu ${activeSubmenu === 'collections' ? 'slide-in' : ''}`}>
                    <button className="mobile-submenu-back" onClick={() => setActiveSubmenu(null)}>
                        <ChevronLeft />
                        <span>BACK</span>
                    </button>
                    <h4 className="mobile-submenu-title">COLLECTIONS</h4>
                    <ul className="mobile-nav-list">
                        <li><a onClick={() => handleMobileNavClick('/collections')}>Explore Collections</a></li>
                        <li><a onClick={() => handleMobileNavClick('/collections?sort=trending')}>Trending Now</a></li>
                        <li><a onClick={() => handleMobileNavClick('/collections?sort=bestsellers')}>Best Sellers</a></li>
                        <li><a onClick={() => handleMobileNavClick('/collections?category=Heritage')}>Indian Heritage</a></li>
                    </ul>
                </div>
            </div>

            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
            <UserProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
        </header>
    );
};

export default Header;
