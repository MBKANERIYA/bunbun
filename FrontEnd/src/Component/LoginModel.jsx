import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa'; 
import { notifyAuthChanged } from '../utils/auth';

const LoginModal = ({ isOpen, onClose }) => {
    // State for user input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for API call status
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // If the modal isn't open, don't render anything
    if (!isOpen) return null;

    const handleLoginSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:4000/v1/User/login', {
                email,
                password,
            });

            localStorage.setItem('authToken', JSON.stringify(response.data));
            notifyAuthChanged();

            setIsLoading(false);
            onClose();
        } catch (err) {
            // Set error message from API response or a generic message
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            setIsLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                
                {/* Left Panel */}
                <div className="modal-left-panel">
                    <h2>Navdhaaga</h2>
                    <h3>Welcome! Login to get best deals!</h3>
                </div>

                <div className="modal-right-panel">
                    <button className="close-btn" onClick={onClose}>&times;</button>
                    <h4>Login Now!</h4>
                    
                    {error && <p className="error-message">{error}</p>}

                    <form onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                             <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="input-field"
                            />
                        </div>
                        
                        <button type="submit" className="continue-btn" disabled={isLoading}>
                            {isLoading ? <FaSpinner className="spinner" /> : 'Continue'}
                        </button>
                    </form>
                </div>

            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default LoginModal;
