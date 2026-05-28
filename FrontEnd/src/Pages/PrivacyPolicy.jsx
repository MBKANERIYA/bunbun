import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-6">Last updated: <strong>October 14, 2025</strong></p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            At <strong>Navdhaaga</strong>, we value your privacy and are committed to
            protecting your personal information. This Privacy Policy explains how
            we collect, use, and protect your data when you visit our website or use
            our services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Personal details</strong> – name, email address, phone number, shipping/billing address.</li>
            <li><strong>Payment information</strong> – only processed through secure payment gateways.</li>
            <li><strong>Usage data</strong> – including IP address, browser type, device information, and site activity.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To process and deliver your orders.</li>
            <li>To provide customer support and respond to inquiries.</li>
            <li>To personalize your shopping experience and improve our services.</li>
            <li>To send marketing and promotional communications (only if you opt in).</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Sharing Your Information</h2>
          <p>
            We do not sell your personal data. We may share your information only
            with trusted third-party partners such as payment processors, shipping
            companies, and analytics providers to help operate our business
            effectively.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal data from unauthorized access, alteration, or
            destruction. However, no method of transmission over the internet is
            100% secure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Cookies</h2>
          <p>
            We use cookies to enhance your browsing experience, analyze site traffic,
            and understand user behavior. You can control cookie preferences through
            your browser settings.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access and obtain a copy of your data.</li>
            <li>Request correction or deletion of your information.</li>
            <li>Withdraw consent to data processing at any time.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Third-Party Services</h2>
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices of those websites. We encourage
            you to read their privacy policies before providing any information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be
            posted on this page with an updated revision date.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
          <p>
            For questions or concerns about this Privacy Policy, please contact us
            at:
            <a href="mailto:privacy@navdhaaga.com" className="text-blue-600 underline ml-1">
              privacy@navdhaaga.com
            </a>
          </p>
        </section>

        <p className="text-gray-500 text-sm mt-8">
          This Privacy Policy is provided for informational purposes only and does
          not constitute legal advice. Please consult a qualified attorney for legal
          guidance.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
