import React, { useState, useContext } from "react";
import DataContext from "../contexts/Data.Context.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "../styles/Controls.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Controls = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: handle form submission
  };

  const { currentDate, setCurrentDate } = useContext(DataContext);

  return (
    <form className="Controls" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="start-date-time">Select Start Data and Time:</label>
        <DatePicker
          showIcon
          dateFormat="yyyy-MM-dd'T'HH:mm:ss"
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
          dateFormat="yyyy-MM-dd'T'HH:mm:ss"
          id="end-date-time"
          selected={currentDate}
          onChange={(date) => {
            setCurrentDate(date);
            console.log(currentDate);
          }}
        />

        <label htmlFor="air-quality">Sampling Period</label>
        <select id="sampling-period" name="sampling-period">
          <option value="hour" defaultValue>
            Hour
          </option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
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
