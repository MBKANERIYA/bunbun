import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Upload, Trash2, Search as SearchIcon, Bold, List, Type, Heading2, Heading3, Heading4, Image as ImageIcon, Link as LinkIcon, Eye, Edit3, Settings, X } from "lucide-react";
import axios from "axios";
import { apiUrl } from "../utils/apiConfig";
import BlogContentRenderer from "./BlogContentRenderer";

export default function BlogAdmin() {
    const [editingSlug, setEditingSlug] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("content");
    const [viewMode, setViewMode] = useState("split");
    const [uploading, setUploading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "Admin",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        readTime: "5 min read",
        category: "",
        image: "",
        imageAlt: "",
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        canonicalUrl: ""
    });

    const [blogs, setBlogs] = useState([]);
    
    const fetchBlogs = async () => {
        try {
            const res = await axios.get(apiUrl("/v1/blog/getAllBlogs"));
            if (res.data.success) {
                setBlogs(res.data.blogs);
            }
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const filteredBlogs = searchQuery.length >= 2
        ? blogs.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : blogs;

    const generateSlugFromTitle = (title) => {
        return title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    };

    const handleSlugChange = (e) => {
        const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
        setFormData((prev) => ({ ...prev, slug: sanitized }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleKeywordsChange = (e) => {
        const keywords = e.target.value.split(",").map(k => k.trim()).filter(k => k);
        setFormData((prev) => ({ ...prev, keywords }));
    };

    const handleEdit = (post) => {
        setFormData({
            title: post.title || "",
            slug: post.slug || post.id?.toString() || "",
            excerpt: post.excerpt || "",
            content: post.content || "",
            author: post.author || "Admin",
            date: post.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            readTime: post.readTime || "5 min read",
            category: post.category || "",
            image: post.imageUrl || "",
            imageAlt: post.imageAlt || "",
            metaTitle: post.metaTitle || "",
            metaDescription: post.metaDescription || "",
            keywords: post.keywords || [],
            canonicalUrl: post.canonicalUrl || ""
        });
        setEditingSlug(post._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const insertFormatting = (prefix, suffix = "") => {
        const textarea = document.querySelector('textarea[name="content"]');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        const selected = text.substring(start, end);
        const currentScrollTop = textarea.scrollTop;

        const newText = before + prefix + selected + suffix + after;
        setFormData(prev => ({ ...prev, content: newText }));

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
            textarea.scrollTop = currentScrollTop;
        }, 0);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const response = await axios.post(apiUrl("/v1/blog/uploadImage"), uploadData);
            if (response.data.url) {
                setFormData((prev) => ({ ...prev, image: response.data.url }));
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleMarkdownImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const alt = prompt("Enter image description (alt text):") || "";
        const uploadData = new FormData();
        uploadData.append("file", file);
        
        try {
            const response = await axios.post(apiUrl("/v1/blog/uploadImage"), uploadData);
            if (response.data.url) {
                insertFormatting(`![${alt}](${response.data.url})`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed.");
        }
        e.target.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.excerpt || !formData.category || !formData.content) {
            alert("Please fill in all required fields.");
            return;
        }

        const slug = formData.slug?.trim() ? formData.slug.trim() : generateSlugFromTitle(formData.title || "");

        const submitData = {
            title: formData.title,
            slug: slug,
            excerpt: formData.excerpt,
            content: formData.content,
            author: formData.author,
            date: formData.date,
            readTime: formData.readTime,
            category: formData.category,
            imageUrl: formData.image,
            metaTitle: formData.metaTitle,
            metaDescription: formData.metaDescription,
            keywords: formData.keywords,
            canonicalUrl: formData.canonicalUrl,
        };

        try {
            if (editingSlug) {
                await axios.put(apiUrl(`/v1/blog/updateBlog/${editingSlug}`), submitData);
                alert("Blog post updated successfully!");
                setEditingSlug(null);
            } else {
                await axios.post(apiUrl("/v1/blog/addBlog"), submitData);
                alert("Blog post added successfully!");
            }
            
            setFormData({
                title: "", slug: "", excerpt: "", content: "", author: "Admin", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), readTime: "5 min read", category: "", image: "", imageAlt: "", metaTitle: "", metaDescription: "", keywords: [], canonicalUrl: ""
            });
            fetchBlogs();
        } catch (error) {
            alert("Failed to save blog post. " + (error.response?.data?.message || error.message));
        }
    };

    const metaTitleLength = (formData.metaTitle || formData.title || "").length;
    const metaDescLength = (formData.metaDescription || formData.excerpt || "").length;

    return (
        <div className="admin-content" style={{ display: 'block', width: '100%' }}>
            <div className="admin-topbar mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', padding: '0 0 20px 0', borderBottom: '1px solid #e2e8f0', width: '100%' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{editingSlug ? "Edit Blog Post" : "Create New Post"}</h2>
                
                <div className="admin-action-btns" style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => setViewMode("edit")} className={`admin-preview-btn ${viewMode === 'edit' ? 'active' : ''}`} style={viewMode === 'edit' ? {backgroundColor: '#2563eb', color: '#fff', borderColor: '#2563eb'} : {}}>
                        <Edit3 size={14} style={{ marginRight: '5px' }} /> Edit
                    </button>
                    <button type="button" onClick={() => setViewMode("split")} className={`admin-preview-btn ${viewMode === 'split' ? 'active' : ''}`} style={viewMode === 'split' ? {backgroundColor: '#2563eb', color: '#fff', borderColor: '#2563eb'} : {}}>
                        Split
                    </button>
                    <button type="button" onClick={() => setViewMode("preview")} className={`admin-preview-btn ${viewMode === 'preview' ? 'active' : ''}`} style={viewMode === 'preview' ? {backgroundColor: '#2563eb', color: '#fff', borderColor: '#2563eb'} : {}}>
                        <Eye size={14} style={{ marginRight: '5px' }} /> Preview
                    </button>
                </div>
            </div>

            <div className="admin-tabs mb-4" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
                <button type="button" onClick={() => setActiveTab("content")} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: activeTab === 'content' ? '#2563eb' : '#64748b', borderBottom: activeTab === 'content' ? '2px solid #2563eb' : 'none', paddingBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Edit3 size={16} /> Content
                </button>
                <button type="button" onClick={() => setActiveTab("seo")} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: activeTab === 'seo' ? '#2563eb' : '#64748b', borderBottom: activeTab === 'seo' ? '2px solid #2563eb' : 'none', paddingBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Settings size={16} /> SEO & Metadata
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexDirection: viewMode === 'split' ? 'row' : 'column' }}>
                
                {/* Editor Panel */}
                {viewMode !== 'preview' && (
                    <div style={{ flex: '1', minWidth: '50%' }}>
                        <form className="admin-product-form" onSubmit={handleSubmit} style={{ margin: 0 }}>
                            {activeTab === 'content' && (
                                <div className="form-section">
                                    <h3 className="form-section-title">Blog Content</h3>
                                    <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div className="form-group full-width">
                                            <label>Title *</label>
                                            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Enter post title" />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                                            <div className="form-group">
                                                <label>Author</label>
                                                <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Admin" />
                                            </div>
                                            <div className="form-group">
                                                <label>Category *</label>
                                                <input type="text" name="category" value={formData.category} onChange={handleChange} required placeholder="e.g. Technology" />
                                            </div>
                                            <div className="form-group">
                                                <label>Read Time</label>
                                                <input type="text" name="readTime" value={formData.readTime} onChange={handleChange} placeholder="5 min read" />
                                            </div>
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Excerpt *</label>
                                            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} required rows="2" placeholder="Brief summary of the post"></textarea>
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Featured Image</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                                                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '5px', width: '100%' }} />
                                                {uploading && <span style={{ color: '#2563eb', fontWeight: '500' }}>Uploading...</span>}
                                            </div>
                                            {formData.image && (
                                                <div className="mt-3" style={{ position: 'relative', width: '200px', marginTop: '15px' }}>
                                                    <img src={formData.image} alt="preview" style={{ width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                                    <button type="button" onClick={() => setFormData({...formData, image: ''})} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={14} /></button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group full-width">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <label style={{ margin: 0 }}>Content *</label>
                                                <div style={{ display: 'flex', gap: '5px', background: '#f8fafc', padding: '5px', borderRadius: '5px', border: '1px solid #e2e8f0' }}>
                                                    <button type="button" onClick={() => insertFormatting("## ")} title="H2" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '5px', borderRadius: '3px' }} onMouseOver={(e) => e.target.style.background='#e2e8f0'} onMouseOut={(e) => e.target.style.background='none'}><Heading2 size={16} color="#64748b" /></button>
                                                    <button type="button" onClick={() => insertFormatting("### ")} title="H3" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '5px', borderRadius: '3px' }} onMouseOver={(e) => e.target.style.background='#e2e8f0'} onMouseOut={(e) => e.target.style.background='none'}><Heading3 size={16} color="#64748b" /></button>
                                                    <button type="button" onClick={() => insertFormatting("**", "**")} title="Bold" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '5px', borderRadius: '3px' }} onMouseOver={(e) => e.target.style.background='#e2e8f0'} onMouseOut={(e) => e.target.style.background='none'}><Bold size={16} color="#64748b" /></button>
                                                    <button type="button" onClick={() => insertFormatting("- ")} title="List" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '5px', borderRadius: '3px' }} onMouseOver={(e) => e.target.style.background='#e2e8f0'} onMouseOut={(e) => e.target.style.background='none'}><List size={16} color="#64748b" /></button>
                                                    <label title="Insert Image via Link" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px', borderRadius: '3px' }} onMouseOver={(e) => e.currentTarget.style.background='#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.background='none'}>
                                                        <ImageIcon size={16} color="#64748b" />
                                                        <input type="file" accept="image/*" onChange={handleMarkdownImageUpload} style={{ display: 'none' }} />
                                                    </label>
                                                    <button type="button" onClick={() => {
                                                        const url = prompt("Enter URL:");
                                                        if (url) insertFormatting("[", `](${url})`);
                                                    }} title="Link" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '5px', borderRadius: '3px' }} onMouseOver={(e) => e.target.style.background='#e2e8f0'} onMouseOut={(e) => e.target.style.background='none'}><LinkIcon size={16} color="#64748b" /></button>
                                                </div>
                                            </div>
                                            <textarea name="content" value={formData.content} onChange={handleChange} required rows={viewMode === 'split' ? '18' : '12'} placeholder="Write the full blog post content here..." style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6' }}></textarea>
                                            <small style={{ color: '#94a3b8', display: 'block', marginTop: '5px' }}>Markdown supported: ## H2, **bold**, - list, ![alt](url), [text](url)</small>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'seo' && (
                                <div className="form-section">
                                    <h3 className="form-section-title">SEO & Metadata</h3>
                                    <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div className="form-group full-width">
                                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Meta Title</span>
                                                <span style={{ color: metaTitleLength > 60 ? '#ef4444' : '#64748b', fontSize: '12px' }}>{metaTitleLength}/60</span>
                                            </label>
                                            <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} placeholder="Uses post title if left empty" />
                                        </div>
                                        <div className="form-group full-width">
                                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Meta Description</span>
                                                <span style={{ color: metaDescLength > 160 ? '#ef4444' : '#64748b', fontSize: '12px' }}>{metaDescLength}/160</span>
                                            </label>
                                            <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows="3" placeholder="Uses excerpt if left empty"></textarea>
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Keywords</label>
                                            <input type="text" name="keywords" value={formData.keywords?.join(", ") || ""} onChange={handleKeywordsChange} placeholder="e.g. fashion, styling, tips" />
                                            <small style={{ color: '#94a3b8', marginTop: '5px', display: 'block' }}>Comma separated</small>
                                        </div>
                                        <div className="form-group full-width">
                                            <label>URL Slug</label>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <input type="text" name="slug" value={formData.slug} onChange={handleSlugChange} placeholder="e.g. my-blog-post" style={{ flex: '1' }} />
                                                <button type="button" className="admin-preview-btn" onClick={() => setFormData(prev => ({ ...prev, slug: generateSlugFromTitle(prev.title || "") }))} style={{ whiteSpace: 'nowrap' }}>Auto Generate</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="form-actions" style={{ marginTop: '30px' }}>
                                <button type="submit" className="admin-submit-btn" style={{ padding: '12px 24px', fontSize: '16px' }}>
                                    <Save size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> 
                                    {editingSlug ? "Update Post" : "Publish Post"}
                                </button>
                                {editingSlug && (
                                    <button type="button" onClick={() => { setEditingSlug(null); setFormData({ title: "", slug: "", excerpt: "", content: "", author: "Admin", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), readTime: "5 min read", category: "", image: "", imageAlt: "", metaTitle: "", metaDescription: "", keywords: [], canonicalUrl: "" }); }} className="admin-delete-btn" style={{ marginLeft: '15px', padding: '12px 24px', fontSize: '16px' }}>
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/* Preview Panel */}
                {(viewMode === 'split' || viewMode === 'preview') && (
                    <div style={{ flex: '1', minWidth: '40%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '30px', background: '#fff', maxHeight: '1000px', overflowY: 'auto', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', marginBottom: '25px', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <Eye size={18} /> Live Preview
                        </div>
                        {formData.image && (
                            <img src={formData.image} alt="Featured" style={{ width: '100%', borderRadius: '12px', marginBottom: '25px', maxHeight: '400px', objectFit: 'cover' }} />
                        )}
                        {formData.category && (
                            <span style={{ display: 'inline-block', padding: '6px 12px', background: '#eff6ff', color: '#2563eb', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '15px' }}>{formData.category}</span>
                        )}
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px', color: '#0f172a', lineHeight: '1.2' }}>{formData.title || "Untitled Post"}</h1>
                        <div style={{ color: '#64748b', fontSize: '15px', marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '15px' }}>
                            <span style={{ fontWeight: '500', color: '#334155' }}>{formData.author || "Admin"}</span>
                            <span>•</span>
                            <span>{formData.date}</span>
                            {formData.readTime && (
                                <>
                                    <span>•</span>
                                    <span>{formData.readTime}</span>
                                </>
                            )}
                        </div>
                        <div style={{ color: '#334155', fontSize: '16px', lineHeight: '1.8' }}>
                            <BlogContentRenderer content={formData.content || "*Start writing to see your content here...*"} />
                        </div>
                    </div>
                )}
            </div>

            {/* Manage Blogs List */}
            <div className="admin-content" style={{ marginTop: '50px', padding: 0, border: 'none', background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="form-section-title" style={{ margin: 0 }}>Manage Existing Posts</h3>
                    <div style={{ position: 'relative' }}>
                        <SearchIcon size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                        <input type="text" placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '10px 15px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '250px', outline: 'none' }} />
                    </div>
                </div>

                <div className="admin-table-wrapper" style={{ borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <table className="admin-table" style={{ margin: 0 }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBlogs.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No posts found</td></tr>
                            ) : (
                                filteredBlogs.map((post) => (
                                    <tr key={post._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td>
                                            {post.imageUrl ? (
                                                <img src={post.imageUrl} alt="thumb" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                                            ) : (
                                                <div style={{ width: '60px', height: '60px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ImageIcon size={20} color="#cbd5e1" />
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ fontWeight: '600', color: '#0f172a', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</td>
                                        <td><span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', color: '#475569' }}>{post.category}</span></td>
                                        <td style={{ color: '#64748b', fontSize: '14px' }}>{post.date}</td>
                                        <td>
                                            <div className="admin-action-btns">
                                                <button className="admin-edit-btn" onClick={() => handleEdit(post)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Edit3 size={14} /> Edit</button>
                                                <button className="admin-delete-btn" onClick={async () => {
                                                    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
                                                         try {
                                                             await axios.delete(apiUrl(`/v1/blog/deleteBlog/${post._id}`));
                                                             fetchBlogs();
                                                         } catch {
                                                             alert("Failed to delete post.");
                                                         }
                                                    }
                                                }} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Trash2 size={14} /> Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
