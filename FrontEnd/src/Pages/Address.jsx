import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaHome } from "react-icons/fa";
import DetailedSummary from "./OrderSummery";
import { apiUrl } from "../utils/apiConfig";

const AddAddress = () => {
  const userId = "6892e8456c2cbf8ecb95c1ea";
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    additionalInformation: "",
    type: "shipping",
    isDefault: false,
  });

  // Fetch last 5 addresses
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(apiUrl(`/v1/address/getAdd/${userId}`));
      const all = res.data.addresses || [];
      const lastFive = all.slice(-3).reverse();
      setAddresses(lastFive);

      // Auto-select default address if available
      const defaultAddr = lastFive.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.street);
    } catch (error) {
      console.error("❌ Error fetching addresses:", error);
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setAddress({ ...address, isDefault: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { userId, address };
      await axios.post(apiUrl("/v1/address/add"), payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert("✅ Address added successfully!");
      setShowForm(false);
      setAddress({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        additionalInformation: "",
        type: "shipping",
        isDefault: false,
      });
      fetchAddresses(); // refresh list
    } catch (error) {
      console.error("❌ Error adding address:", error);
      alert("Failed to add address.");
    }
  };

  return (
    <div className="row" style={{ background: "#f5f7fa", minHeight : "100vh" }}>
      <div className="address-page col-6">

        {/* Header with fixed Add button */}
        <div
          className="address-header address-card ms-4 me-4 mt-4 d-flex justify-content-between align-items-center"
          style={{
            position: "sticky",
            top : 0,
            background: "#fff",
            zIndex: 10,
            padding: "10px 20px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 className="m-0">Add a New Address</h2>
          <button
            className="toggle-btn btn btn-outline-dark"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <><FaTimes /> Close</> : <><FaPlus /> Add</>}
          </button>
        </div>

        {/* Select Existing Address Dropdown */}
        {!showForm && addresses.length > 0 && (
          <div className="ms-4 me-4 mt-4">
            <label htmlFor="selectAddress" className="form-label fw-semibold">Select an Address</label>
            <select
              id="selectAddress"
              className="form-select"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            >
              <option value="">-- Choose Address --</option>
              {addresses.map((addr, i) => (
                <option key={i} value={addr.street}>
                  {addr.street}, {addr.city}, {addr.state}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Collapsible Add Form */}
        {showForm && (
          <div className="address-form-container pb-0">
            <form onSubmit={handleSubmit} className="address-form">
              <div className="form-group">
                <label htmlFor="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  placeholder="e.g., 123 MG Road"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    placeholder="e.g., Maharashtra"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleChange}
                    placeholder="e.g., 400001"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    placeholder="e.g., India"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="additionalInformation">Additional Info</label>
                <textarea
                  id="additionalInformation"
                  name="additionalInformation"
                  value={address.additionalInformation}
                  onChange={handleChange}
                  placeholder="e.g., Near Metro Station"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Address Type</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="shipping"
                      checked={address.type === "shipping"}
                      onChange={handleChange}
                    />
                    Shipping
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="billing"
                      checked={address.type === "billing"}
                      onChange={handleChange}
                    />
                    Billing
                  </label>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={address.isDefault}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="isDefault">Set as default address</label>
              </div>

              <button type="submit" className="submit-btn">Add Address</button>
            </form>
          </div>
        )}

        {/* Show Saved Addresses */}
        {!showForm && (
          <div className="saved-addresses ms-4 me-4 mt-4">
            {addresses.length > 0 ? (
              <div className="address-list">
                {addresses.map((addr, i) => (
                  <div
                    className={`address-card d-flex align-items-start p-3 mb-3 rounded ${
                      selectedAddress === addr.street ? "border border-dark" : "border border-light"
                    }`}
                    key={i}
                    onClick={() => setSelectedAddress(addr.street)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      transition: "0.3s",
                    }}
                  >
                    <FaHome className="address-icon me-3 mt-1" size={22} color="#6c757d" />
                    <div className="address-info">
                      <p className="mb-1"><strong>{addr.type?.toUpperCase()}</strong></p>
                      <p className="mb-1">{addr.street}, {addr.city}, {addr.state}</p>
                      <p className="mb-1">{addr.country} - {addr.postalCode}</p>
                      {addr.additionalInformation && <p className="text-muted">{addr.additionalInformation}</p>}
                      {addr.isDefault && <span className="badge bg-dark">Default</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-address text-center">No addresses found.</p>
            )}
          </div>
        )}
      </div>

      {/* Right Column — Order Summary */}
      <div className="col-6">
        <DetailedSummary selectedAddress={selectedAddress} />
      </div>
    </div>
  );
};

export default AddAddress;
