import React, { useEffect } from "react";

const ReturnPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container bg-white rounded shadow p-4 p-md-5">
        <h1 className="fw-bold mb-3">Return and Exchange Policy</h1>
        <p className="text-muted mb-4">Last updated: June 15, 2026</p>

        <p>Thank you for shopping at bunbun clothing.</p>
        <p>If, for any reason, You are not completely satisfied with a purchase, We invite You to review our Return and Exchange Policy.</p>
        <p>The following terms are applicable for any products that You purchased with Us.</p>

        <h2 className="h4 fw-semibold mt-5 mb-3">Interpretation and Definitions</h2>
        
        <h3 className="h5 fw-semibold mt-4 mb-2">Interpretation</h3>
        <p>The words whose initial letters are capitalized have meanings defined under the following conditions. These definitions shall have the same meaning regardless of whether they appear in singular or plural.</p>

        <h3 className="h5 fw-semibold mt-4 mb-2">Definitions</h3>
        <p>For the purposes of this Return and Exchange Policy:</p>
        <ul className="mb-4">
          <li className="mb-2"><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot;) refers to bunbun clothing, C-WING 6129 TO 6131, 6092-6094 AVADH RITURAJ TEXTILE HUB, OPP. MIDAS SQUARE, GODADARA, SURAT.</li>
          <li className="mb-2"><strong>Goods</strong> refer to the items offered for sale on the Service.</li>
          <li className="mb-2"><strong>Orders</strong> mean a request by You to purchase Goods from Us.</li>
          <li className="mb-2"><strong>Service</strong> refers to the Website.</li>
          <li className="mb-2"><strong>Website</strong> refers to bunbun clothing, accessible from <a href="https://bunbunclothing.store/" target="_blank" rel="noopener noreferrer">https://bunbunclothing.store/</a>.</li>
          <li className="mb-2"><strong>You</strong> means the individual accessing or using the Service, or the company or other legal entity on behalf of which such individual is accessing or using the Service.</li>
        </ul>

        <h2 className="h4 fw-semibold mt-5 mb-3">Return &amp; Exchange Rights</h2>
        <p>You may request a return or exchange only if the product received is damaged or defective.</p>
        <p>The request must be made within 7 days from the date You received the Goods.</p>
        <p>To request a return or exchange, You must contact Us with your Order details and clear photos/videos of the damaged product.</p>
        <p>You can contact Us:</p>
        <ul>
          <li>By email: <a href="mailto:clothingbunbun@gmail.com">clothingbunbun@gmail.com</a></li>
          <li>By visiting: <a href="https://bunbunclothing.store/" target="_blank" rel="noopener noreferrer">https://bunbunclothing.store/</a></li>
          <li>By phone: 07984371199</li>
        </ul>

        <h2 className="h4 fw-semibold mt-5 mb-3">No Refund Policy</h2>
        <p>bunbun clothing does not offer refunds for any orders.</p>
        <p>Only replacement or exchange of damaged or defective products will be provided after verification by our team.</p>

        <h2 className="h4 fw-semibold mt-5 mb-3">Conditions for Returns &amp; Exchanges</h2>
        <p>To be eligible for a return or exchange:</p>
        <ul>
          <li>The Goods must have been purchased within the last 7 days.</li>
          <li>The Goods must be unused, unwashed, and in their original packaging with tags intact.</li>
          <li>The product must be damaged or defective upon delivery.</li>
        </ul>

        <h2 className="h4 fw-semibold mt-5 mb-3">The Following Goods Cannot Be Returned or Exchanged</h2>
        <ul>
          <li>Products returned due to change of mind.</li>
          <li>Wrong size selected by the customer.</li>
          <li>Color preference issues.</li>
          <li>Personalized or customized products.</li>
          <li>Sale or discounted products.</li>
          <li>Products that have been used, washed, altered, or damaged after delivery by the customer.</li>
        </ul>
        <p className="mt-3">We reserve the right to refuse any return or exchange request that does not meet the above conditions.</p>

        <h2 className="h4 fw-semibold mt-5 mb-3">Returning Goods</h2>
        <p>Customers are responsible for safely returning the approved product to Us if requested by our support team.</p>
        <p>We recommend using a trackable shipping service, as We cannot be held responsible for products lost or damaged during return transit.</p>

        <h2 className="h4 fw-semibold mt-5 mb-3">Gifts</h2>
        <p>If the Goods were marked as a gift and are received in a damaged condition, an exchange or replacement may be provided after verification. No cash refund or gift refund will be issued.</p>

        <h2 className="h4 fw-semibold mt-5 mb-3">Contact Us</h2>
        <p>If You have any questions about our Return and Exchange Policy, please contact Us:</p>
        <ul>
          <li>Email: <a href="mailto:clothingbunbun@gmail.com">clothingbunbun@gmail.com</a></li>
          <li>Website: <a href="https://bunbunclothing.store/" target="_blank" rel="noopener noreferrer">https://bunbunclothing.store/</a></li>
          <li>Phone: 07984371199</li>
        </ul>
      </div>
    </div>
  );
};

export default ReturnPolicy;