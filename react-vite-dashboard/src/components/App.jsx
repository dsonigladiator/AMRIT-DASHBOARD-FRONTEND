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

// Context Imports
import DataContext from "../contexts/Data.Context";

// api imports
import fetchAQData from "../utils/fetchAQData.js";
import getGeoDataV2 from "../utils/fetchGeoDataV2";
import fetchSensorData from "../utils/fetchSensorData";

// main App component
export default function App() {
  // define global variables and state variables

  // current date
  const [currentDate, setCurrentDate] = useState(Date.now());

  // selected feature and its name
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedFeatureName, setSelectedFeatureName] =
    useState("Select feature");

  // selected pollutant
  const [selectedPollutant, setSelectedPollutant] = useState("pm2.5cnc");

  // layer number and current layer
  const [layerNo, setLayerNo] = useState(1);
  const [currentLayer, setCurrentLayer] = useState("State");

  // loading state and drill down state
  const [isLoading, setIsLoading] = useState(false);
  const [hasDrilledDown, setHasDrilledDown] = useState(false);

  // map bounds
  const [bounds, setBounds] = useState([]);

  // geo data names
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);

  // geo data variables
  const [statesData, setStatesData] = useState([]);
  const [filteredDivisionsGeojson, setFilteredDivisionGeojson] = useState(null);
  const [filteredDistrictsGeojson, setFilteredDistrictsGeojson] =
    useState(null);
  const [statesSensorData, setStatesSensorData] = useState([]);
  const [divisionsSensorData, setDivisionsSensorData] = useState([]);
  const [districtsSensorData, setDistrictsSensorData] = useState([]);
  const [localSensorData, setLocalSensorData] = useState([]);

  // define layer names
  const stateDataLayerName = "geonode:India_States_Simplified_V2";
  // const divisionDataLayerName = "geonode:India_Divisions_Merged_V1";
  // const districtDataLayerName = "geonode:India_Districts_Merged_Simplified_V1";

  // fetch all geo data and AQ data and merge them
  useEffect(() => {
    // build AQDataQueryParams object
    const AQDataQueryParams = {
      admin_level: "state",
      params: "pm2.5cnc,pm10cnc,temp,humidity,so2ppb,no2ppb,o3ppb,co",
    };

    // build sensorDataQueryParams object
    const sensorDataQueryParams = {
      admin_level: "state",
    };

    const getData = async () => {
      // set loading state
      setIsLoading(true);

      // first fetch AQ Data
      const AQData = await fetchAQData(AQDataQueryParams);
      console.log("AQ Data: ");
      console.log(AQData);

      // fetch sensor data
      const sensorData = await fetchSensorData(sensorDataQueryParams);
      console.log("States Sensor Data: ");
      console.log(sensorData);

      // create GeoJSON FeatureCollection from the fetched sensor data
      const sensorFeatures = sensorData.data
        .filter((sensor) => sensor.lat && sensor.lon) // filter out invalid lat/lon values
        .map((sensor) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [sensor.lon, sensor.lat],
          },
          properties: {
            district_id: sensor.district_id,
            division_id: sensor.division_id,
            state_id: sensor.state_id,
            imei_id: sensor.imei_id,
            updated_time: sensor.updated_time,
          },
        }));
      const sensorGeoJSON = {
        type: "FeatureCollection",
        features: sensorFeatures,
      };
      console.log("States Sensor GeoJSON: ");
      console.log(sensorGeoJSON);

      // then fetch Geo Data
      const { data, statesLoading, statesError } = await getGeoDataV2(
        stateDataLayerName
      );

      function mergeAQAndGeoData(AQData, data, featureName) {
        if (!AQData || !data) {
          console.log("Error: AQData or data is undefined");
          return;
        }

        console.log("AQData length:", AQData.data.length);

        data.features.forEach((feature) => {
          const featureNameLower =
            feature.properties[featureName].toLowerCase();
          // console.log(`${featureName}: ${featureNameLower}`);

          // Get all the AQ data points for the matching feature
          const aqDataForFeature = AQData.data.filter(
            (aqData) =>
              aqData[`${featureName}_name`].toLowerCase() === featureNameLower
          );
          // console.log("aqDataForFeature:", aqDataForFeature);

          if (aqDataForFeature.length > 0) {
            if (!feature.properties.hasOwnProperty("param_values")) {
              feature.properties.param_values = {};
            }

            // Set the AQ data values for each parameter
            aqDataForFeature.forEach((aqData) => {
              feature.properties.param_values[aqData.param_name] =
                aqData.param_value;
              feature.properties.number_of_sensors = aqData.number_of_sensors;
            });
          }
        });

        console.log("data after merging AQ and Geo Data");
        console.log(data);

        return data;
      }

      // Example usage:
      const filteredStatesGeojson = mergeAQAndGeoData(AQData, data, "state");
      setStatesData(filteredStatesGeojson);
      setStatesSensorData(sensorGeoJSON);
      setIsLoading(false);

      while (statesLoading) {
        console.log("Loading States Data...");
      }

      if (statesError) {
        console.log("Error in loading States Data!");
      }
    };

    getData();
  }, []);

  return (
    // pass all the data and functions to the context provider
    <DataContext.Provider
      value={{
        currentDate,
        setCurrentDate,
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
        statesSensorData,
        setStatesSensorData,
        divisionsSensorData,
        setDivisionsSensorData,
        districtsSensorData,
        setDistrictsSensorData,
        localSensorData,
        setLocalSensorData,
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
