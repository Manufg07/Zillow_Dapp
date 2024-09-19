import React, { useState } from "react";
import { Contract, BrowserProvider } from "ethers";
import { ethers } from "ethers";
import { uploadImage } from "../utils/ipfs"; // Function for uploading image to IPFS
import RealEstateABI from "../scdata/RealEstate.json"; // ABI of your RealEstate contract
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CONTRACT_ADDRESS = "0xf92BF96b18Dd721796e1A6cB2c063aD9840806fd"; // Replace with your contract address

const AddProperty = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  // MetaMask wallet connect function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        toast.success("Connected to MetaMask");
      } catch (error) {
        toast.error("Error connecting to MetaMask");
      }
    } else {
      toast.error("MetaMask not detected");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "location") setLocation(value);
    if (name === "price") setPrice(value);
  };

  // Handle image input
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Add property function
  const addProperty = async () => {
    if (!name || !location || !price || !image) {
      toast.error("All fields are required");
      return;
    }

    try {
      // Connect to MetaMask
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        RealEstateABI.abi,
        signer
      );


      // Upload image to IPFS
      const imageURL = await uploadImage(image);

      // Convert price from ETH to Wei
      const priceInWei = ethers.parseEther(price); 

      // Interact with the smart contract to add the property
      const tx = await contract.addProperty(
        name,
        location,
        priceInWei,
        imageURL
      );
      await tx.wait(); // Wait for the transaction to be mined
      toast.success("Property added successfully!");

      // Clear the form
      setName("");
      setLocation("");
      setPrice("");
      setImage(null);
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
            Connect Wallet
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
                  htmlFor="image"
                >
                  Property Image *
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  onChange={handleFileChange}
                  className="w-full border-2 border-gray-300 rounded-md p-2"
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
