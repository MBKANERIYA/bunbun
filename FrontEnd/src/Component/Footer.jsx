import React from "react";
import { FaFacebookF, FaPinterestP, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white pt-5 pb-4 mt-4">
      <div className="container">
        <div className="row text-start">

          {/* Popular Searches */}
          {/* <div className="col-md-3 col-sm-6 mb-4">
            <h6 className="fw-bold mb-3">POPULAR SEARCHES</h6>
            <ul className="list-unstyled">
              <a href="/">Sudathi Gold</a>
              <a href="/">Silk Saree Sale</a>
              <a href="/">Ready To Wear Sarees</a>
              <a href="/">Shark Tank Sale</a>
              <a href="/">Mouni Roy Sarees</a>
            </ul>
          </div> */}

          {/* Information */}
          <div className="col-6 col-md-2 mb-4">
            <h6 className="fw-bold mb-3">INFORMATION</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <Link to="/blog" className="text-white text-decoration-none">Blogs</Link>
              <Link to="/about" className="text-white text-decoration-none">About Us</Link>
              <Link to="/" className="text-white text-decoration-none">FAQs</Link>
              <Link to="/privacy-policy" className="text-white text-decoration-none">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="text-white text-decoration-none">Terms of Service</Link>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="col-6 col-md-3 mb-4">
            <h6 className="fw-bold mb-3">CUSTOMER CARE</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <Link to="/contact" className="text-white text-decoration-none">Contact Us</Link>
              <Link to="/return-policy" className="text-white text-decoration-none">Return Policy</Link>
              <Link to="/shipping-policy" className="text-white text-decoration-none">Shipping Policy</Link>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="col-md-4 col-sm-6 mb-4">
            <h6 className="fw-bold mb-3">GET IN TOUCH</h6>
            <p className="mb-1 fw-bold">BUNBUN CLOTHING</p>
            <p className="mb-1">Working Hours: <br />10:30 AM - 7:00 PM (Monday–Saturday)</p>
            <p className="mb-1 fw-bold">Whatsapp Us : &nbsp;&nbsp;<span>9276569990</span></p>
            <p className="fw-bold">Call Us : &nbsp;&nbsp;<span>9276569990</span></p>
          </div>

        </div>

        {/* Newsletter */}
        <div className="row my-4">
          <div className="col-md-6">
            <h6 className="fw-bold">SUBSCRIBE OUR NEWSLETTER</h6>
            <div className="input-group mt-2" style={{ borderRadius: "0", padding: "0", border: "none" }}>
              <input type="email" placeholder="Enter email here" className="form-controll" style={{ padding: "13px" }} />
              <button className="btn btn-light" style={{ background: "#333333", color: "white" }}>→</button>
            </div>
            <small className="text-white-50">Get Updates About Latest Offers</small>
          </div>

          {/* Social Icons */}
          <div className="col-md-6 d-flex align-items-end justify-content-md-end mt-3 mt-md-0">
            <div className="d-flex gap-3">
              <FaFacebookF size={20} />
              <FaPinterestP size={20} />
              <FaInstagram size={20} />
              <FaLinkedinIn size={20} />
              <FaYoutube size={20} />
            </div>
          </div>
        </div>

        {/* Category Links */}
        <div className="mt-4 pt-3 border-top border-white">
          <p className="small text-white-50">
            Saree | Blouses | Shapewear | Sudathi Gold | Sarees Saturday | Silk Saree Sale | Shark Tank Sarees Sale | Bestseller Saree Sale | Summer Saree Sale | Monsoon Sale | Festive Sarees Sale | Rakshabandhan Sale | Ganesh Chaturthi Sale | Republic Day Sale | Wedding Sale | Year End Sale | Makar Sankranti Sale | Onam Sarees Sale | Sarees Starting 599 | Premium Sarees | Wedding Collection | Ready To Wear Sarees | Pre Stitched Sarees | 1 Minute Saree | Banarasi Sarees | Kanjivaram Sarees | Paithani Sarees | Daily Wear Sarees | Party Wear Sarees | Sequence Sarees | Swarovski Sarees | Embellished Sarees | Embroidery Sarees | Budget Sarees | Cotton Sarees | Georgette Sarees | Linen Sarees | Satin Sarees | Printed Sarees | Woven Sarees | Bandhani Sarees | Celebrity Sarees | Floral Sarees Sale | Clearance Sale
          </p>
        </div>

        {/* App Download Button */}

      </div>
    </footer>
  );
};

export default Footer;
