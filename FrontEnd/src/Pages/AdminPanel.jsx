import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../utils/apiConfig';
import '../Style/Admin.css';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';
const MAX_ADDITIONAL_IMAGES = 10;
const TARGET_MAX_BYTES = 200 * 1024; // 200 KB

const compressImageForUpload = (file) => new Promise((resolve, reject) => {
    // If the file is already smaller than 200KB, just use it
    if (file.size <= TARGET_MAX_BYTES) {
        resolve(file);
        return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
        URL.revokeObjectURL(objectUrl);

        // Reduce dimensions to max 1024px for aggressive compression
        const maxDimension = 1024;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);

        // Use 0.7 quality to target ~200KB for typical 1024px images
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Could not prepare the selected image.'));
                return;
            }

            const baseName = file.name.replace(/\.[^.]+$/, '') || 'product-image';
            resolve(new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.7);
    };

    image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('One selected file could not be read as an image.'));
    };

    image.src = objectUrl;
});

const AdminPanel = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Dashboard state
    const [activeTab, setActiveTab] = useState(() => {
        return sessionStorage.getItem('adminActiveTab') || 'dashboard';
    });
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Add Product form state
    const [formData, setFormData] = useState(() => {
        const savedData = sessionStorage.getItem('adminProductFormData');
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                console.error("Error parsing saved form data:", e);
            }
        }
        return {
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
            // Shapewear specific
            bottomColor: '',
            bottomFabric: '',
            bottomLength: '',
            bottomWork: '',
            waistType: '',
            bottomHip: '',
            bottomWaist: '',
            sizeDetails: [
                { size: 'L', bust: '', waist: '', hip: '', shoulder: '', length: '' },
                { size: 'XL', bust: '', waist: '', hip: '', shoulder: '', length: '' },
                { size: 'XXL', bust: '', waist: '', hip: '', shoulder: '', length: '' },
                { size: 'XXXL', bust: '', waist: '', hip: '', shoulder: '', length: '' }
            ],
        };
    });
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);
    const [editProductId, setEditProductId] = useState(() => {
        return sessionStorage.getItem('adminEditProductId') || null;
    });
    const [existingImages, setExistingImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState({ type: '', text: '' });

    // Check session
    useEffect(() => {
        const session = sessionStorage.getItem('adminLoggedIn');
        if (session === 'true') setIsLoggedIn(true);
    }, []);

    // Persist form state
    useEffect(() => {
        sessionStorage.setItem('adminActiveTab', activeTab);
    }, [activeTab]);

    useEffect(() => {
        sessionStorage.setItem('adminProductFormData', JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        if (editProductId) {
            sessionStorage.setItem('adminEditProductId', editProductId);
        } else {
            sessionStorage.removeItem('adminEditProductId');
        }
    }, [editProductId]);

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

    const handleSizeDetailChange = (index, field, value) => {
        setFormData(prev => {
            const newSizeDetails = [...prev.sizeDetails];
            newSizeDetails[index] = { ...newSizeDetails[index], [field]: value };
            return { ...prev, sizeDetails: newSizeDetails };
        });
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
        const remainingSlots = MAX_ADDITIONAL_IMAGES - additionalImagesPreviews.length;
        const acceptedFiles = files.slice(0, Math.max(0, remainingSlots));

        if (files.length > remainingSlots) {
            setSubmitMsg({ type: 'error', text: `You can upload up to ${MAX_ADDITIONAL_IMAGES} additional images.` });
        }

        if (acceptedFiles.length > 0) {
            setAdditionalImages(prev => prev ? [...prev, ...acceptedFiles] : [...acceptedFiles]);
            const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
            setAdditionalImagesPreviews(prev => [...prev, ...newPreviews]);
        }

        // Clear the input value so selecting the same file again works
        e.target.value = null;
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
            const uploadFile = async (file) => {
                const uploadData = new FormData();
                uploadData.append('image', await compressImageForUpload(file));
                const response = await axios.post(apiUrl('/v1/product/uploadImage'), uploadData);
                return response.data.url;
            };

            const data = { ...formData };
            if (formData.category !== 'Blouse' && formData.category !== 'Shapewear') delete data.sizeDetails;

            if (mainImage) {
                data.image = await uploadFile(mainImage);
            }

            const uploadedAdditionalImages = [];
            for (const file of additionalImages || []) {
                uploadedAdditionalImages.push(await uploadFile(file));
            }
            data.images = [...existingImages, ...uploadedAdditionalImages];

            if (editProductId) {
                await axios.put(apiUrl(`/v1/product/updateProduct/${editProductId}`), data);
                setSubmitMsg({ type: 'success', text: 'Product updated successfully!' });
            } else {
                await axios.post(apiUrl('/v1/product/addProduct'), data);
                setSubmitMsg({ type: 'success', text: 'Product added successfully!' });
            }
            
            setFormData({
                name: '', description: '', mrp: '', selling_price: '', category: '', subcategory: '',
                color: '', sku: '', productType: '', blouseType: '', blouseColor: '', blouseFabric: '',
                blouseWork: '', sleeveLength: '', bustSize: '', blouseLength: '', washAndCare: '',
                salesPackage: '', weight: '', bottomColor: '', bottomFabric: '', bottomLength: '',
                bottomWork: '', waistType: '', bottomHip: '', bottomWaist: '',
                sizeDetails: [
                    { size: 'L', bust: '', waist: '', hip: '', shoulder: '', length: '' },
                    { size: 'XL', bust: '', waist: '', hip: '', shoulder: '', length: '' },
                    { size: 'XXL', bust: '', waist: '', hip: '', shoulder: '', length: '' },
                    { size: 'XXXL', bust: '', waist: '', hip: '', shoulder: '', length: '' }
                ],
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
            const status = err.response?.status;
            const data = err.response?.data;
            let errorText;

            if (status === 413) {
                errorText = 'The request is too large. Please reduce the number of images or use smaller image files.';
            } else if (typeof data?.error === 'string') {
                errorText = data.error;
            } else if (typeof data?.message === 'string') {
                errorText = data.message;
            } else if (typeof err.message === 'string') {
                errorText = err.message;
            } else {
                errorText = 'Failed to add product.';
            }

            setSubmitMsg({ type: 'error', text: errorText });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditProduct = (product) => {
        setEditProductId(product._id);
        const defaultSizeDetails = [
            { size: 'L', bust: '', waist: '', hip: '', shoulder: '', length: '' },
            { size: 'XL', bust: '', waist: '', hip: '', shoulder: '', length: '' },
            { size: 'XXL', bust: '', waist: '', hip: '', shoulder: '', length: '' },
            { size: 'XXXL', bust: '', waist: '', hip: '', shoulder: '', length: '' }
        ];
        
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
            bottomColor: product.bottomColor || '', bottomFabric: product.bottomFabric || '',
            bottomLength: product.bottomLength || '', bottomWork: product.bottomWork || '',
            waistType: product.waistType || '', bottomHip: product.bottomHip || '',
            bottomWaist: product.bottomWaist || '',
            sizeDetails: (product.sizeDetails && product.sizeDetails.length > 0) ? product.sizeDetails : defaultSizeDetails,
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
                    salesPackage: '', weight: '', bottomColor: '', bottomFabric: '',
                    bottomLength: '', bottomWork: '', waistType: '', bottomHip: '', bottomWaist: '',
                    sizeDetails: [
                        { size: 'L', bust: '', waist: '', hip: '', shoulder: '', length: '' },
                        { size: 'XL', bust: '', waist: '', hip: '', shoulder: '', length: '' },
                        { size: 'XXL', bust: '', waist: '', hip: '', shoulder: '', length: '' },
                        { size: 'XXXL', bust: '', waist: '', hip: '', shoulder: '', length: '' }
                    ],
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
                        <p>Bunbun Clothing Store Management</p>
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
                    <h2>Bunbun Clothing</h2>
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

                            {/* Section: Category Selection First */}
                            <div className="form-section">
                                <h3 className="form-section-title">Select Category</h3>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <select name="category" value={formData.category} onChange={handleInputChange} required style={{ padding: '12px', fontSize: '16px', fontWeight: 'bold' }}>
                                            <option value="">-- Choose Category to Add Product --</option>
                                            <option value="Blouse">Blouse</option>
                                            <option value="Shapewear">Shapewear</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {formData.category && (
                                <>
                                    {/* Section: Basic Info */}
                                    <div className="form-section">
                                        <h3 className="form-section-title">Basic Information</h3>
                                        <div className="form-grid">
                                            <div className="form-group full-width">
                                                <label>Product Title *</label>
                                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Printed Saree - PaleTurquoise Edition" />
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Product Description *</label>
                                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Detailed product description..." required />
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
                                                <label>Additional Images (Multiple, up to {MAX_ADDITIONAL_IMAGES})</label>
                                                <input type="file" name="images" accept="image/*" multiple onChange={handleAdditionalImagesChange} disabled={additionalImagesPreviews.length >= MAX_ADDITIONAL_IMAGES} />
                                                <small>{additionalImagesPreviews.length} / {MAX_ADDITIONAL_IMAGES} selected</small>
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

                                    {/* Section: Pricing */}
                                    <div className="form-section">
                                        <h3 className="form-section-title">Pricing</h3>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>MRP (₹) *</label>
                                                <input type="text" name="mrp" value={formData.mrp} onChange={handleInputChange} required placeholder="4240" />
                                            </div>
                                            <div className="form-group">
                                                <label>Selling Price (₹) *</label>
                                                <input type="text" name="selling_price" value={formData.selling_price} onChange={handleInputChange} required placeholder="3115" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Details */}
                                    <div className="form-section">
                                        <h3 className="form-section-title">Common Details</h3>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>SKU *</label>
                                                <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} required placeholder={formData.category === 'Shapewear' ? '754SWTK310-XXL' : '73B1229-L'} />
                                            </div>
                                            <div className="form-group">
                                                <label>Type *</label>
                                                <input type="text" name="productType" value={formData.productType} onChange={handleInputChange} required placeholder={formData.category === 'Shapewear' ? 'Shapewear' : 'Self Woven'} />
                                            </div>
                                            <div className="form-group">
                                                <label>Wash And Care *</label>
                                                <input type="text" name="washAndCare" value={formData.washAndCare} onChange={handleInputChange} required placeholder={formData.category === 'Shapewear' ? 'Machine Wash' : 'Hand Wash only'} />
                                            </div>
                                            <div className="form-group">
                                                <label>Weight *</label>
                                                <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} required placeholder={formData.category === 'Shapewear' ? '0.17 Kg' : '0.12 Kg'} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Specific Category Fields */}
                                    {formData.category === 'Blouse' && (
                                        <>
                                        <div className="form-section">
                                            <h3 className="form-section-title">Blouse Specific Details</h3>
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label>Blouse Type</label>
                                                    <input type="text" name="blouseType" value={formData.blouseType} onChange={handleInputChange} placeholder="Stitched (Optional)" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Blouse Color</label>
                                                    <input type="text" name="blouseColor" value={formData.blouseColor} onChange={handleInputChange} placeholder="Black (Optional)" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Blouse Fabric</label>
                                                    <input type="text" name="blouseFabric" value={formData.blouseFabric} onChange={handleInputChange} placeholder="Cotton Lycra (Optional)" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Blouse Work</label>
                                                    <input type="text" name="blouseWork" value={formData.blouseWork} onChange={handleInputChange} placeholder="Dyed, Self Woven (Optional)" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Sleeve Length</label>
                                                    <input type="text" name="sleeveLength" value={formData.sleeveLength} onChange={handleInputChange} placeholder="9.5 Inch (Optional)" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Bust Size</label>
                                                    <input type="text" name="bustSize" value={formData.bustSize} onChange={handleInputChange} placeholder="38 Inch (Optional)" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Blouse Length</label>
                                                    <input type="text" name="blouseLength" value={formData.blouseLength} onChange={handleInputChange} placeholder="14.5 Inch (Optional)" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Sales Package</label>
                                                    <input type="text" name="salesPackage" value={formData.salesPackage} onChange={handleInputChange} placeholder="Package Contains 1 Blouse With Attached Sleeves (Optional)" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-section">
                                            <h3 className="form-section-title">Size Chart Details (Blouse)</h3>
                                            <div className="admin-table-wrapper" style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                                                <table className="admin-table" style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{border: '1px solid #ddd', padding: '8px'}}>Size</th>
                                                            <th style={{border: '1px solid #ddd', padding: '8px'}}>Bust (inch)</th>
                                                            <th style={{border: '1px solid #ddd', padding: '8px'}}>Waist (inch)</th>
                                                            <th style={{border: '1px solid #ddd', padding: '8px'}}>Shoulder (inch)</th>
                                                            <th style={{border: '1px solid #ddd', padding: '8px'}}>Length (inch)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formData.sizeDetails.map((detail, index) => (
                                                            <tr key={index}>
                                                                <td style={{fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd', padding: '8px'}}>{detail.size}</td>
                                                                <td style={{border: '1px solid #ddd', padding: '8px'}}><input type="text" value={detail.bust} onChange={(e) => handleSizeDetailChange(index, 'bust', e.target.value)} placeholder="e.g. 25-29" style={{width: '100%', padding: '5px', border: '1px solid #ccc', borderRadius: '4px'}}/></td>
                                                                <td style={{border: '1px solid #ddd', padding: '8px'}}><input type="text" value={detail.waist} onChange={(e) => handleSizeDetailChange(index, 'waist', e.target.value)} placeholder="e.g. 22-28" style={{width: '100%', padding: '5px', border: '1px solid #ccc', borderRadius: '4px'}}/></td>
                                                                <td style={{border: '1px solid #ddd', padding: '8px'}}><input type="text" value={detail.shoulder} onChange={(e) => handleSizeDetailChange(index, 'shoulder', e.target.value)} placeholder="e.g. 12" style={{width: '100%', padding: '5px', border: '1px solid #ccc', borderRadius: '4px'}}/></td>
                                                                <td style={{border: '1px solid #ddd', padding: '8px'}}><input type="text" value={detail.length} onChange={(e) => handleSizeDetailChange(index, 'length', e.target.value)} placeholder="e.g. 14" style={{width: '100%', padding: '5px', border: '1px solid #ccc', borderRadius: '4px'}}/></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        </>
                                    )}

                                    {formData.category === 'Shapewear' && (
                                        <>
                                        <div className="form-section">
                                            <h3 className="form-section-title">Shapewear Specific Details (Optional)</h3>
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label>Bottom Color</label>
                                                    <input type="text" name="bottomColor" value={formData.bottomColor} onChange={handleInputChange} placeholder="Black" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Bottom Fabric</label>
                                                    <input type="text" name="bottomFabric" value={formData.bottomFabric} onChange={handleInputChange} placeholder="Lycra Blend" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Bottom Length</label>
                                                    <input type="text" name="bottomLength" value={formData.bottomLength} onChange={handleInputChange} placeholder="38 Inch" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Bottom Work</label>
                                                    <input type="text" name="bottomWork" value={formData.bottomWork} onChange={handleInputChange} placeholder="Plain" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Waist Type</label>
                                                    <input type="text" name="waistType" value={formData.waistType} onChange={handleInputChange} placeholder="Elastic" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Bottom Hip</label>
                                                    <input type="text" name="bottomHip" value={formData.bottomHip} onChange={handleInputChange} placeholder="36 Inch" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Bottom Waist</label>
                                                    <input type="text" name="bottomWaist" value={formData.bottomWaist} onChange={handleInputChange} placeholder="28 Inch" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-section">
                                            <h3 className="form-section-title">Size Chart Details (Shapewear)</h3>
                                            <div className="admin-table-wrapper" style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                                                <table className="admin-table" style={{ width: '100%', minWidth: '400px', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{border: '1px solid #ddd', padding: '8px'}}>Size</th>
                                                            <th style={{border: '1px solid #ddd', padding: '8px'}}>Waist (inch)</th>
                                                            <th style={{border: '1px solid #ddd', padding: '8px'}}>Hip (inch)</th>
                                                            <th style={{border: '1px solid #ddd', padding: '8px'}}>Length (inch)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formData.sizeDetails.map((detail, index) => (
                                                            <tr key={index}>
                                                                <td style={{fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd', padding: '8px'}}>{detail.size}</td>
                                                                <td style={{border: '1px solid #ddd', padding: '8px'}}><input type="text" value={detail.waist} onChange={(e) => handleSizeDetailChange(index, 'waist', e.target.value)} placeholder="e.g. 30" style={{width: '100%', padding: '5px', border: '1px solid #ccc', borderRadius: '4px'}}/></td>
                                                                <td style={{border: '1px solid #ddd', padding: '8px'}}><input type="text" value={detail.hip} onChange={(e) => handleSizeDetailChange(index, 'hip', e.target.value)} placeholder="e.g. 34-36" style={{width: '100%', padding: '5px', border: '1px solid #ccc', borderRadius: '4px'}}/></td>
                                                                <td style={{border: '1px solid #ddd', padding: '8px'}}><input type="text" value={detail.length} onChange={(e) => handleSizeDetailChange(index, 'length', e.target.value)} placeholder="e.g. 37" style={{width: '100%', padding: '5px', border: '1px solid #ccc', borderRadius: '4px'}}/></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        </>
                                    )}

                                    <div className="form-actions">
                                        <button type="submit" className="admin-submit-btn" disabled={submitting}>
                                            {submitting ? 'Saving Product...' : (editProductId ? 'Save Changes' : '+ Add Product')}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
