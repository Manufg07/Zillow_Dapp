import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { uploadImage } from "../utils/ipfs";
import RealEstateABI from "../scdata/RealEstate.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CONTRACT_ADDRESS = "0xa8daeA0A229e06B2e7dc5a55F179d57EFDd68AAE";

const AddProperty = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [connectedAddress, setConnectedAddress] = useState(null);

  // MetaMask wallet connect function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setConnectedAddress(address);
        toast.success("Connected to MetaMask");
      } catch (error) {
        toast.error("Error connecting to MetaMask");
      }
    } else {
      toast.error("MetaMask not detected");
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        if (address) setConnectedAddress(address);
      }
    };
    checkConnection();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "location") setLocation(value);
    if (name === "price") setPrice(value);
    if (name === "description") setDescription(value);
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]); // Handle multiple file uploads
  };

  const addProperty = async () => {
    if (!name || !location || !price || !description || images.length === 0) {
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

      // Upload each image and collect URLs
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const imageUrl = await uploadImage(images[i]);
        imageUrls.push(imageUrl);
      }

      const priceInWei = ethers.parseEther(price);

      // Join image URLs as a single string, separated by commas
      const imageUrlString = imageUrls.join(",");

      const tx = await contract.addProperty(
        name,
        location,
        priceInWei,
        imageUrlString,
        description
      );
      await tx.wait();
      toast.success("Property added successfully!");

      setName("");
      setLocation("");
      setPrice("");
      setDescription("");
      setImages([]);
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Error adding property");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Add New Property
        </h1>
        <div className="max-w-lg mx-auto bg-white p-10 rounded-lg shadow-lg border border-gray-200">
          <button
            onClick={connectWallet}
            className="mb-6 bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-full transition duration-300 shadow-md"
          >
            {connectedAddress
              ? `Connected: ${connectedAddress}`
              : "Connect Wallet"}
          </button>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <div>
                <label
                  className="block text-lg font-medium mb-2 text-gray-600"
                  htmlFor="name"
                >
                  Property Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Property Name"
                  value={name}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-lg font-medium mb-2 text-gray-600"
                  htmlFor="location"
                >
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  placeholder="Location"
                  value={location}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-lg font-medium mb-2 text-gray-600"
                  htmlFor="price"
                >
                  Price (in ETH) *
                </label>
                <input
                  type="text"
                  name="price"
                  id="price"
                  placeholder="Price (in ETH)"
                  value={price}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-lg font-medium mb-2 text-gray-600"
                  htmlFor="description"
                >
                  Property Description *
                </label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={description}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-lg font-medium mb-2 text-gray-600"
                  htmlFor="images"
                >
                  Property Images *
                </label>
                <input
                  type="file"
                  name="images"
                  id="images"
                  onChange={handleFileChange}
                  className="w-full border-2 border-gray-300 rounded-md p-2"
                  multiple
                  required
                />
              </div>

              <button
                type="button"
                onClick={addProperty}
                className="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-full transition duration-300 shadow-md"
              >
                Add Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
