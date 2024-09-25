import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import RealEstateABI from "../scdata/RealEstate.json";
import PropertyCard from "./PropertyCard";

const CONTRACT_ADDRESS = "0xC6E9963CB77b5285F3A24Ecc14C566a2c19eF022";

const PropertyList = ({ connectedAddress }) => {
  const [properties, setProperties] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchProperties();
    checkIfAdmin();
  }, []);

  // Fetch all properties from the contract
 const fetchProperties = async () => {
   if (!window.ethereum) {
     console.error("MetaMask not detected");
     return;
   }

   try {
     console.log("Connecting to provider...");
     const provider = new ethers.BrowserProvider(window.ethereum);
     const contract = new ethers.Contract(
       CONTRACT_ADDRESS,
       RealEstateABI.abi,
       provider
     );

     const propertyCount = await contract.propertyCount();
     console.log(`Property count: ${propertyCount}`);

     const allProperties = [];

     for (let i = 1; i <= propertyCount; i++) {
       const propertyArray = await contract.getProperty(i);
       console.log(`Property ${i}:`, propertyArray);

       // Unpack array into a structured object
       const property = {
         id: i,
         name: propertyArray[0],
         location: propertyArray[1],
         price: ethers.formatEther(propertyArray[2]),
         imageURL: propertyArray[3],
         description: propertyArray[4],
         owner: propertyArray[5],
         isAvailable: propertyArray[6],
       };

       allProperties.push(property);
     }

     console.log("All properties:", allProperties);
     setProperties(allProperties);
   } catch (error) {
     console.error("Error fetching properties:", error);
   }
 };

 
  const checkIfAdmin = async () => {
    if (!window.ethereum) {
      console.error("MetaMask not detected");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        RealEstateABI.abi,
        provider
      );
      const adminAddress = await contract.admin();
      console.log(`Admin address: ${adminAddress}`);

      setIsAdmin(adminAddress === connectedAddress);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.length > 0 ? (
        properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            connectedAddress={connectedAddress}
            isAdmin={isAdmin}
          />
        ))
      ) : (
        <p>No properties found.</p>
      )}
    </div>
  );
};

export default PropertyList;
