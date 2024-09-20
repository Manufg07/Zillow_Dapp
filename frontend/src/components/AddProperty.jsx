import React, { useState } from "react";
import { ethers } from "ethers";
import { uploadImage } from "../utils/ipfs";
import RealEstateABI from "../scdata/RealEstate.json";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion for animations
import "react-toastify/dist/ReactToastify.css";

const CONTRACT_ADDRESS = "0x3C6CEFb4a188697F04aeE25699c3E8DD8EA92Ccb";

const AddProperty = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "location") setLocation(value);
    if (name === "price") setPrice(value);
    if (name === "description") setDescription(value);
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const addProperty = async () => {
    if (!name || !location || !price || !description || !image) {
      toast.error("All fields are required");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        RealEstateABI.abi,
        signer
      );

      const imageURL = await uploadImage(image);
      const priceInWei = ethers.parseEther(price);

      const tx = await contract.addProperty(
        name,
        location,
        priceInWei,
        imageURL,
        description
      );
      await tx.wait();

      toast.success("Property added successfully!");

      // Clear form
      setName("");
      setLocation("");
      setPrice("");
      setDescription("");
      setImage(null);

      closeModal(); // Close modal on success
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Error adding property");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-lg p-8 w-full max-w-md"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Add New Property
        </h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div>
              <label className="block text-lg mb-1 text-gray-600">
                Property Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Property Name"
                value={name}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-lg mb-1 text-gray-600">
                Location *
              </label>
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={location}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-lg mb-1 text-gray-600">
                Price (in ETH) *
              </label>
              <input
                type="text"
                name="price"
                placeholder="Price (in ETH)"
                value={price}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-lg mb-1 text-gray-600">
                Property Description *
              </label>
              <textarea
                name="description"
                placeholder="Description"
                value={description}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-lg mb-1 text-gray-600">
                Property Image *
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border-2 border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={closeModal}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={addProperty}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              Add Property
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddProperty;
