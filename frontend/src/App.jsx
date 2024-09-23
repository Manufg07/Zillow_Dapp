import React, { useState, useEffect } from "react";
import PropertyList from "./components/PropertyList";
import AddProperty from "./components/AddProperty";
import { ethers } from "ethers";
import { motion } from "framer-motion";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Function to connect MetaMask wallet
  const connectWallet = async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#010504] to-[#232b28] flex flex-col items-center justify-center py-8 px-4">
      <motion.h1
        className="text-5xl font-extrabold text-center mb-12 text-[#2c67c7] drop-shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Real Estate DApp
      </motion.h1>

      {/* Connect Wallet Button */}
      <div className="flex justify-center my-8">
        {!isConnected && (
          <motion.button
            onClick={connectWallet}
            className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3 px-8 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Connect Wallet
          </motion.button>
        )}
        {isConnected && (
          <motion.div
            className="text-center bg-white p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg font-semibold text-[#1E293B]">
              Connected: {account}
            </p>
          </motion.div>
        )}
      </div>

      {/* Property List should always show  */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Property list component always visible */}
        <PropertyList />

        {/* Show "Add Property" button only when MetaMask is connected */}
        {isConnected ? (
          <button
            className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3 px-6 mt-8 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => setShowModal(true)}
          >
            Add Property
          </button>
        ) : (
          <p className="text-gray-300 mt-8">
            Please connect your wallet to add properties or perform any actions.
          </p>
        )}

        {/* Modal for Adding Property */}
        {showModal && <AddProperty closeModal={() => setShowModal(false)} />}
      </motion.div>
    </div>
  );
}

export default App;
