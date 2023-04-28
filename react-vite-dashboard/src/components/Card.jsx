// This is a Card component that displays the data of the selected feature on the map

// React Imports
import React, { useContext } from "react";

// Context Imports
import DataContext from "../contexts/Data.Context.js";

// Custom Component Imports
import HealthBar from "./HealthBar.jsx";

// style imports
import "../styles/Card.css";

// utils imports
import roundOffDigits from "../utils/roundOffDigits.js";

const Card = () => {
  // selected feature and its name to be displayed on card
  const { selectedFeatureName } = useContext(DataContext);
  const { selectedFeature } = useContext(DataContext);

  // function to get pollutant value from selectedFeature
  // if value is not present, return "-"
  // else return the value rounded off to 2 decimal places
  const getPollutantValue = (propertyName) => {
    const propertyValue =
      selectedFeature?.properties?.param_values?.[propertyName];
    return propertyValue ? roundOffDigits(propertyValue) : "-";
  };

  // function to get number of sensors from selectedFeature
  const getNumberOfSensors = () => {
    const numberOfSensors = selectedFeature?.properties?.number_of_sensors;
    return numberOfSensors ? numberOfSensors : "-";
  };

  return (
    <div className="card-container" style={{ backgroundColor: "#ffe6cc" }}>
      <h3>
        {/* if selectedFeatureName is not null, display it, else display "-" */}
        <b>{selectedFeatureName ?? "-"}</b>
      </h3>
      <div className="card-item">
        <label>Number of Sensors</label>
        <span>{getNumberOfSensors()}</span>
      </div>
      <div className="card-item">
        <label>Last Update Sensor</label>
        <span>Shipra Mall</span>
      </div>
      <div className="card-item">
        <label>Most Polluted Area</label>
        <span>Shipra Mall</span>
      </div>
      <div className="card-item">
        <label>Statistics</label>
      </div>
      <div className="data-container">
        <div className="data-row">
          <div className="data-item">
            <div>PM2.5</div>
            <div>{getPollutantValue("pm2.5cnc")}</div>
            <HealthBar value={getPollutantValue("pm2.5cnc") ?? 0} />
          </div>
          <div className="data-item">
            <div>PM10</div>
            <div>{getPollutantValue("pm10cnc")}</div>
            <HealthBar value={getPollutantValue("pm10cnc") ?? 0} />
          </div>
        </div>
        <div className="data-row">
          <div className="data-item">
            <div>Temperature</div>
            <div>{getPollutantValue("temp")}</div>
            <HealthBar value={getPollutantValue("temp") ?? 0} />
          </div>
          <div className="data-item">
            <div>Humidity</div>
            <div>{getPollutantValue("humidity")}</div>
            <HealthBar value={getPollutantValue("humidity") ?? 0} />
          </div>
          {/* <div className="data-item">
            <div>NO2</div>
            <div>{getPollutantValue("no2ppb")}</div>
            <HealthBar value={getPollutantValue("no2ppb") ?? 0} />
          </div>
          <div className="data-item">
            <div>O3</div>
            <div>{getPollutantValue("o3ppb")}</div>
            <HealthBar value={getPollutantValue("o3ppb") ?? 0} />
          </div>
          <div className="data-item">
            <div>CO</div>
            <div>{getPollutantValue("co")}</div>
            <HealthBar value={getPollutantValue("co") ?? 0} />
          </div>
          <div className="data-item">
            <div>SO2</div>
            <div>{getPollutantValue("so2ppb")}</div>
            <HealthBar value={getPollutantValue("so2ppb") ?? 0} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Card;
