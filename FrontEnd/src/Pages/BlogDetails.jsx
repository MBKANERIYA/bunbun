import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../utils/apiConfig';
import BlogContentRenderer from '../Component/BlogContentRenderer';

const BlogDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSingleBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl(`/v1/blog/getSingleBlog/${id}`));
        if (response.data.success) {
          setPost(response.data.blog);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-5 text-center my-5">
        <h2 className="fw-bold mt-5">Blog post not found</h2>
        <Link to="/blog" className="btn btn-dark mt-3">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Link to="/blog" className="text-decoration-none text-muted mb-4 d-inline-block">
            &larr; Back to all blogs
          </Link>
          
          <div className="mb-4">
            <span className="badge bg-light text-dark border px-2 py-1 mb-3">{post.category}</span>
            <h1 className="fw-bold mb-3" style={{ color: '#2c3e50', fontSize: '2.5rem' }}>{post.title}</h1>
            <div className="d-flex align-items-center gap-2 text-muted fw-medium">
              {post.author && <span>{post.author}</span>}
              {post.author && <span>•</span>}
              <span>Published on {post.date}</span>
              {post.readTime && <span>•</span>}
              {post.readTime && <span>{post.readTime}</span>}
            </div>
          </div>
          
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="img-fluid rounded-4 mb-5 shadow-sm" 
            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} 
          />
          
          <div className="blog-content" style={{ fontSize: '1.1rem', color: '#4a5568' }}>
            <BlogContentRenderer content={post.content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
