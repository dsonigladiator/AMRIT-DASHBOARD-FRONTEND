// This is the entry point for the React application
// Avoid changing this file unless you know what you are doing

// React Imports
import React from "react";
import ReactDOM from "react-dom/client";

// Custom Component Imports
import App from "./components/App";

// style imports
import "./styles/index.css";

// create the root element and render the app
// NOTE: StrictMode is used to enable React's development mode, so disable it before production
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
