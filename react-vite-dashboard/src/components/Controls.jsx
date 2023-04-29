// This component is the form that allows the user to select the date and time, sampling period,
// and pollutant to be displayed on the map.

// React Imports
import React, { useState, useContext, useEffect } from "react";

// Context Imports
import DataContext from "../contexts/Data.Context.js";

// Library Imports
import DatePicker from "react-datepicker";

// custom component imports
import ShowSensorLayerButton from "./ShowSensorLayerButton";

// helper functions
import { formatStartDate, formatEndDate } from "../utils/formatDate.js";
import calculateSamplingValue from "../utils/calculateSamplingValue.js";

// style imports
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "../styles/Controls.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { set } from "date-fns";

// const Controls = () => {
//   // import data and functions from DataContext
//   const {
//     startDate,
//     setStartDate,
//     endDate,
//     setEndDate,
//     selectedPollutant,
//     setSelectedPollutant,
//     samplingPeriod,
//     setSamplingPeriod,
//     samplingValue,
//     setSamplingValue,
//     showSensorLayer,
//   } = useContext(DataContext);

//   // handle form submission and set the selected pollutant
//   // also calculate the sampling value based on the sampling period, start date and end date
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const selectedOption = event.target.elements["air-quality"].value;
//     setSelectedPollutant(selectedOption);
//     const samplingVal = calculateSamplingValue(
//       startDate,
//       endDate,
//       samplingPeriod
//     );
//     setSamplingValue(samplingVal);

//     // console log the values of the form elements
//     console.log("Form Submitted...................");
//     console.log("Selected Pollutant: ", selectedOption);
//     console.log("Start Date: ", startDate);
//     console.log("End Date: ", endDate);
//     console.log("Sampling Period: ", samplingPeriod);
//     console.log("Sampling Value: ", samplingVal);
//     console.log("Show Sensor Layer: ", showSensorLayer);
//     console.log("..................................");
//   };

//   return (
//     <form className="Controls" onSubmit={handleSubmit}>
//       <div>
//         {/* Label and input for start date and time */}
//         <label htmlFor="start-date-time">Select Start Data and Time:</label>
//         <div className="datepicker-container">
//           <DatePicker
//             dateFormat="yyyy-MM-dd"
//             id="start-date"
//             selected={new Date(startDate)}
//             onChange={(date) => {
//               const formattedDate = formatStartDate(date);
//               setStartDate(formattedDate);
//               console.log(startDate);
//             }}
//           />
//           <DatePicker
//             showTimeSelect
//             showTimeSelectOnly
//             timeIntervals={60}
//             dateFormat="hh:00 aa"
//             timeCaption="Time"
//             id="start-time"
//             selected={new Date(startDate)}
//             onChange={(date) => {
//               const formattedDate = formatStartDate(date);
//               setStartDate(formattedDate);
//               console.log(startDate);
//             }}
//           />
//         </div>
//         {/* Label and input for end date and time */}
//         <label htmlFor="end-date-time">Select End Data and Time:</label>
//         <div className="datepicker-container">
//           <DatePicker
//             dateFormat="yyyy-MM-dd"
//             id="end-date"
//             selected={new Date(endDate)}
//             onChange={(date) => {
//               const formattedDate = formatEndDate(date);
//               setEndDate(formattedDate);
//               console.log(endDate);
//             }}
//           />
//           <DatePicker
//             showTimeSelect
//             showTimeSelectOnly
//             timeIntervals={60}
//             dateFormat="hh:00 aa"
//             timeCaption="Time"
//             id="end-time"
//             selected={new Date(endDate)}
//             onChange={(date) => {
//               const formattedDate = formatEndDate(date);
//               setEndDate(formattedDate);
//               console.log(endDate);
//             }}
//           />
//         </div>
//         <label htmlFor="sampling-period">Sampling Period</label>
//         <select
//           id="sampling-period"
//           name="sampling-period"
//           onChange={(event) => {
//             setSamplingPeriod(event.target.value);
//             console.log(samplingPeriod);
//           }}
//         >
//           <option value="hours" defaultValue>
//             Hours
//           </option>
//           <option value="days">Days</option>
//           {/* <option value="weeks">Weekly</option>
//           <option value="months">Monthly</option>
//           <option value="years">Yearly</option> */}
//         </select>
//         <label htmlFor="air-quality">Air Quality Measure:</label>
//         <select id="air-quality" name="air-quality">
//           <option value="pm2.5cnc" defaultValue>
//             PM2.5
//           </option>
//           <option value="pm10cnc">PM10</option>
//           <option value="temp">Temperature</option>
//           <option value="humidity">Humidity</option>
//           {/* <option value="so2ppb">SO2</option>
//           <option value="no2ppb">NO2</option>
//           <option value="o3ppb">O3</option>
//           <option value="co">CO</option> */}
//         </select>
//       </div>
//       <button className="submitbtn" type="submit">
//         Submit
//       </button>
//       <ShowSensorLayerButton />
//     </form>
//   );
// };

const mergeDateAndTime = (date, time) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes()
  );
};

const Controls = () => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedPollutant,
    setSelectedPollutant,
    samplingPeriod,
    setSamplingPeriod,
    samplingValue,
    setSamplingValue,
    showSensorLayer,
  } = useContext(DataContext);

  const [startDateValue, setStartDateValue] = useState(new Date());
  const [startTimeValue, setStartTimeValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [endTimeValue, setEndTimeValue] = useState(new Date());
  const [localSamplingPeriod, setLocalSamplingPeriod] =
    useState(samplingPeriod);
  const [localSelectedPollutant, setLocalSelectedPollutant] =
    useState(selectedPollutant);

  const handleSubmit = (event) => {
    event.preventDefault();

    const startDateTime = formatStartDate(
      mergeDateAndTime(startDateValue, startTimeValue)
    );
    const endDateTime = formatEndDate(
      mergeDateAndTime(endDateValue, endTimeValue)
    );

    setStartDate(startDateTime);
    setEndDate(endDateTime);
    const samplingVal = calculateSamplingValue(
      startDateTime,
      endDateTime,
      localSamplingPeriod
    );
    setSamplingValue(samplingVal);
    setSelectedPollutant(localSelectedPollutant);
    setSamplingPeriod(localSamplingPeriod);
  };

  return (
    <form className="Controls" onSubmit={handleSubmit}>
      <div>
        <DateTimePicker
          idPrefix="start"
          label="Select Start Data and Time:"
          dateValue={startDateValue}
          onDateChange={setStartDateValue}
          timeValue={startTimeValue}
          onTimeChange={setStartTimeValue}
          minDate={new Date("2023-01-01")}
        />

        <DateTimePicker
          idPrefix="end"
          label="Select End Data and Time:"
          dateValue={endDateValue}
          onDateChange={setEndDateValue}
          timeValue={endTimeValue}
          onTimeChange={setEndTimeValue}
          maxDate={new Date()}
        />

        <SamplingPeriodSelector
          value={localSamplingPeriod}
          onChange={setLocalSamplingPeriod}
        />

        <AirQualitySelector
          value={localSelectedPollutant}
          onChange={(event) => setLocalSelectedPollutant(event.target.value)}
        />
      </div>
      <button className="submitbtn" type="submit">
        Submit
      </button>
      <ShowSensorLayerButton />
    </form>
  );
};

const DateTimePicker = ({
  idPrefix,
  label,
  dateValue,
  onDateChange,
  timeValue,
  onTimeChange,
  minDate,
  maxDate,
}) => (
  <>
    <label htmlFor={`${idPrefix}-date-time`}>{label}</label>
    <div className="datepicker-container">
      <DatePicker
        dateFormat="yyyy-MM-dd"
        id={`${idPrefix}-date`}
        selected={dateValue}
        onChange={onDateChange}
        minDate={minDate}
        maxDate={maxDate}
      />
      <DatePicker
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={60}
        dateFormat="hh:00 aa"
        timeCaption="Time"
        id={`${idPrefix}-time`}
        selected={timeValue}
        onChange={onTimeChange}
      />
    </div>
  </>
);

const SamplingPeriodSelector = ({ value, onChange }) => (
  <>
    <label htmlFor="sampling-period">Sampling Period</label>
    <select
      id="sampling-period"
      name="sampling-period"
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    >
      <option value="hours">Hours</option>
      <option value="days">Days</option>
    </select>
  </>
);

const AirQualitySelector = ({ value, onChange }) => (
  <>
    <label htmlFor="air-quality">Air Quality Measure:</label>
    <select
      id="air-quality"
      name="air-quality"
      value={value}
      onChange={onChange}
    >
      <option value="pm2.5cnc">PM2.5</option>
      <option value="pm10cnc">PM10</option>
      <option value="temp">Temperature</option>
      <option value="humidity">Humidity</option>
    </select>
  </>
);

export default Controls;
