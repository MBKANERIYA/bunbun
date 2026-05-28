import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-gray-500 mb-6">Last updated: <strong>October 14, 2025</strong></p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our website or services, you confirm that you have
            read, understood, and agreed to be bound by these Terms. If you do not
            agree with any part of the Terms, you must not use our services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Changes to Terms</h2>
          <p>
            We may modify these Terms from time to time. When we make changes, we
            will update the "Last updated" date above. Your continued use of the
            service after the changes become effective constitutes acceptance of
            the new Terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Use of the Service</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Violate any local, national or international law or regulation.</li>
            <li>Infringe the intellectual property rights of others.</li>
            <li>Transmit malware, spam or other harmful content.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Account Registration</h2>
          <p>
            To access certain features you may be required to create an account.
            You are responsible for maintaining the confidentiality of your account
            credentials and for all activity that occurs under your account.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Orders, Pricing & Payments</h2>
          <p>
            All orders placed through our platform are subject to acceptance and
            availability. Prices may change at any time. Payment processing is
            handled by third-party providers — by using such payment methods you
            agree to their terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Intellectual Property</h2>
          <p>
            All content on the site — text, images, logos, graphics, and software —
            is owned or licensed by <strong>Navdhaaga</strong>. You may not copy,
            reproduce, modify, or distribute any part of the site without our prior
            written consent.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Disclaimer of Warranties</h2>
          <p>
            To the maximum extent permitted by law, the service is provided "as is"
            and "as available" without warranties of any kind. We disclaim all
            warranties, whether express or implied, including merchantability,
            fitness for a particular purpose, and non-infringement.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Limitation of Liability</h2>
          <p>
            Except where prohibited by law, Navdhaaga and its affiliates, suppliers,
            and licensors shall not be liable for any indirect, incidental, special,
            consequential or punitive damages, or any loss of profits or revenues,
            whether incurred directly or indirectly.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Privacy</h2>
          <p>
            Our <a href="/privacyPolicy" className="text-blue-600 underline">Privacy Policy</a>
            explains how we collect, use and share your personal information. By
            using our services you consent to our privacy practices described there.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Third-Party Links & Services</h2>
          <p>
            We may provide links to third-party websites and services for your
            convenience. Navdhaaga does not endorse and is not responsible for those
            third parties' content or practices.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">11. Termination</h2>
          <p>
            We may suspend or terminate your access to the service at our
            discretion, without notice, for conduct that we believe violates these
            Terms or is harmful to other users or us.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">12. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of
            India, without regard to conflict of law principles.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">13. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <a href="mailto:legal@navdhaaga.com" className="text-blue-600 underline ml-1">
              legal@navdhaaga.com
            </a>
          </p>
        </section>

        <p className="text-gray-500 text-sm mt-8">
          This Terms & Conditions document is provided for informational purposes
          only and does not constitute legal advice. Please consult a qualified
          attorney for legal guidance.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;