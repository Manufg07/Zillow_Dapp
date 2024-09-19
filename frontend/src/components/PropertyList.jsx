import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import RealEstateABI from "../scdata/RealEstate.json";
import PropertyCard from "./PropertyCard";

const CONTRACT_ADDRESS = "0xf92BF96b18Dd721796e1A6cB2c063aD9840806fd";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          RealEstateABI.abi,
          provider
        );

        const propertyCount = await contract.propertyCounter();
        const propertyList = [];

        for (let i = 1; i <= propertyCount; i++) {
          const property = await contract.properties(i);
          propertyList.push({
            id: i,
            name: property.name,
            location: property.location,
            price: ethers.formatEther(property.price.toString()),
            imageUrl: property.imageURL,
            forSale: property.forSale,
          });
        }

        setProperties(propertyList);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-center my-8">Property List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyList;
