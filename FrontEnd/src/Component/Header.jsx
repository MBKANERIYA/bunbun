import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSearch, faShoppingBag, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
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
        navigate(`/collection?category=${encodeURIComponent(category)}`);
    };

    return (
        <header className="main-header sticky-top">
            <nav className="navbar navbar-expand-lg navbar-light bg-white">
                <div className="container-fluid align-items-center">

                    {/* --- THIS IS THE MAIN CHANGE --- */}
                    {/* We now render one of two views based on the 'showSearch' state */}

                    {showSearch ? (
                        // --- VIEW 1: WHEN SEARCH IS ACTIVE ---
                        <div className="w-100 d-flex align-items-center search-header-active">
                            <FontAwesomeIcon icon={faSearch} className="search-bar-icon" />
                            <input
                                type="text"
                                className="form-control form-control-lg border-0 bg-transparent search-bar-input"
                                placeholder="Search our store..."
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="icon-btn close-search-btn" title="Close Search" onClick={toggleSearch}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                    ) : (
                        // --- VIEW 2: NORMAL HEADER (wrapped in a React Fragment) ---
                        <>
                            {/* Logo */}
                            <Link className="navbar-brand" to="/">
                                <img
                                    src="/bunbun_logo.png"
                                    alt="Navdhaaga Logo"
                                    className="logo-img"
                                />
                            </Link>

                            {/* Mobile Toggler */}
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#mainNav"
                                aria-controls="mainNav"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            {/* Navigation Links */}
                            <div className="collapse navbar-collapse" id="mainNav">
                                {/* Your <ul className="navbar-nav">...</ul> remains unchanged here */}
                                <ul className="navbar-nav mx-auto">
                                    <li className="nav-item" ><Link to="collection?category=Saree"className="nav-link">Sarees</Link></li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link text-danger" href="/collection" role="button">Shop</a>
                                        <div className="dropdown-menu mega-menu">
                                            <div className="row g-4">

                                                {/* Column 1: Shop by Category */}
                                                <div className="col-md-4">
                                                    <h5>By Category</h5>
                                                    <a className="dropdown-item" onClick={() => handleCategoryClick("Saree")} style={{ cursor: "pointer" }}>All Sarees</a>
                                                    <Link className="dropdown-item" to="/shop/ready-to-wear">Ready to Wear Sarees</Link>
                                                    <Link className="dropdown-item" to="/shop/essentials">Essentials</Link>
                                                    <Link className="dropdown-item" to="/navdhaagaGold">Navdhaaga Gold</Link>
                                                    <a className="dropdown-item" onClick={() => handleCategoryClick("Blouse")} style={{ cursor: "pointer" }}>Blouses</a>
                                                </div>
                                                {/* Column 2: Shop by Collection */}
                                                <div className="col-md-4">
                                                    <h5>By Collection</h5>
                                                    <Link className="dropdown-item" to="/collections/all">Explore Collections</Link>
                                                    <Link className="dropdown-item" to="/collections/trending">Trending Now</Link>
                                                    <Link className="dropdown-item" to="/collections/bestsellers">Best Sellers</Link>
                                                    <Link className="dropdown-item" to="/collections/heritage">Indian Heritage</Link>
                                                </div>

                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item" ><Link className="nav-link">Ready to Wear Sarees</Link></li>
                                    <li className="nav-item" ><Link className="nav-link" to="/navdhaagaGold" style={{ color: "#d4af37" }}>Navdhaaga Gold</Link></li>
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
                                    <FontAwesomeIcon icon={faSearch} />
                                </button>
                                <button onClick={handleAccountClick} className="icon-btn" title="My Account">
                                    <FontAwesomeIcon icon={faUser} />
                                </button>
                                <Link to="/wishlist" className="icon-btn" title="Wishlist">
                                    <FontAwesomeIcon icon={faHeart} />

                                    {/* Conditionally render the badge only if count > 0 */}
                                    {wishlistCount > 0 && (
                                        <span className="count-badge">{wishlistCount}</span>
                                    )}
                                </Link>
                                <Link to="/cart" className="icon-btn" title="Shopping Cart">
                                    <FontAwesomeIcon icon={faShoppingBag} />
                                    {itemCount > 0 && (
                                        <span className="count-badge">{itemCount}</span>
                                    )}
                                </Link>
                            </div>

                        </>
                    )}
                </div>
            </nav>
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
            <UserProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
        </header>
        // The old search overlay div has been completely removed from here
    );
};

export default Header;
