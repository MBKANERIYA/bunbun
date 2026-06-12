import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../utils/apiConfig';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(apiUrl("/v1/blog/getAllBlogs"));
        if (response.data.success) {
          setBlogPosts(response.data.blogs);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 my-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 my-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: '#2c3e50' }}>Our Latest Blogs</h1>
        <p className="text-muted">Discover trends, styling tips, and industry insights from Bunbun Clothing.</p>
      </div>

      <div className="row g-4">
        {blogPosts.map((post) => (
          <div key={post.id} className="col-md-6 col-lg-4">
            <Link to={`/blog/${post.id}`} className="text-decoration-none text-dark">
              <div 
                className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden" 
                style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }} 
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                }} 
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
                }}
              >
                <img src={post.imageUrl} className="card-img-top" alt={post.title} style={{ height: '240px', objectFit: 'cover' }} />
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-light text-dark border px-2 py-1">{post.category}</span>
                    <small className="text-muted fw-medium">{post.date}</small>
                  </div>
                  <h5 className="card-title fw-bold mt-2 mb-3" style={{ lineHeight: '1.4' }}>{post.title}</h5>
                  <p className="card-text text-muted mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1 }}>
                    {post.excerpt}
                  </p>
                  <div className="mt-auto">
                    <button className="btn btn-outline-dark rounded-pill px-4 fw-medium w-100" style={{ padding: '10px' }}>Read Full Article</button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;