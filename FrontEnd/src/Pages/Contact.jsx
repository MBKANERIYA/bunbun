import React from "react";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";

const ContactUs = () => {
  const slogens = [
    "India's Most Affordable Fashion",
  ];
  return (
    <>
      <div className="slider">
        <div className="slide-track">
          
            <div className="slide">
              <p>India's Most Affordable Fashion</p>
            </div>
         
        </div>
      </div>
      <section className="contact-container">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">
          Questions or concerns? We're just a message away
        </p>

        <div className="contact-card-wrapper">
          {/* Call Card */}
          <div className="contact-card">
            <div className="contact-left">
              <div className="contact-icon call-icon">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="contact-heading">Call</h3>
                <p className="contact-timing">
                  10:30 AM – 6:30 PM | Monday to Saturday
                </p>
              </div>
            </div>
            <ArrowRight className="arrow-icon" size={20} />
          </div>

          {/* WhatsApp Card */}
          <div className="contact-card">
            <div className="contact-left">
              <div className="contact-icon whatsapp-icon">
                <MessageCircle size={22} />
              </div>
              <div>
                <h3 className="contact-heading">WhatsApp Us</h3>
                <p className="contact-timing">
                  10:30 AM – 6:30 PM | Monday to Saturday
                </p>
              </div>
            </div>
            <ArrowRight className="arrow-icon" size={20} />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
