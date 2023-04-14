// This component is the form that allows the user to select the date and time, sampling period,
// and pollutant to be displayed on the map.

// React Imports
import React, { useState, useContext } from "react";

// Context Imports
import DataContext from "../contexts/Data.Context.js";

// Library Imports
import DatePicker from "react-datepicker";

// style imports
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "../styles/Controls.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Controls = () => {
  // import data and functions from DataContext
  const {
    currentDate,
    setCurrentDate,
    selectedPollutant,
    setSelectedPollutant,
  } = useContext(DataContext);

  // handle form submission and set the selected pollutant
  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedOption = event.target.elements["air-quality"].value;
    setSelectedPollutant(selectedOption);
  };

  return (
    <form className="Controls" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="start-date-time">Select Start Data and Time:</label>
        <DatePicker
          showIcon
          dateFormat="yyyy-MM-dd'T'HH"
          id="start-date-time"
          selected={currentDate}
          onChange={(date) => {
            setCurrentDate(date);
            console.log(currentDate);
          }}
        />
        <label htmlFor="end-date-time">Select End Data and Time:</label>
        <DatePicker
          showIcon
          dateFormat="yyyy-MM-dd'T'HH"
          id="end-date-time"
          selected={currentDate}
          onChange={(date) => {
            setCurrentDate(date);
            console.log(currentDate);
          }}
        />

        <label htmlFor="sampling-period">Sampling Period</label>
        <select id="sampling-period" name="sampling-period">
          <option value="hours" defaultValue>
            Hourly
          </option>
          <option value="days">Daily</option>
          <option value="weeks">Weekly</option>
          <option value="months">Monthly</option>
          <option value="years">Yearly</option>
        </select>

        <label htmlFor="air-quality">Air Quality Measure:</label>
        <select id="air-quality" name="air-quality">
          <option value="pm2.5cnc" defaultValue>
            PM2.5
          </option>
          <option value="pm10cnc">PM10</option>
          <option value="so2ppb">SO2</option>
          <option value="no2ppb">NO2</option>
          <option value="o3ppb">O3</option>
          <option value="co">CO</option>
          <option value="temp">Temperature</option>
          <option value="humidity">Humidity</option>
        </select>
      </div>
      <button className="submitbtn" type="submit">
        Submit
      </button>
    </form>
  );
};

export default Controls;
