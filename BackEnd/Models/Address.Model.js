const mongoose = require("mongoose");

const isValidIndianPostalCode = (postalCode) => /^[1-9]{1}[0-9]{5}$/.test(postalCode);

const singleAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, "Street address is required"],
    maxLength: [100, "Street address cannot exceed 100 characters"]
  },
  city: {
    type: String,
    required: [true, "City is required"],
    maxLength: [25, "City cannot exceed 25 characters"]
  },
  state: {
    type: String,
    required: [true, "State is required"],
    maxLength: [50, "State cannot exceed 50 characters"]
  },
  postalCode: {
    type: String,
    required: [true, "Postal code is required"],
    validate: {
      validator: isValidIndianPostalCode,
      message: "Postal code must be in a valid Indian format"
    }
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    maxLength: [50, "Country name cannot exceed 50 characters"]
  },
  additionalInformation: {
    type: String,
    maxLength: [100, "Additional information cannot exceed 100 characters"]
  },
  type: {
    type: String,
    enum: ["billing", "shipping"],
    required: [true, "Address type is required"]
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// User address model
const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  addresses: [singleAddressSchema]
}, { timestamps: true });

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);
module.exports = Address;