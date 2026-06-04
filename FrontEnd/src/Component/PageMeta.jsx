import { useEffect } from 'react';

/**
 * SEO component that sets the document title and meta description.
 * Usage: <PageMeta title="About Us" description="Learn about Bunbun Clothing" />
 */
const PageMeta = ({ title, description }) => {
    useEffect(() => {
        const suffix = 'Bunbun Clothing';
        document.title = title ? `${title} | ${suffix}` : suffix;

        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = description;
        }

        // Cleanup: reset title on unmount
        return () => {
            document.title = suffix;
        };
    }, [title, description]);

    return null;
};

export default PageMeta;
