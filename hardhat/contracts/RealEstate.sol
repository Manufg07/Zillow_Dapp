// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstate {
    struct Property {
        string name;
        string location;
        uint256 price;
        string imageURL;  
        string description;  // Check if the connected address is the admin
        address payable owner;
        bool isAvailable;
    }

    mapping(uint256 => Property) public properties;
    uint256 public propertyCount;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyOwner(uint256 _propertyId) {
        require(properties[_propertyId].owner == msg.sender, "Only owner can modify property");
        _;
    }

    // Events 
    event PropertyAdded(
        uint256 propertyId,
        string name,
        string location,
        uint256 price,
        string imageURL,
        string description,
        address owner
    );

    event PropertyBought(uint256 propertyId, address newOwner);
    event PropertyListedForSale(uint256 propertyId, uint256 price);
    event PropertyRemovedFromSale(uint256 propertyId);
    event PropertyModified(uint256 propertyId);

  
    function addProperty(
        string memory _name,
        string memory _location,
        uint256 _price,
        string memory _imageURL,  
        string memory _description
    ) public {
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_location).length > 0, "Location required");
        require(_price > 0, "Price must be greater than zero");

        propertyCount++;

        properties[propertyCount] = Property(
            _name,
            _location,
            _price,
            _imageURL,  
            _description, 
            payable(msg.sender),
            true
        );

        emit PropertyAdded(propertyCount, _name, _location, _price, _imageURL, _description, msg.sender);
    }

  
    function getProperty(uint256 _propertyId)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            string memory,
            string memory,
            address,
            bool
        )
    {
        Property memory property = properties[_propertyId];
        return (
            property.name,
            property.location,
            property.price,
            property.imageURL,  
            property.description, 
            property.owner,
            property.isAvailable
        );
    }

    
    function buyProperty(uint256 _propertyId) public payable {
        Property storage property = properties[_propertyId];
        require(property.isAvailable, "Property is not available for sale");
        require(msg.value >= property.price, "Not enough ETH to buy the property");
        require(msg.sender != property.owner, "Owner cannot buy their own property");

        property.owner.transfer(msg.value); 
        property.owner = payable(msg.sender); 
        property.isAvailable = false; 

        emit PropertyBought(_propertyId, msg.sender);
    }

   
    function listPropertyForSale(uint256 _propertyId, uint256 _price) public onlyOwner(_propertyId) {
        Property storage property = properties[_propertyId];
        property.price = _price;
        property.isAvailable = true;

        emit PropertyListedForSale(_propertyId, _price);
    }

    function removePropertyFromSale(uint256 _propertyId) public onlyOwner(_propertyId) {
        Property storage property = properties[_propertyId];
        property.isAvailable = false;

        emit PropertyRemovedFromSale(_propertyId);
    }

    function modifyPropertyDetails(
        uint256 _propertyId,
        string memory _name,
        string memory _location,
        uint256 _price,
        string memory _imageURL, 
        string memory _description 
    ) public onlyOwner(_propertyId) {
        Property storage property = properties[_propertyId];
        property.name = _name;
        property.location = _location;
        property.price = _price;
        property.imageURL = _imageURL; 
        property.description = _description; 

        emit PropertyModified(_propertyId);
    }
}
