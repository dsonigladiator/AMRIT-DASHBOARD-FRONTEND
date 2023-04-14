// This component is used to display the legend for the map

// React Imports
import React, { useContext } from "react";

// Context Imports
import DataContext from "../contexts/Data.Context.js";

// style imports
import "../styles/Legend.css";

const Legend = () => {
  // import selected pollutant from DataContext
  const { selectedPollutant } = useContext(DataContext);

  // define legend labels based on selected pollutant
  const getLegendLabels = () => {
    switch (selectedPollutant) {
      case "pm2.5cnc":
        return ["Good", "Fair", "Poor", "Very Poor", "Extremely Poor"];
      case "pm10cnc":
        return ["Good", "Fair", "Poor", "Very Poor", "Extremely Poor"];
      case "o3ppb":
        return ["Good", "Fair", "Poor", "Very Poor", "Hazardous"];
      case "no2ppb":
        return ["Good", "Fair", "Poor", "Very Poor", "Extremely Poor"];
      case "so2ppb":
        return ["Good", "Fair", "Poor", "Very Poor", "Extremely Poor"];
      case "co":
        return ["Good", "NA", "Poor", "NA", "Extremely Poor"];
      case "temp":
        return ["Very Cold", "Cold", "Moderate", "Hot", "Very Hot"];
      case "humidity":
        return ["Very Dry", "Dry", "Optimal", "Humid", "Very Humid"];
      default:
        return [];
    }
  };

  // create legend labels array
  const legendLabels = getLegendLabels();

  // define color scale based on selected pollutant
  // this is used to set the background color of the legend items
  // different pollutants have different color scales
  let colorScale;
  switch (selectedPollutant) {
    case "pm2.5cnc":
    case "pm10cnc":
    case "so2ppb":
    case "no2ppb":
    case "o3ppb":
    case "co":
      colorScale = ["#00E400", "#FFFF00", "#FF7E00", "#FF0000", "#7E0023"];
      break;
    case "temp":
      colorScale = [
        "#053061",
        "#2166ac",
        "#fddbc7",
        "#d6604d",
        "#b2182b",
        "#7E0023",
      ];
      break;
    case "humidity":
      colorScale = ["#b9fdff", "#a9dcf4", "#9da6e5", "#cc86ec", "#f288ff"];
      break;
    default:
      colorScale = [];
  }

  return (
    <div className="legend-container">
      <div className="legend-items">
        {/* loop over legend labels and create a div for each label */}
        {legendLabels.map((label, index) => (
          <div
            key={index}
            className="legend-item"
            style={{
              backgroundColor: colorScale[index],
              color: "#99ffd6",
              padding: "5px",
              borderRadius: "10px",
              margin: "5px",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
