import React, { useState } from "react";
import PropertyList from "./components/PropertyList";

const App = () => {
  const [connectedAddress, setConnectedAddress] = useState("");

  
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required to perform this action.");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      setConnectedAddress(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect the wallet. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Real Estate Marketplace
        </h1>
        <button
          onClick={connectWallet}
          className="bg-[#0D9488] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#0F766E] transition-colors"
        >
          {connectedAddress
            ? `Connected: ${connectedAddress.slice(
                0,
                6
              )}...${connectedAddress.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </header>

      <PropertyList connectedAddress={connectedAddress} />
    </div>
  );
};

export default App;
