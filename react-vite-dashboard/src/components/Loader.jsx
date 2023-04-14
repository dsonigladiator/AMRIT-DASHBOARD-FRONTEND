// This component is used to show a loader when the page is loading

// React Imports
import React from "react";

// Custom Component Imports from external libraries
import { MoonLoader } from "react-spinners";

const Loader = () => {
  return (
    <div
      className="loader-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <MoonLoader color="#36d7b7" size={80} />
    </div>
  );
};

export default Loader;
