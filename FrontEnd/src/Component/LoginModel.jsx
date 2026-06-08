import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa'; 
import { notifyAuthChanged } from '../utils/auth';
import { apiUrl } from '../utils/apiConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../utils/firebase';

const LoginModal = ({ isOpen, onClose }) => {
    // OTP Login state
    const [mobileNumber, setMobileNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

    // Shared state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Cleanup recaptcha when modal closes
    useEffect(() => {
        if (!isOpen && window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const resetFields = () => {
        setMobileNumber('');
        setOtpCode('');
        setOtpSent(false);
        setConfirmationResult(null);
        setError(null);
        setSuccess(null);
    };

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: (response) => {
                    // reCAPTCHA solved
                }
            });
        }
    };

    // --- Send OTP Handler (Firebase) ---
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const phoneNumber = `+91${mobileNumber}`; // Ensure proper country code

            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(confirmation);

            setOtpSent(true);
            setSuccess('OTP securely sent to your phone via Firebase!');
            setIsLoading(false);
        } catch (err) {
            console.error("Firebase Error:", err);
            // If recaptcha fails, we might need to reset it
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.render().then(function(widgetId) {
                        grecaptcha.reset(widgetId);
                    });
                } catch (e) {
                    // Ignore reset errors
                }
            }
            // Expose the EXACT firebase error message so we can debug it
            setError(err.message || 'Failed to send OTP.');
            setIsLoading(false);
        }
    };

    // --- Verify OTP Handler (Firebase) ---
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // 1. Verify OTP with Firebase
            await confirmationResult.confirm(otpCode);

            // 2. Sync with our Backend Database
            const response = await axios.post(apiUrl('/v1/User/firebase-login'), {
                mobileNumber,
            });

            // 3. Save token & close
            localStorage.setItem('authToken', JSON.stringify(response.data));
            notifyAuthChanged();

            setIsLoading(false);
            resetFields();
            onClose();
        } catch (err) {
            console.error(err);
            setError('Invalid OTP code. Please try again.');
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        resetFields();
        onClose();
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                
                {/* Left Panel */}
                <div className="modal-left-panel">
                    <h2>Bunbun Clothing</h2>
                    <h3>Quick & secure login with your mobile number!</h3>
                    <div className="features" style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: '1.8' }}>
                        <div className="feature-item">✓ Powered by Firebase Security</div>
                        <div className="feature-item">✓ Fast SMS Delivery</div>
                        <div className="feature-item">✓ Exclusive Member Deals</div>
                        <div className="feature-item">✓ Track Your Orders</div>
                    </div>
                </div>

                <div className="modal-right-panel">
                    <button className="close-btn" onClick={handleClose}>&times;</button>
                    <h4>{!otpSent ? 'Login / Sign Up' : 'Verify OTP'}</h4>
                    
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    {/* Invisible ReCaptcha Container */}
                    <div id="recaptcha-container"></div>

                    {/* ========== STEP 1: ENTER MOBILE NUMBER ========== */}
                    {!otpSent ? (
                        <form onSubmit={handleSendOtp}>
                            <div className="form-group">
                                <label htmlFor="otp-mobile">Mobile Number</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#333', padding: '10px 0' }}>+91</span>
                                    <input
                                        type="tel"
                                        id="otp-mobile"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="Enter 10-digit mobile number"
                                        required
                                        pattern="[6-9][0-9]{9}"
                                        maxLength={10}
                                        className="input-field"
                                        autoFocus
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="continue-btn" disabled={isLoading || mobileNumber.length !== 10}>
                                {isLoading ? <FaSpinner className="spinner" /> : 'Send OTP'}
                            </button>

                            <p className="auth-switch-text" style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#999' }}>
                                By continuing, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </form>
                    ) : (
                        /* ========== STEP 2: ENTER OTP ========== */
                        <form onSubmit={handleVerifyOtp}>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#333', padding: '10px 0' }}>+91</span>
                                    <input
                                        type="tel"
                                        value={mobileNumber}
                                        disabled
                                        className="input-field"
                                        style={{ flex: 1, opacity: 0.7 }}
                                    />
                                </div>
                                <span 
                                    className="auth-switch-link" 
                                    onClick={() => { setOtpSent(false); setOtpCode(''); setError(null); setSuccess(null); }}
                                    style={{ fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                    Change number
                                </span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="otp-code">Enter OTP</label>
                                <input
                                    type="text"
                                    id="otp-code"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="● ● ● ● ● ●"
                                    required
                                    maxLength={6}
                                    className="input-field"
                                    autoFocus
                                    style={{ letterSpacing: '12px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '700' }}
                                />
                                <small style={{display:'block', textAlign:'center', marginTop:'5px', color:'#666'}}>Firebase OTP is 6 digits</small>
                            </div>

                            <button type="submit" className="continue-btn" disabled={isLoading || otpCode.length !== 6}>
                                {isLoading ? <FaSpinner className="spinner" /> : 'Verify & Login'}
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default LoginModal;
