import React from "react";
import { ethers } from "ethers";

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-sm mx-auto">
      <img
        src={property.imageUrl}
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
      </div>
    </div>
  );
};

export default PropertyCard;
