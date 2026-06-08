import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaHome } from "react-icons/fa";
import DetailedSummary from "./OrderSummery";
import { apiUrl } from "../utils/apiConfig";

import { getAuthUserId } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const AddAddress = () => {
  const userId = getAuthUserId();
  const navigate = useNavigate();
  const isGuest = !userId;

  const [showForm, setShowForm] = useState(isGuest); // Auto-open form for guests
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Guest info fields
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

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

  // Fetch last 3 addresses (only for logged-in users)
  const fetchAddresses = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(apiUrl(`/v1/address/getAdd/${userId}`));
      const all = res.data.addresses || [];
      const lastFive = all.slice(-3).reverse();
      setAddresses(lastFive);

      // Auto-select default address if available
      const defaultAddr = lastFive.find((a) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      } else if (lastFive.length > 0) {
        setSelectedAddress(lastFive[0]);
      }
    } catch (error) {
      console.error("❌ Error fetching addresses:", error);
      setAddresses([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setAddress({ ...address, isDefault: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isGuest) {
      // Validate guest fields
      if (!guestName.trim()) {
        alert("Please enter your full name.");
        return;
      }
      if (!guestPhone.trim() || guestPhone.trim().length < 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }

      // For guests, just use the address locally (don't save to DB)
      const guestAddress = {
        ...address,
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
      };
      setSelectedAddress(guestAddress);
      setShowForm(false);
      return;
    }

    // Logged-in user: save address to DB
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
          <h2 className="m-0">{isGuest ? "Delivery Details" : "Add a New Address"}</h2>
          {!isGuest && (
            <button
              className="toggle-btn btn btn-outline-dark"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? <><FaTimes /> Close</> : <><FaPlus /> Add</>}
            </button>
          )}
        </div>

        {/* Select Existing Address Dropdown (logged-in only) */}
        {!isGuest && !showForm && addresses.length > 0 && (
          <div className="ms-4 me-4 mt-4">
            <label htmlFor="selectAddress" className="form-label fw-semibold">Select an Address</label>
            <select
              id="selectAddress"
              className="form-select"
              value={selectedAddress ? selectedAddress.street : ""}
              onChange={(e) => {
                const addr = addresses.find(a => a.street === e.target.value);
                setSelectedAddress(addr || null);
              }}
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

        {/* Address Form */}
        {showForm && (
          <div className="address-form-container pb-0">
            <form onSubmit={handleSubmit} className="address-form">

              {/* Guest-only: Name & Phone fields */}
              {isGuest && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="guestName">Full Name <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        id="guestName"
                        name="guestName"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g., Priya Sharma"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="guestPhone">Mobile Number <span style={{ color: 'red' }}>*</span></label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#555' }}>+91</span>
                        <input
                          type="tel"
                          id="guestPhone"
                          name="guestPhone"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="e.g., 9876543210"
                          maxLength={10}
                          required
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                  <hr style={{ margin: '10px 0 15px', borderColor: '#eee' }} />
                </>
              )}

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

              {!isGuest && (
                <>
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
                </>
              )}

              <button type="submit" className="submit-btn">
                {isGuest ? "Use This Address" : "Add Address"}
              </button>
            </form>
          </div>
        )}

        {/* Show selected guest address confirmation */}
        {isGuest && !showForm && selectedAddress && (
          <div className="saved-addresses ms-4 me-4 mt-4">
            <div
              className="address-card d-flex align-items-start p-3 mb-3 rounded border border-dark"
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <FaHome className="address-icon me-3 mt-1" size={22} color="#6c757d" />
              <div className="address-info">
                <p className="mb-1"><strong>{selectedAddress.guestName}</strong></p>
                <p className="mb-1">📞 +91 {selectedAddress.guestPhone}</p>
                <p className="mb-1">{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}</p>
                <p className="mb-1">{selectedAddress.country} - {selectedAddress.postalCode}</p>
                {selectedAddress.additionalInformation && <p className="text-muted">{selectedAddress.additionalInformation}</p>}
              </div>
            </div>
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={() => setShowForm(true)}
            >
              Edit Details
            </button>
          </div>
        )}

        {/* Show Saved Addresses (logged-in users only) */}
        {!isGuest && !showForm && (
          <div className="saved-addresses ms-4 me-4 mt-4">
            {addresses.length > 0 ? (
              <div className="address-list">
                {addresses.map((addr, i) => (
                  <div
                    className={`address-card d-flex align-items-start p-3 mb-3 rounded ${
                      selectedAddress && selectedAddress.street === addr.street ? "border border-dark" : "border border-light"
                    }`}
                    key={i}
                    onClick={() => setSelectedAddress(addr)}
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
        <DetailedSummary selectedAddress={selectedAddress} isGuest={isGuest} />
      </div>
    </div>
  );
};

export default AddAddress;
