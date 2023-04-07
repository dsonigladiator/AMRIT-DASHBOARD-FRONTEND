// import LeafletMap from "/components/Map.jsx";
// import LeafletMap1 from "./Map1";
import LeafletMap from "./Map";
import "../styles/styles.css";
import Controls from "./Controls";
import Card from "./Card";
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
  const [selectedFeature, setSelectedFeature] = useState("Select feature");
  const [pollutant, setPollutant] = useState("PM2.5");
  const [layerNo, setLayerNo] = useState(1);
  const [filteredDivisionsGeojson, setFilteredDivisionGeojson] = useState(null);
  const [filteredDistrictsGeojson, setFilteredDistrictsGeojson] =
    useState(null);
  const [statesData, setStatesData] = useState([]);

  const stateDataLayerName = "geonode:India_States_Simplified_V2";
  const divisionDataLayerName = "geonode:India_Divisions_Merged_V1";
  const districtDataLayerName = "geonode:India_Districts_Merged_Simplified_V1";

  // fetch all states Data
  useEffect(() => {
    // build queryParams object
    const queryParams = {
      admin_level: "state",
      params: "pm2.5cnc",
    };

    const getData = async () => {
      // first fetch AQ Data
      const AQData = await fetchAQData(queryParams);
      console.log("AQ Data: ")
      console.log(AQData);

      // then fetch Geo Data
      const { data, statesLoading, statesError } = await getGeoDataV2(
        stateDataLayerName
      );
      // console.log("data in app");
      // console.log(data);

      // then merge AQ and Geo Data
      // if both AQ and Geo Data are fetched, then set the state
      if (AQData && data) {
        console.log("AQData length:", AQData.data.length);
        data.features.forEach(stateFeature => {
          const stateName = stateFeature.properties.state.toLowerCase();
          console.log("stateName:", stateName);
          const aqDataForState = AQData.data.find(aqData => aqData.state_name.toLowerCase() === stateName);
          console.log("aqDataForState:", aqDataForState);
          if (aqDataForState) {
            if (!stateFeature.properties.hasOwnProperty("param_value")) {
              stateFeature.properties.param_value = null;
            }
            stateFeature.properties.param_value = aqDataForState.param_value;
          }
        });
        console.log("data after merging AQ and Geo Data");
        console.log(data);
        setStatesData(data);
      } else {
        console.log("Error: AQData or data is undefined");
      }
      

      while (statesLoading) {
        console.log("Loading States Data...");
      }
      if (statesError) {
        console.log("Error in loading States Data!");
      }
      // setStatesData(data);
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
        pollutant,
        setPollutant,
        layerNo,
        setLayerNo,
      }}
    >
      <div className="App">
        <Controls />
        <Card />
        <LeafletMap
          statesData={statesData}
        //   allDivisionData={allDivisionData}
        //   allDistrictData={allDistrictData}
        />
      </div>
    </DataContext.Provider>
  );
}
