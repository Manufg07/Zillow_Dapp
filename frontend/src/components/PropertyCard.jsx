import React from "react";
import { ethers } from "ethers";
import RealEstateABI from "../scdata/RealEstate.json"; // Import your contract ABI

const CONTRACT_ADDRESS = "0xa8daeA0A229e06B2e7dc5a55F179d57EFDd68AAE"; // Replace with your contract address

const PropertyCard = ({ property, connectedAddress }) => {
  // Function to buy the property
  const gatewayUrl = import.meta.env.VITE_IPFS_GATEWAY;

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
    <div className="property-card border p-4 m-4 rounded-lg">
      <h3 className="font-bold">{property.name}</h3>
      <p>Location: {property.location}</p>
      <p>Price: {property.price} ETH</p>
      <p>Description: {property.description}</p>
      <p>Owner: {property.owner}</p>
      <img
        src={`https://ipfs.io/ipfs/${property.imageUrls}`}
        alt={property.name}
        className="w-full h-48"
      />

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
  );
};

export default PropertyCard;
