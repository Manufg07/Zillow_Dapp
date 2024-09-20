import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import RealEstateABI from "../scdata/RealEstate.json";
import PropertyCard from "./PropertyCard";

const CONTRACT_ADDRESS = "0x3C6CEFb4a188697F04aeE25699c3E8DD8EA92Ccb";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // MetaMask wallet connect function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setConnectedAddress(address);
        console.log("Connected to wallet:", address);
      } catch (error) {
        setError("Error connecting to MetaMask. Please try again.");
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      setError("MetaMask is not installed. Please install it to proceed.");
    }
  };

  // Function to fetch all properties from the smart contract
  const fetchProperties = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        RealEstateABI.abi,
        provider
      );

      const propertyCount = await contract.propertyCount();
      const properties = [];

      for (let i = 1; i <= propertyCount; i++) {
        const property = await contract.getProperty(i);
        properties.push({
          id: i,
          name: property[0],
          location: property[1],
          price: ethers.formatEther(property[2]),
          imageURL: property[3],
          description: property[4],
          owner: property[5],
          isAvailable: property[6],
        });
      }

      setProperties(properties);
      setLoading(false);
    } catch (error) {
      setError("Error fetching properties. Please try again later.");
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-700 text-xl">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="property-list px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.length > 0 ? (
        properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            connectedAddress={connectedAddress}
          />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-700 text-xl">
          No properties available at the moment.
        </div>
      )}
    </div>
  );
};

export default PropertyList;
