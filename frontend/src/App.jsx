import React from "react";
import PropertyList from "./components/PropertyList";
import AddProperty from "./components/AddProperty";

function App() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-8">Real Estate DApp</h1>

      <div className="flex justify-center my-4">
        {/* Any header content, if needed */}
      </div>

      <div>
        <AddProperty />
        <PropertyList />
      </div>
    </div>
  );
}

export default App;
