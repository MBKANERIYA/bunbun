import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa'; 
import { notifyAuthChanged } from '../utils/auth';
import { apiUrl } from '../utils/apiConfig';

const LoginModal = ({ isOpen, onClose }) => {
    // Toggle between 'login' and 'register' views
    const [mode, setMode] = useState('login');

    // Login state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Register state
    const [regFirstName, setRegFirstName] = useState('');
    const [regLastName, setRegLastName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regMobile, setRegMobile] = useState('');
    const [regGender, setRegGender] = useState('');

    // Shared state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    if (!isOpen) return null;

    const resetFields = () => {
        setEmail(''); setPassword('');
        setRegFirstName(''); setRegLastName('');
        setRegEmail(''); setRegPassword('');
        setRegMobile(''); setRegGender('');
        setError(null); setSuccess(null);
    };

    const switchMode = (newMode) => {
        resetFields();
        setMode(newMode);
    };

    // --- Login Handler ---
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(apiUrl('/v1/User/login'), {
                email,
                password,
            });

            localStorage.setItem('authToken', JSON.stringify(response.data));
            notifyAuthChanged();

            setIsLoading(false);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            setIsLoading(false);
        }
    };

    // --- Register Handler ---
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                fullName: {
                    firstName: regFirstName,
                    lastName: regLastName,
                },
                email: regEmail,
                password: regPassword,
                mobileNumber: regMobile,
            };
            if (regGender) payload.gender = regGender;

            const response = await axios.post(apiUrl('/v1/User/Register'), payload);

            // Auto-login after successful registration
            localStorage.setItem('authToken', JSON.stringify(response.data));
            notifyAuthChanged();

            setIsLoading(false);
            setSuccess('Account created successfully!');
            
            // Close modal after a brief moment
            setTimeout(() => {
                onClose();
            }, 800);
        } catch (err) {
            const errData = err.response?.data;
            if (errData?.error && Array.isArray(errData.error)) {
                // Validation errors from express-validator
                setError(errData.error.map(e => e.msg).join(', '));
            } else {
                setError(errData?.message || errData?.err || 'Registration failed. Please try again.');
            }
            setIsLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                
                {/* Left Panel */}
                <div className="modal-left-panel">
                    <h2>Navdhaaga</h2>
                    <h3>{mode === 'login' 
                        ? 'Welcome! Login to get best deals!' 
                        : 'Join us today for exclusive offers!'}
                    </h3>
                    {mode === 'register' && (
                        <div className="features" style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: '1.8' }}>
                            <div className="feature-item">✓ Exclusive Member Discounts</div>
                            <div className="feature-item">✓ Track Your Orders</div>
                            <div className="feature-item">✓ Wishlist & Quick Checkout</div>
                        </div>
                    )}
                </div>

                <div className="modal-right-panel">
                    <button className="close-btn" onClick={onClose}>&times;</button>
                    <h4>{mode === 'login' ? 'Login Now!' : 'Create Account'}</h4>
                    
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    {/* ========== LOGIN FORM ========== */}
                    {mode === 'login' && (
                        <form onSubmit={handleLoginSubmit}>
                            <div className="form-group">
                                <label htmlFor="login-email">Email Address</label>
                                <input
                                    type="email"
                                    id="login-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="login-password">Password</label>
                                 <input
                                    type="password"
                                    id="login-password"
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

                            <p className="auth-switch-text">
                                New to Navdhaaga?{' '}
                                <span className="auth-switch-link" onClick={() => switchMode('register')}>
                                    Create an account
                                </span>
                            </p>
                        </form>
                    )}

                    {/* ========== REGISTER FORM ========== */}
                    {mode === 'register' && (
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="form-row-inline">
                                <div className="form-group">
                                    <label htmlFor="reg-firstname">First Name</label>
                                    <input
                                        type="text"
                                        id="reg-firstname"
                                        value={regFirstName}
                                        onChange={(e) => setRegFirstName(e.target.value)}
                                        placeholder="First name"
                                        required
                                        minLength={3}
                                        className="input-field"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reg-lastname">Last Name</label>
                                    <input
                                        type="text"
                                        id="reg-lastname"
                                        value={regLastName}
                                        onChange={(e) => setRegLastName(e.target.value)}
                                        placeholder="Last name"
                                        required
                                        minLength={3}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-email">Email Address</label>
                                <input
                                    type="email"
                                    id="reg-email"
                                    value={regEmail}
                                    onChange={(e) => setRegEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-mobile">Mobile Number</label>
                                <input
                                    type="tel"
                                    id="reg-mobile"
                                    value={regMobile}
                                    onChange={(e) => setRegMobile(e.target.value)}
                                    placeholder="10-digit mobile number"
                                    required
                                    pattern="[6-9][0-9]{9}"
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-password">Password</label>
                                <input
                                    type="password"
                                    id="reg-password"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    placeholder="Min 8 chars, 1 upper, 1 lower, 1 special"
                                    required
                                    minLength={8}
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-gender">Gender (Optional)</label>
                                <select
                                    id="reg-gender"
                                    value={regGender}
                                    onChange={(e) => setRegGender(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">-- Select --</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <button type="submit" className="continue-btn" disabled={isLoading}>
                                {isLoading ? <FaSpinner className="spinner" /> : 'Create Account'}
                            </button>

                            <p className="auth-switch-text">
                                Already have an account?{' '}
                                <span className="auth-switch-link" onClick={() => switchMode('login')}>
                                    Login here
                                </span>
                            </p>
                        </form>
                    )}
                </div>

            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default LoginModal;
