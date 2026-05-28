const { default: mongoose } = require("mongoose");
const { addressModel, userSchema } = require("../Models");

exports.addAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;

    if (!userId || !address) {
      return res.status(400).json({ message: "User ID and address are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const userExists = await userSchema.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    let userAddresses = await addressModel.findOne({ userId });

    if (!userAddresses) {
      userAddresses = new addressModel({
        userId,
        addresses: [address]
      });
    } else {
      const isDuplicate = userAddresses.addresses.some((addr) => {
        return (
          addr.street.trim().toLowerCase() === address.street.trim().toLowerCase() &&
          addr.city.trim().toLowerCase() === address.city.trim().toLowerCase() &&
          addr.state.trim().toLowerCase() === address.state.trim().toLowerCase() &&
          addr.postalCode === address.postalCode &&
          addr.country.trim().toLowerCase() === address.country.trim().toLowerCase() &&
          (addr.additionalInformation || "").trim().toLowerCase() === (address.additionalInformation || "").trim().toLowerCase() &&
          addr.type === address.type
        );
      });

      if (isDuplicate) {
        return res.status(409).json({ message: "This address already exists" });
      }

      // 6️⃣ Push new address
      userAddresses.addresses.push(address);
    }

    await userAddresses.save();

    return res.status(201).json({
      message: "Address added successfully",
      data: userAddresses
    });

  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const userExists = await userSchema.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userAddresses = await addressModel.findOne({ userId });

    if (!userAddresses || userAddresses.addresses.length === 0) {
      return res.status(404).json({ message: "No addresses found for this user" });
    }

    return res.status(200).json({
      message: "Addresses retrieved successfully",
      count: userAddresses.addresses.length,
      addresses: userAddresses.addresses
    });

  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};


// Update a specific address
exports.updateAddress = async (req, res) => {
  try {
    const { userId, addressId, updatedData } = req.body;

    if (!userId || !addressId || !updatedData) {
      return res.status(400).json({ message: "User ID, address ID, and updated data are required" });
    }

    const userAddresses = await Address.findOne({ userId });
    if (!userAddresses) return res.status(404).json({ message: "User addresses not found" });

    const address = userAddresses.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // Update only provided fields
    Object.assign(address, updatedData);

    await userAddresses.save();

    res.status(200).json({
      message: "Address updated successfully",
      data: address
    });

  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Delete a specific address
exports.deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.body;

    const userAddresses = await Address.findOne({ userId });
    if (!userAddresses) return res.status(404).json({ message: "User addresses not found" });

    const addressIndex = userAddresses.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) return res.status(404).json({ message: "Address not found" });

    userAddresses.addresses.splice(addressIndex, 1);
    await userAddresses.save();

    res.status(200).json({
      message: "Address deleted successfully",
      data: userAddresses.addresses
    });

  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Set a specific address as default
exports.setDefaultAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.body;

    const userAddresses = await Address.findOne({ userId });
    if (!userAddresses) return res.status(404).json({ message: "User addresses not found" });

    userAddresses.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await userAddresses.save();

    res.status(200).json({
      message: "Default address set successfully",
      data: userAddresses.addresses
    });

  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
