# Real Estate DApp

This is a decentralized real estate application built on Ethereum, where users can add and view properties. The DApp allows users to upload property details, including images, using Pinata for IPFS storage, and interact with the Ethereum blockchain via MetaMask. It is built using Solidity for smart contracts and React for the frontend.
## Project Status

This project is currently in development. Working on adding the buy and sell functionalities for properties. And Enhancement of UI also pending

## Features

- **Add Property**: Users can add new properties by entering details such as name, location, price (in ETH), and uploading an image.
- **View Properties**: All properties added to the platform are displayed, including their name, location, price, and image.
- **MetaMask Integration**: Users connect their Ethereum wallets through MetaMask to interact with the DApp.
- **Decentralized Storage**: Property images are uploaded and stored on IPFS using Pinata.

## Technologies Used

- **Ethereum**: Blockchain platform for deploying the smart contracts.
- **Solidity**: Smart contract language used for creating the backend logic.
- **React.js**: JavaScript library for building the frontend user interface.
- **Pinata/IPFS**: Decentralized storage solution for uploading and storing property images.
- **MetaMask**: Browser-based wallet for connecting users to the Ethereum network.
- **Ethers.js**: Library for interacting with Ethereum blockchain in the frontend.
- **Hardhat**: Development environment for compiling, testing, and deploying smart contracts.

## Project Structure

- **Frontend**: Built using React and Vite.
  - Components like `AddProperty.js` and `PropertyList.js` handle the user interface and interaction with the blockchain.
  - Pinata and IPFS are used to store property images.
- **Backend**: A Solidity smart contract deployed on Ethereum, handling the core functionalities (adding properties, managing property details).

## Setup

### Prerequisites

- MetaMask installed in your browser.
- Node.js installed on your system.

