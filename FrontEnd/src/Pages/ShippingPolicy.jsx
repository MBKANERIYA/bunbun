import React, { useEffect } from "react";

const ShippingPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container bg-white rounded shadow p-4 p-md-5">
        <h1 className="fw-bold mb-3">Shipping Policy</h1>
        <p className="text-muted mb-4">Last updated: June 15, 2026</p>

        <p>This shipping policy explains how bunbun clothing operates its shipping procedures and how we strive to meet your expectations with every order. Whether you’re a first-time buyer or a returning customer, we want to ensure that your experience with us is smooth and satisfactory, right from placing your order to the moment it arrives at your doorstep. This policy has been created with the help of the shipping policy generator (<a href="https://www.websitepolicies.com/shipping-policy-generator" target="_blank" rel="noopener noreferrer">https://www.websitepolicies.com/shipping-policy-generator</a>).</p>

        <h2 className="h4 fw-semibold mt-5 mb-3">Shipping and Delivery Options</h2>
        <p>We offer a variety of shipping options to suit the needs of our customers.</p>

        <h3 className="h5 fw-semibold mt-4 mb-2">Free Shipping</h3>
        <p>As part of our commitment to an exceptional shopping experience, we are pleased to offer free shipping.</p>

        <h3 className="h5 fw-semibold mt-4 mb-2">Shipping Methods</h3>
        <p>We offer simple shipping method to suit the needs of our customers:</p>
        <ul>
          <li><strong>Standard:</strong> 5 to 7 days</li>
        </ul>

        <p className="mt-4">We strive for a swift preparation process and orders are typically processed and dispatched within 3 to 5 days so that customers can receive their items promptly.</p>
        <p>In certain situations, we may collaborate with a third-party supplier who might handle our inventory and take charge of shipping your products.</p>

        <h2 className="h4 fw-semibold mt-5 mb-3">Contact Information</h2>
        <p>If you have any questions or concerns regarding our shipping policy, we encourage you to contact us using the details below:</p>
        <ul>
          <li><a href="mailto:clothingbunbun@gmail.com">clothingbunbun@gmail.com</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ShippingPolicy;