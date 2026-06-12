import React from 'react';

const BlogContentRenderer = ({ content }) => {
    const parseMarkdown = (text) => {
        if (!text) return '';
        let html = text
            // Headers
            .replace(/^#### (.*$)/gim, '<h4 class="fw-bold mt-3 mb-2">$1</h4>')
            .replace(/^### (.*$)/gim, '<h3 class="fw-bold mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="fw-bold mt-4 mb-3" style="font-size: 1.8rem;">$1</h2>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Images
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="img-fluid rounded my-3 w-100" />')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-info text-decoration-none">$1</a>')
            // Lists
            .replace(/^- (.*$)/gim, '<li class="ms-4 mb-1">$1</li>')
            // Paragraphs (lines that don't start with a tag)
            .replace(/^(?!<[hl])/gm, '<p class="mb-3" style="line-height: 1.8; color: #b6bcc6;">')
            .replace(/$/gm, '</p>');
            
        return html;
    };

    return (
        <div 
            className="blog-renderer-content" 
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} 
        />
    );
};

export default BlogContentRenderer;
