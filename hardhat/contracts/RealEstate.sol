// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract RealEstate {
    
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin {
        require(msg.sender == admin, "Access Denied: Only admin can perform this operation");
        _;
    }

    struct Property {
        uint256 id;
        string name;
        string location;
        uint256 price;
        string imageURL; // Link to property image (e.g., IPFS URL)
        address payable owner;
        bool forSale;
    }

    mapping(uint256 => Property) public properties;
    uint256 public propertyCounter;

    // Event declarations
    event PropertyAdded(uint256 id, string name, string location, uint256 price, string imageURL, address owner);
    event PropertyBought(uint256 id, address newOwner);
    event PropertyListedForSale(uint256 id, uint256 price);
    event PropertyRemovedFromSale(uint256 id);

    // Function to add a new property by the owner
    function addProperty(
        string memory _name, 
        string memory _location, 
        uint256 _price, 
        string memory _imageURL
    ) public {
        propertyCounter++;
        properties[propertyCounter] = Property(propertyCounter, _name, _location, _price, _imageURL, payable(msg.sender), true);
        emit PropertyAdded(propertyCounter, _name, _location, _price, _imageURL, msg.sender);
    }

    // Function to buy a property
    function buyProperty(uint256 _id) public payable {
        require(_id > 0 && _id <= propertyCounter, "Invalid property ID");

        Property storage property = properties[_id]; // Access storage directly
        require(property.forSale, "Property is not for sale");
        require(msg.value >= property.price, "Insufficient funds to buy the property");
        require(msg.sender != property.owner, "Owner cannot buy their own property");

        // Transfer ownership and funds
        property.owner.transfer(msg.value); // Send Ether to the current owner
        property.owner = payable(msg.sender);
        property.forSale = false;

        emit PropertyBought(_id, msg.sender);
    }


    // Function to list property for sale
    function listPropertyForSale(uint256 _id, uint256 _price) public {
        Property storage property = properties[_id];
        require(msg.sender == property.owner, "Only the owner can list the property for sale");
        property.price = _price;
        property.forSale = true;
        emit PropertyListedForSale(_id, _price);
    }

    // Function to remove property from sale
    function removePropertyFromSale(uint256 _id) public {
        Property storage property = properties[_id];
        require(msg.sender == property.owner, "Only the owner can remove the property from sale");
        property.forSale = false;
        emit PropertyRemovedFromSale(_id);
    }

    // Admin function to modify property details
    function modifyPropertyDetails(
        uint256 _id,
        string memory _name,
        string memory _location,
        uint256 _price,
        string memory _imageURL
    ) public onlyAdmin {
        Property storage property = properties[_id];
        property.name = _name;
        property.location = _location;
        property.price = _price;
        property.imageURL = _imageURL;
    }
}
