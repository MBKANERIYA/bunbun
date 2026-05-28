import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../utils/apiConfig";

const EditProfile = () => {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    gender: "",
    dateOfBirth: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Get user ID from localStorage when component mounts
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authToken"));
    if (authData && authData.user) {
      setUserId(authData.user._id);
      console.log("User ID:", authData.user._id);
    }
  }, []);

  // ✅ Fetch user data once userId is available
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(apiUrl(`/v1/User/userProfile/${userId}`));
        console.log("rrrrrrr",res);
        setFormData({
          fullName: res.data.user.fullName || "",
          mobileNumber: res.data.user.mobileNumber || "",
          gender: res.data.user.gender || "",
          dateOfBirth: res.data.user.dateOfBirth
            ? res.data.user.dateOfBirth.split("T")[0]
            : ""
        });

        
    } catch (err) {
        console.error("Error fetching user:", err);
    }
};
fetchUser();
}, [userId]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("User not found");

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        apiUrl(`/v1/User/updateUser/${userId}`),
        formData
      );
      setMessage("✅ Profile updated successfully!");
      console.log("Updated User:", res.data.user);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mobile Number
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
          />
        </label>

        <label>
          Gender
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default EditProfile;
