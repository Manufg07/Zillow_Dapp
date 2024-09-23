import React, { useState } from "react";
import { ethers } from "ethers";
import RealEstateABI from "../scdata/RealEstate.json";

const CONTRACT_ADDRESS = "0x3C6CEFb4a188697F04aeE25699c3E8DD8EA92Ccb";

const PropertyCard = ({ property, connectedAddress, isAdmin }) => {
  const [newPrice, setNewPrice] = useState("");
  const [editMode, setEditMode] = useState(false); // State to handle edit mode
  const [modifiedDetails, setModifiedDetails] = useState({
    name: property.name,
    location: property.location,
    price: property.price,
    imageURL: property.imageURL,
    description: property.description,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedDetails({ ...modifiedDetails, [name]: value });
  };

  // Function to modify property details (admin only)
  const modifyPropertyDetails = async (propertyId) => {
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

      const tx = await contract.modifyPropertyDetails(
        propertyId,
        modifiedDetails.name,
        modifiedDetails.location,
        ethers.parseEther(modifiedDetails.price.toString()), // Converting price to Wei
        modifiedDetails.imageURL,
        modifiedDetails.description
      );
      await tx.wait();

      alert("Property modified successfully!");
      setEditMode(false); // Exit edit mode after successful modification
    } catch (error) {
      console.error("Error modifying property:", error);
      alert("Failed to modify the property. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-sm mx-auto transition-transform hover:scale-105">
      <img
        src={property.imageURL}
        alt={property.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        {editMode ? (
          <>
            {/* Input fields for editing property details */}
            <input
              type="text"
              name="name"
              value={modifiedDetails.name}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border rounded-lg"
              placeholder="Property Name"
            />
            <input
              type="text"
              name="location"
              value={modifiedDetails.location}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border rounded-lg"
              placeholder="Location"
            />
            <input
              type="text"
              name="price"
              value={modifiedDetails.price}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border rounded-lg"
              placeholder="Price (ETH)"
            />
            <input
              type="text"
              name="imageURL"
              value={modifiedDetails.imageURL}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border rounded-lg"
              placeholder="Image URL"
            />
            <textarea
              name="description"
              value={modifiedDetails.description}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border rounded-lg"
              placeholder="Description"
            ></textarea>
            <button
              onClick={() => modifyPropertyDetails(property.id)}
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="w-full mt-2 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {property.name}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Location: {property.location}
            </p>
            <p className="text-xl font-semibold text-[#0D9488] mb-4">
              Price: {property.price} ETH
            </p>
            <p className="text-gray-700 mb-4">{property.description}</p>
            <p className="text-gray-500 mb-4">Owner: {property.owner}</p>

            {property.isAvailable && (
              <button
                onClick={() => buyProperty(property.id, property.price)}
                className="w-full bg-[#0D9488] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#0F766E] transition-colors"
              >
                Buy Property
              </button>
            )}

            {connectedAddress === property.owner && (
              <div className="mt-4">
                <input
                  type="number"
                  placeholder="New Price (ETH)"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
                <button
                  onClick={() => listPropertyForSale(property.id, newPrice)}
                  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  List Property For Sale
                </button>
              </div>
            )}

            {isAdmin && (
              <button
                onClick={() => setEditMode(true)}
                className="w-full mt-4 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Modify Property
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
