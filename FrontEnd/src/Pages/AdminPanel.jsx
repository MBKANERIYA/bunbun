import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../utils/apiConfig';
import '../Style/Admin.css';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

const AdminPanel = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Dashboard state
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Add Product form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        mrp: '',
        selling_price: '',
        category: '',
        subcategory: '',
        color: '',
        sku: '',
        productType: '',
        blouseType: '',
        blouseColor: '',
        blouseFabric: '',
        blouseWork: '',
        sleeveLength: '',
        bustSize: '',
        blouseLength: '',
        washAndCare: '',
        salesPackage: '',
        weight: '',
    });
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState({ type: '', text: '' });

    // Check session
    useEffect(() => {
        const session = sessionStorage.getItem('adminLoggedIn');
        if (session === 'true') setIsLoggedIn(true);
    }, []);

    // Fetch products when dashboard tab is active
    useEffect(() => {
        if (isLoggedIn && activeTab === 'dashboard') {
            fetchProducts();
        }
    }, [isLoggedIn, activeTab]);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const res = await axios.get(apiUrl('/v1/product/getProduct'));
            setProducts(res.data.product || []);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoadingProducts(false);
        }
    };

    // Login handler
    const handleLogin = (e) => {
        e.preventDefault();
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            setIsLoggedIn(true);
            sessionStorage.setItem('adminLoggedIn', 'true');
            setLoginError('');
        } else {
            setLoginError('Invalid username or password');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        sessionStorage.removeItem('adminLoggedIn');
        setUsername('');
        setPassword('');
    };

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        } else {
            setMainImage(null);
            setMainImagePreview('');
        }
    };

    const handleAdditionalImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setAdditionalImages(prev => prev ? [...prev, ...files] : [...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setAdditionalImagesPreviews(prev => [...prev, ...newPreviews]);
            
            // Clear the input value so selecting the same file again works
            e.target.value = null;
        }
    };

    const removeAdditionalImage = (indexToRemove) => {
        const urlToRemove = additionalImagesPreviews[indexToRemove];
        if (existingImages.includes(urlToRemove)) {
            setExistingImages(prev => prev.filter(img => img !== urlToRemove));
        } else {
            const indexInFilesArray = indexToRemove - existingImages.length;
            setAdditionalImages(prev => prev.filter((_, i) => i !== indexInFilesArray));
        }
        setAdditionalImagesPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitMsg({ type: '', text: '' });

        try {
            const data = new FormData();
            
            // Append textual form data
            Object.keys(formData).forEach(key => {
                if (formData[key]) data.append(key, formData[key]);
            });

            // Append main image file
            if (mainImage) {
                data.append('image', mainImage);
            }

            // Append additional image files
            if (additionalImages && additionalImages.length > 0) {
                Array.from(additionalImages).forEach(file => {
                    data.append('images', file);
                });
            }

            // Keep track of existing images if we are editing
            if (editProductId && existingImages.length > 0) {
                data.append('existingImages', JSON.stringify(existingImages));
            }

            if (editProductId) {
                await axios.put(apiUrl(`/v1/product/updateProduct/${editProductId}`), data);
                setSubmitMsg({ type: 'success', text: 'Product updated successfully!' });
            } else {
                await axios.post(apiUrl('/v1/product/addProduct'), data);
                setSubmitMsg({ type: 'success', text: 'Product added successfully!' });
            }
            
            setFormData({
                name: '', description: '',
                mrp: '', selling_price: '', category: '', subcategory: '',
                color: '', sku: '', productType: '', blouseType: '',
                blouseColor: '', blouseFabric: '', blouseWork: '',
                sleeveLength: '', bustSize: '', blouseLength: '',
                washAndCare: '', salesPackage: '', weight: '',
            });
            setMainImage(null);
            setAdditionalImages(null);
            setMainImagePreview('');
            setAdditionalImagesPreviews([]);
            setEditProductId(null);
            setExistingImages([]);
            // Reset file inputs visually by resetting the form
            e.target.reset();
            // Refetch products if we edited
            if (editProductId) fetchProducts();
        } catch (err) {
            setSubmitMsg({ type: 'error', text: err.response?.data?.error || 'Failed to add product.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditProduct = (product) => {
        setEditProductId(product._id);
        setFormData({
            name: product.name || '', description: product.description || '',
            mrp: product.mrp || '', selling_price: product.selling_price || '',
            category: product.category || '', subcategory: product.subcategory || '',
            color: product.color || '', sku: product.sku || '',
            productType: product.productType || '', blouseType: product.blouseType || '',
            blouseColor: product.blouseColor || '', blouseFabric: product.blouseFabric || '',
            blouseWork: product.blouseWork || '', sleeveLength: product.sleeveLength || '',
            bustSize: product.bustSize || '', blouseLength: product.blouseLength || '',
            washAndCare: product.washAndCare || '', salesPackage: product.salesPackage || '',
            weight: product.weight || '',
        });
        setMainImagePreview(product.image || '');
        setAdditionalImagesPreviews(product.images || []);
        setExistingImages(product.images || []);
        setActiveTab('addProduct');
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            try {
                await axios.delete(apiUrl(`/v1/product/deleteProduct/${productId}`));
                setProducts(products.filter(p => p._id !== productId));
                alert("Product deleted successfully");
            } catch (err) {
                console.error("Failed to delete product:", err);
                alert("Failed to delete product. Please try again.");
            }
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'addProduct') {
            // Clear form when opening add tab manually (not via edit)
            if (editProductId) {
                setEditProductId(null);
                setFormData({
                    name: '', description: '', mrp: '', selling_price: '', category: '', subcategory: '',
                    color: '', sku: '', productType: '', blouseType: '', blouseColor: '', blouseFabric: '',
                    blouseWork: '', sleeveLength: '', bustSize: '', blouseLength: '', washAndCare: '',
                    salesPackage: '', weight: '',
                });
                setMainImagePreview('');
                setAdditionalImagesPreviews([]);
                setExistingImages([]);
            }
        }
    };

    // ========== LOGIN SCREEN ==========
    if (!isLoggedIn) {
        return (
            <div className="admin-login-page">
                <div className="admin-login-card">
                    <div className="admin-login-header">
                        <div className="admin-logo-icon">🔒</div>
                        <h1>Admin Panel</h1>
                        <p>Navdhaaga Store Management</p>
                    </div>
                    {loginError && <div className="admin-error">{loginError}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="admin-field">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div className="admin-field">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <button type="submit" className="admin-login-btn">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    // ========== DASHBOARD ==========
    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-brand">
                    <h2>Navdhaaga</h2>
                    <span>Admin Panel</span>
                </div>
                <nav className="admin-nav">
                    <button
                        className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        📦 Products
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'addProduct' ? 'active' : ''}`}
                        onClick={() => handleTabChange('addProduct')}
                    >
                        ➕ {editProductId ? 'Edit Product' : 'Add Product'}
                    </button>
                </nav>
                <button className="admin-logout-btn" onClick={handleLogout}>
                    🚪 Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Top Bar */}
                <div className="admin-topbar">
                    <h2>{activeTab === 'dashboard' ? 'All Products' : 'Add New Product'}</h2>
                    <span className="admin-topbar-user">👤 Admin</span>
                </div>

                {/* ===== PRODUCTS TABLE ===== */}
                {activeTab === 'dashboard' && (
                    <div className="admin-content">
                        <div className="admin-stats-row">
                            <div className="admin-stat-card">
                                <span className="stat-number">{products.length}</span>
                                <span className="stat-label">Total Products</span>
                            </div>
                        </div>

                        {loadingProducts ? (
                            <div className="admin-loading">Loading products...</div>
                        ) : (
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>SKU</th>
                                            <th>Type</th>
                                            <th>MRP</th>
                                            <th>Selling Price</th>
                                            <th>Category</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.length === 0 ? (
                                            <tr><td colSpan="9" className="admin-no-data">No products found</td></tr>
                                        ) : (
                                            products.map((p, i) => (
                                                <tr key={p._id}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <img src={p.image} alt={p.name} className="admin-product-thumb" />
                                                    </td>
                                                    <td className="admin-product-name">{p.name}</td>
                                                    <td>{p.sku || '—'}</td>
                                                    <td>{p.productType || '—'}</td>
                                                    <td>₹{p.mrp}</td>
                                                    <td>₹{p.selling_price}</td>
                                                    <td>{p.category || '—'}</td>
                                                    <td>
                                                        <div className="admin-action-btns">
                                                            <button 
                                                                className="admin-edit-btn" 
                                                                onClick={() => handleEditProduct(p)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button 
                                                                className="admin-delete-btn" 
                                                                onClick={() => handleDeleteProduct(p._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== ADD PRODUCT FORM ===== */}
                {activeTab === 'addProduct' && (
                    <div className="admin-content">
                        {submitMsg.text && (
                            <div className={`admin-msg ${submitMsg.type}`}>{submitMsg.text}</div>
                        )}
                        <form className="admin-product-form" onSubmit={handleAddProduct}>

                            {/* Section: Basic Info */}
                            <div className="form-section">
                                <h3 className="form-section-title">Basic Information</h3>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Product Title *</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Printed Saree - PaleTurquoise Edition" />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Product Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Detailed product description..." />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Images */}
                            <div className="form-section">
                                <h3 className="form-section-title">Images</h3>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Main Image *</label>
                                        <input type="file" name="image" accept="image/*" onChange={handleMainImageChange} required={!editProductId} />
                                        {mainImagePreview && (
                                            <div className="image-previews-wrapper">
                                                <div className="image-preview-item">
                                                    <img src={mainImagePreview} alt="Main preview" />
                                                    <button type="button" className="remove-preview-btn" onClick={() => { setMainImage(null); setMainImagePreview(''); document.querySelector('input[name="image"]').value = ''; }}>✕</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Additional Images (Multiple)</label>
                                        <input type="file" name="images" accept="image/*" multiple onChange={handleAdditionalImagesChange} />
                                        {additionalImagesPreviews.length > 0 && (
                                            <div className="image-previews-wrapper">
                                                {additionalImagesPreviews.map((src, index) => (
                                                    <div className="image-preview-item" key={index}>
                                                        <img src={src} alt={`Additional preview ${index + 1}`} />
                                                        <button type="button" className="remove-preview-btn" onClick={() => removeAdditionalImage(index)}>✕</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section: Pricing & Category */}
                            <div className="form-section">
                                <h3 className="form-section-title">Pricing & Category</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>MRP (₹) *</label>
                                        <input type="text" name="mrp" value={formData.mrp} onChange={handleInputChange} required placeholder="4240" />
                                    </div>
                                    <div className="form-group">
                                        <label>Selling Price (₹) *</label>
                                        <input type="text" name="selling_price" value={formData.selling_price} onChange={handleInputChange} required placeholder="3115" />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange}>
                                            <option value="">Select Category</option>
                                            <option value="Saree">Saree</option>
                                            <option value="Blouse">Blouse</option>
                                            <option value="Suit">Suit</option>
                                            <option value="Lehenga">Lehenga</option>
                                            <option value="Kurti">Kurti</option>
                                            <option value="Shapewear">Shapewear</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Subcategory</label>
                                        <input type="text" name="subcategory" value={formData.subcategory} onChange={handleInputChange} placeholder="Printed Saree" />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Product Details */}
                            <div className="form-section">
                                <h3 className="form-section-title">Product Details</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>SKU</label>
                                        <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="ND-SR-001" />
                                    </div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        <input type="text" name="productType" value={formData.productType} onChange={handleInputChange} placeholder="Saree" />
                                    </div>
                                    <div className="form-group">
                                        <label>Color</label>
                                        <input type="text" name="color" value={formData.color} onChange={handleInputChange} placeholder="PaleTurquoise" />
                                    </div>
                                    <div className="form-group">
                                        <label>Weight</label>
                                        <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="500g" />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Blouse Details */}
                            <div className="form-section">
                                <h3 className="form-section-title">Blouse Details</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Blouse Type</label>
                                        <input type="text" name="blouseType" value={formData.blouseType} onChange={handleInputChange} placeholder="Unstitched" />
                                    </div>
                                    <div className="form-group">
                                        <label>Blouse Color</label>
                                        <input type="text" name="blouseColor" value={formData.blouseColor} onChange={handleInputChange} placeholder="Matching" />
                                    </div>
                                    <div className="form-group">
                                        <label>Blouse Fabric</label>
                                        <input type="text" name="blouseFabric" value={formData.blouseFabric} onChange={handleInputChange} placeholder="Silk" />
                                    </div>
                                    <div className="form-group">
                                        <label>Blouse Work</label>
                                        <input type="text" name="blouseWork" value={formData.blouseWork} onChange={handleInputChange} placeholder="Printed" />
                                    </div>
                                    <div className="form-group">
                                        <label>Sleeve Length</label>
                                        <input type="text" name="sleeveLength" value={formData.sleeveLength} onChange={handleInputChange} placeholder="Short Sleeve" />
                                    </div>
                                    <div className="form-group">
                                        <label>Bust Size</label>
                                        <input type="text" name="bustSize" value={formData.bustSize} onChange={handleInputChange} placeholder="Up to 42" />
                                    </div>
                                    <div className="form-group">
                                        <label>Blouse Length</label>
                                        <input type="text" name="blouseLength" value={formData.blouseLength} onChange={handleInputChange} placeholder="15 inches" />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Additional Info */}
                            <div className="form-section">
                                <h3 className="form-section-title">Additional Information</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Wash And Care</label>
                                        <input type="text" name="washAndCare" value={formData.washAndCare} onChange={handleInputChange} placeholder="Dry Clean Only" />
                                    </div>
                                    <div className="form-group">
                                        <label>Sales Package</label>
                                        <input type="text" name="salesPackage" value={formData.salesPackage} onChange={handleInputChange} placeholder="1 Saree with Blouse Piece" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="admin-submit-btn" disabled={submitting}>
                                    {submitting ? 'Saving Product...' : (editProductId ? 'Save Changes' : '+ Add Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
