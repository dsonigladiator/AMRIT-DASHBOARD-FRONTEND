// This is the main component that renders the entire app

// React Imports
import React, { useState, useEffect } from "react";

// Custom Component Imports to be used in App
import LeafletMap from "./Map";
import Controls from "./Controls";
import Card from "./Card";
import Loader from "./Loader";
import DrillUpButton from "./DrillUpButton";
import Legend from "./Legend";

// style imports
import "../styles/styles.css";

// helper functions
import { formatStartDate, formatEndDate } from "../utils/formatDate";

// Context Imports
import DataContext from "../contexts/Data.Context";

// main App component
export default function App() {
  // define global variables and state variables
  // these variables will be used in the entire app

  // start date and end date to today's date
  const today = new Date(Date.now());
  const formattedDate = today.toISOString().substring(0, 10);

  const [startDate, setStartDate] = useState(
    formatStartDate(new Date(formattedDate))
  );
  const [endDate, setEndDate] = useState(
    formatEndDate(new Date(formattedDate))
  );

  // sampling period and sampling value
  const [samplingPeriod, setSamplingPeriod] = useState("hours");
  const [samplingValue, setSamplingValue] = useState(3);

  // selected feature and its name
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedFeatureName, setSelectedFeatureName] =
    useState("Select feature");

  // selected pollutant
  const [selectedPollutant, setSelectedPollutant] = useState("pm2.5cnc");

  // object to store query parameters for AQ Data API
  const [AQDataQueryParams, setAQDataQueryParams] = useState({});

  // layer number and current layer
  const [layerNo, setLayerNo] = useState(1);
  const [currentLayer, setCurrentLayer] = useState("State");

  // loading state and drill down state
  const [isLoading, setIsLoading] = useState(false);
  const [hasDrilledDown, setHasDrilledDown] = useState(false);

  // set visibility of point layer
  const [showSensorLayer, setShowSensorLayer] = useState(false);

  // map bounds
  const [bounds, setBounds] = useState([]);

  // geo data names
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // geo data variables
  const [statesData, setStatesData] = useState([]);
  const [filteredDivisionsGeojson, setFilteredDivisionGeojson] = useState(null);
  const [filteredDistrictsGeojson, setFilteredDistrictsGeojson] =
    useState(null);
  const [statesSensorData, setStatesSensorData] = useState([]);
  const [divisionsSensorData, setDivisionsSensorData] = useState([]);
  const [districtsSensorData, setDistrictsSensorData] = useState([]);
  const [localSensorData, setLocalSensorData] = useState([]);

  return (
    // pass all the data and functions to the context provider
    <DataContext.Provider
      value={{
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        selectedFeature,
        setSelectedFeature,
        selectedFeatureName,
        setSelectedFeatureName,
        selectedPollutant,
        setSelectedPollutant,
        layerNo,
        setLayerNo,
        isLoading,
        setIsLoading,
        currentLayer,
        setCurrentLayer,
        bounds,
        setBounds,
        statesData,
        setStatesData,
        filteredDivisionsGeojson,
        setFilteredDivisionGeojson,
        filteredDistrictsGeojson,
        setFilteredDistrictsGeojson,
        hasDrilledDown,
        setHasDrilledDown,
        selectedState,
        setSelectedState,
        selectedDivision,
        setSelectedDivision,
        selectedDistrict,
        setSelectedDistrict,
        statesSensorData,
        setStatesSensorData,
        divisionsSensorData,
        setDivisionsSensorData,
        districtsSensorData,
        setDistrictsSensorData,
        localSensorData,
        setLocalSensorData,
        showSensorLayer,
        setShowSensorLayer,
        samplingPeriod,
        setSamplingPeriod,
        samplingValue,
        setSamplingValue,
        AQDataQueryParams,
        setAQDataQueryParams,
      }}
    >
      <div className="App">
        {/* display loading spinner if data is loading */}
        {isLoading && <Loader />}
        <Controls />
        <Card />
        <LeafletMap />
        <Legend />
        <DrillUpButton />
      </div>
    </DataContext.Provider>
  );
}
