// import LeafletMap from "/components/Map.jsx";
// import LeafletMap1 from "./Map1";
import LeafletMap from "./Map";
import "../styles/styles.css";
import Controls from "./Controls";
import Card from "./Card";
import Loader from "./Loader";
import DrillUpButton from "./DrillUpButton";

// import useSWR from "swr";
import React, { useState, useEffect } from "react";
import DataContext from "../contexts/Data.Context";
import fetchAQData from "../utils/fetchAQData.js";
// import fetchGeoData from "./Utils/fetchGeoData.js";
import getGeoDataV2 from "../utils/fetchGeoDataV2";
import GeoDataError from "./GeoDataError";
import GeoDataLoading from "./GeoDataLoading";

export default function App() {
  // define global variables and state variables
  const [currentDate, setCurrentDate] = useState(Date.now());
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedFeatureName, setSelectedFeatureName] =
    useState("Select feature");
  const [selectedPollutant, setSelectedPollutant] = useState("pm2.5cnc");
  const [layerNo, setLayerNo] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLayer, setCurrentLayer] = useState("State");
  const [bounds, setBounds] = useState([]);
  const [hasDrilledDown, setHasDrilledDown] = useState(false);

  const [statesData, setStatesData] = useState([]);
  const [filteredDivisionsGeojson, setFilteredDivisionGeojson] = useState(null);
  const [filteredDistrictsGeojson, setFilteredDistrictsGeojson] =
    useState(null);

  const stateDataLayerName = "geonode:India_States_Simplified_V2";
  const divisionDataLayerName = "geonode:India_Divisions_Merged_V1";
  const districtDataLayerName = "geonode:India_Districts_Merged_Simplified_V1";

  // fetch all states Data
  useEffect(() => {
    // build queryParams object
    const queryParams = {
      admin_level: "state",
      params: "pm2.5cnc,pm10cnc,temp,humidity,so2ppb,no2ppb,o3ppb,co",
    };

    const getData = async () => {
      // set loading state
      setIsLoading(true);

      // first fetch AQ Data
      const AQData = await fetchAQData(queryParams);
      console.log("AQ Data: ");
      console.log(AQData);

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
      }}
    >
      <div className="App">
        {isLoading && <Loader />}
        <Controls />
        <Card />
        <LeafletMap statesData={statesData} />
        <DrillUpButton />
      </div>
    </DataContext.Provider>
  );
}
