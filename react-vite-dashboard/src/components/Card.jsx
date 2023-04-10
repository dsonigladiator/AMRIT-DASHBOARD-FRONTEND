import React, { useContext } from "react";
import DataContext from "../contexts/Data.Context.js";
import "../styles/Card.css";
import roundOffDigits from "../utils/roundOffDigits.js";

const Card = () => {
  const { selectedFeatureName } = useContext(DataContext);
  const { selectedFeature } = useContext(DataContext);

  // function to get pollutant value from selectedFeature
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
          </div>
          <div className="data-item">
            <div>PM10</div>
            <div>{getPollutantValue("pm10cnc")}</div>
          </div>
          <div className="data-item">
            <div>SO2</div>
            <div>{getPollutantValue("so2ppb")}</div>
          </div>
        </div>
        <div className="data-row">
          <div className="data-item">
            <div>NO2</div>
            <div>{getPollutantValue("no2ppb")}</div>
          </div>
          <div className="data-item">
            <div>O3</div>
            <div>{getPollutantValue("o3ppb")}</div>
          </div>
          <div className="data-item">
            <div>CO</div>
            <div>{getPollutantValue("co")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
