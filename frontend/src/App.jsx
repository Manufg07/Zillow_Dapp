import React, { useState, useEffect } from "react";
import PropertyList from "./components/PropertyList";
import AddProperty from "./components/AddProperty";
import { ethers } from "ethers";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");

  // Function to connect MetaMask wallet
  const connectWallet = async () => {
    if (isConnecting) return; // Prevent multiple requests
    setIsConnecting(true); // Set flag to true when starting connection

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
    }
  };

  // Check if MetaMask is already connected
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
    <div>
      <h1 className="text-4xl font-bold text-center my-8">Real Estate DApp</h1>

      <div className="flex justify-center my-4">
        {!isConnected && (
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        )}
        {isConnected && (
          <div className="text-center">
            <p>Connected: {account}</p>
          </div>
        )}
      </div>

      <div>
        <PropertyList />
        {isConnected && <AddProperty />}
      </div>
    </div>
  );
}

export default App;
