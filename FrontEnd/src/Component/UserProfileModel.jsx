import React from 'react';
import ReactDOM from 'react-dom';
import { getAuthUser, notifyAuthChanged } from '../utils/auth';

const UserProfileModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const user = getAuthUser();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        notifyAuthChanged();
        onClose();
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                
                <h3>My Account</h3>
                <div className="profile-details">
                    <p className="user-name">
                        {user?.fullName?.firstName} {user?.fullName?.lastName}
                    </p>
                    <p className="user-email">{user?.email}</p>
                </div>
                
                <nav className="profile-nav">
                    <a href="/cart" className="profile-link">Cart</a>
                    <a href="/wishlist" className="profile-link">Wishlist</a>
                    <a href="/edit-profile" className="profile-link">Edit Profile</a>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default UserProfileModal;
