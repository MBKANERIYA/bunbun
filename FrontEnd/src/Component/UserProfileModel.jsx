import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getAuthUser, notifyAuthChanged } from '../utils/auth';

const UserProfileModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const user = getAuthUser();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        notifyAuthChanged();
        onClose();
    };

    const handleNavigate = (path) => {
        onClose();
        navigate(path);
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
                    <button className="profile-link" onClick={() => handleNavigate('/my-orders')}>My Orders</button>
                    <button className="profile-link" onClick={() => handleNavigate('/cart')}>Cart</button>
                    <button className="profile-link" onClick={() => handleNavigate('/wishlist')}>Wishlist</button>
                    <button className="profile-link" onClick={() => handleNavigate('/edit-profile')}>Edit Profile</button>
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
