import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropertyCard from "./PropertyCard"; // Import the PropertyCard component

const PropertyList = ({ contract }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Log available contract methods
        console.log("Contract methods:", Object.keys(contract.functions));

        // Fetch the total number of properties
        const propertyCount = await contract.propertyCounter();
        const propertyList = [];

        // Loop through properties and fetch details
        for (let i = 0; i < propertyCount; i++) {
          const property = await contract.properties(i);
          propertyList.push({
            name: property.name,
            location: property.location,
            price: property.price.toString(), // Convert price to string
            imageUrl: property.imageURL,
          });
        }

        setProperties(propertyList);
      } catch (error) {
        toast.error("Error fetching properties.");
        console.error("Error fetching properties:", error);
      }
    };

    if (contract) {
      fetchProperties();
    }
  }, [contract]);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-center my-8">Property List</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          properties.map((property, index) => (
            <PropertyCard key={index} property={property} />
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyList;
