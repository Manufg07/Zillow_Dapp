import React from "react";
import { ethers } from "ethers";
import RealEstateABI from "../scdata/RealEstate.json"; // Import your contract ABI

const CONTRACT_ADDRESS = "0x3C6CEFb4a188697F04aeE25699c3E8DD8EA92Ccb"; // Replace with your contract address

const PropertyCard = ({ property, connectedAddress }) => {
 
  // Function to buy the property
  const buyProperty = async (propertyId, price) => {
    if (!window.ethereum) {
      alert("MetaMask is required to perform this action.");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        RealEstateABI.abi,
        signer
      );

      // Convert the price from ETH to Wei
      const priceInWei = ethers.parseEther(price.toString());

      // Call the buyProperty function from the smart contract
      const tx = await contract.buyProperty(propertyId, { value: priceInWei });
      await tx.wait();

      alert("Property bought successfully!");
    } catch (error) {
      console.error("Error buying property:", error);
      alert("Failed to buy the property. Please try again.");
    }
  };

  // Function to list the property for sale
  const listPropertyForSale = async (propertyId, price) => {
    if (!window.ethereum) {
      alert("MetaMask is required to perform this action.");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        RealEstateABI.abi,
        signer
      );

      const priceInWei = ethers.parseEther(price.toString());

      // Call the listPropertyForSale function from the smart contract
      const tx = await contract.listPropertyForSale(propertyId, priceInWei);
      await tx.wait();

      alert("Property listed for sale!");
    } catch (error) {
      console.error("Error listing property for sale:", error);
      alert("Failed to list the property. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-sm mx-auto">
      <img
        src={property.imageURL}
        alt={property.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {property.name}
        </h2>
        <p className="text-gray-600 mb-4">Location: {property.location}</p>
        <p className="text-lg font-medium text-blue-600">
          Price: {property.price} ETH
        </p>
        <p className="text-gray-600 mb-4">
          Description: {property.description}
        </p>
        <p className="text-gray-600 mb-4">Owner: {property.owner}</p>
        {property.isAvailable && (
          <>
            <button
              onClick={() => buyProperty(property.id, property.price)}
              className="bg-green-500 text-white p-2 mt-4 rounded"
            >
              Buy Property
            </button>
          </>
        )}
        {connectedAddress === property.owner && (
          <>
            <input
              type="number"
              placeholder="New Price (ETH)"
              onChange={(e) => listPropertyForSale(property.id, e.target.value)}
              className="mt-4"
            />
            <button
              onClick={() => listPropertyForSale(property.id, property.price)}
              className="bg-blue-500 text-white p-2 mt-4 rounded"
            >
              List Property For Sale
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
