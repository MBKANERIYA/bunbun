import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-gray-800 container pb-5 ps-5 pe-5">
      <h1 className="text-4xl font-bold mb-6 text-center text-rose-700">About Bunbun Clothing</h1>
      <p className="text-lg leading-relaxed mb-8 text-center">
        Welcome to <span className="font-semibold text-rose-600">Bunbun Clothing</span> — where tradition meets elegance. We are more than just a saree brand; we are a celebration of India’s timeless artistry, weaving together heritage, culture, and modern sophistication in every drape.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3 text-rose-700">Our Story</h2>
        <p className="text-gray-700 leading-relaxed">
          Founded with a deep passion for Indian textiles, Bunbun Clothing began its journey to revive the essence of handcrafted sarees that tell stories of generations. Each piece is meticulously crafted by skilled artisans from across India, preserving regional weaving traditions and techniques that have stood the test of time.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3 text-rose-700">Our Philosophy</h2>
        <p className="text-gray-700 leading-relaxed">
          At Bunbun Clothing, we believe that a saree is not just a garment — it’s an emotion, a connection to roots, and an expression of individuality. Our mission is to blend traditional craftsmanship with contemporary aesthetics, creating sarees that appeal to women of all ages and occasions.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3 text-rose-700">Sustainability & Craftsmanship</h2>
        <p className="text-gray-700 leading-relaxed">
          Every Bunbun Clothing saree is a promise of authenticity and sustainability. We work closely with local weavers and craftspeople, ensuring fair trade practices and eco-friendly production methods. From handloom silks to organic cottons, our materials are thoughtfully chosen to reflect our respect for nature and people.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3 text-rose-700">Our Promise</h2>
        <p className="text-gray-700 leading-relaxed">
          Whether you’re seeking elegance for a festive occasion or timeless grace for everyday wear, Bunbun Clothing brings you sarees that embody quality, comfort, and beauty. Every weave carries the soul of our artisans and the spirit of India’s diverse culture.
        </p>
      </section>

      <p className="text-center text-gray-600 mt-10 italic">
        “Drape your story in Bunbun Clothing — the thread that connects tradition to today.”
      </p>
    </div>
  );
};

export default AboutUs;