import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import RealEstateABI from "../scdata/RealEstate.json"; // Import your contract ABI
import PropertyCard from "./PropertyCard";

const CONTRACT_ADDRESS = "0x3C6CEFb4a188697F04aeE25699c3E8DD8EA92Ccb";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [connectedAddress, setConnectedAddress] = useState(null);

  // MetaMask wallet connect function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setConnectedAddress(address);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
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
          imageUrls: property[3],
          description: property[4],
          owner: property[5],
          isAvailable: property[6],
        });
      }

      setProperties(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    connectWallet();
    fetchProperties();
  }, []);

  return (
    <div className="property-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          connectedAddress={connectedAddress}
        />
      ))}
    </div>
  );
};

export default PropertyList;
