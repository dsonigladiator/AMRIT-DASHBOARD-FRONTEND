// This component will be used to toggle the visibility of the sensor layer on the map. It will be used in the Controls component.

// React Imports
import React, { useContext } from "react";

// Context Imports
import DataContext from "../contexts/Data.Context";

// style imports
import "../styles/ShowSensorLayerButton.css";

// ShowSensorLayerButton component
export default function ShowSensorLayerButton() {
  // get the showSensorLayer state and setShowSensorLayer function from the DataContext
  const { showSensorLayer, setShowSensorLayer } = useContext(DataContext);

  // return the button
  return (
    <div className="show-sensor-layer-button">
      <button
        className="btn btn-primary"
        onClick={() => setShowSensorLayer(!showSensorLayer)}
      >
        {showSensorLayer ? "Hide Sensors" : "Show Sensors"}
      </button>
    </div>
  );
}
