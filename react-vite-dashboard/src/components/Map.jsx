import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import DataContext from "../contexts/Data.Context.js";
import { MapContainer, TileLayer } from "react-leaflet";
import { GeoJSON } from "react-leaflet";
import "../styles/Map.css";
// import "../styles/DrillUpButton.css";
import DrillUpButton from "./DrillUpButton.jsx";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import getColor from "../utils/getColor";
import fetchAQData from "../utils/fetchAQData.js";
import ZoomtoBounds from "./ZoomToBounds";
import {
  indiaGeoJSONStyleV1,
  divisionGeoJSONStyleV1,
  districtGeoJSONStyleV1,
} from "../utils/geojsonStyles.js";
import getGeoDataV2 from "../utils/fetchGeoDataV2.js";

// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// let DefaultIcon = L.icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow
// });
const stateDataLayerName = "geonode:India_States_Simplified_V2";
const divisionDataLayerName = "geonode:India_Divisions_Merged_V1";
const districtDataLayerName = "geonode:India_Districts_Merged_Simplified_V1";

// global variables
const mapCenter = [23.5937, 78.9629];
var filteredDistrictsGeojson;
var filteredDivisionsGeojson;

// Main Map component
function LeafletMap(props) {
  const { statesData } = props;
  const { setSelectedFeature } = useContext(DataContext);
  const { setSelectedFeatureName } = useContext(DataContext);
  const { layerNo, setLayerNo } = useContext(DataContext);
  const { isLoading, setIsLoading } = useContext(DataContext);
  // set initial currentLayer to "India" (State Level)
  const { currentLayer, setCurrentLayer } = useContext(DataContext);
  // const [currentLayer, setCurrentLayer] = useState("State");

  // set initial bounds of map
  // const [bounds, setBounds] = useState([]);
  const { bounds, setBounds } = useContext(DataContext);

  // some useState variables
  const [drillDownState, setDrillDownState] = useState([]);
  // const [hasDrilledDown, setHasDrilledDown] = useState(false);
  const { hasDrilledDown, setHasDrilledDown } = useContext(DataContext);
  // const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  // const [filteredDivisionsGeojson, setFilteredDivisionGeojson] = useState(null);
  // const [filteredDistrictsGeojson, setFilteredDistrictsGeojson] =
  //   useState(null);
  const { filteredDivisionsGeojson, setFilteredDivisionGeojson } =
    useContext(DataContext);
  const { filteredDistrictsGeojson, setFilteredDistrictsGeojson } =
    useContext(DataContext);

  // set some bounds for drill up
  var indiaBounds = L.geoJSON(statesData).getBounds();
  var filteredDivisionBounds = L.geoJSON(filteredDivisionsGeojson).getBounds();
  // var districtBounds;
  var featureBounds;

  // variable to track drill up and drill down;
  // State: 1
  // Division: 2
  // District: 3
  // Sensor: 4
  // var layerNo = 1;

  // function to handle single click on feature
  function onFeatureClick(e) {
    var featureName;
    var selectedFeature = e.target.feature;

    // Level 1: State Level
    if (layerNo === 1) {
      featureName = e.target.feature.properties.state;
    }
    // Level 2: Division Level
    else if (layerNo === 2) {
      featureName = e.target.feature.properties.division;
    }
    // Level 3: District Level
    else if (layerNo === 3) {
      featureName = e.target.feature.properties.district;
    }
    // Update card component header
    setSelectedFeatureName(featureName);
    setSelectedFeature(selectedFeature);
  }

  //===============================================================
  //===============================================================
  //
  // MAIN CODE - DRILL DOWN
  //
  //===============================================================
  //===============================================================

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////  STATE DRILL DOWN  ////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // function to handle double-click on State
  function stateDrillDown(e) {
    const stateName = e.target.feature.properties.state.toLowerCase();
    var clickedFeature = e;
    var stateBounds = e.target._bounds;
    featureBounds = stateBounds;

    const cql_filter = `state=\'${stateName.toUpperCase()}\'`;

    // build queryParams object
    const queryParams = {
      admin_level: "division",
      params: "pm2.5cnc,pm10cnc,temp,humidity,so2ppb,no2ppb,o3ppb,co",
    };

    // fetch division data and do something with it
    const getData = async () => {
      // set loading state
      setIsLoading(true);

      // first fetch AQ Data
      const AQData = await fetchAQData(queryParams);
      // console.log("AQ Data: ");
      // console.log(AQData);

      // then fetch Geo Data
      const { data, isLoading, isError } = await getGeoDataV2(
        divisionDataLayerName,
        cql_filter
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
      const filteredDivisionGeojson = mergeAQAndGeoData(
        AQData,
        data,
        "division"
      );
      setFilteredDivisionGeojson(filteredDivisionGeojson);
      setIsLoading(false);

      // handle data loading and error state
      if (isLoading) {
        // Handle loading state
        console.log("Loading Division Data...");
      } else if (isError) {
        // Handle error state
        console.log("Error in fetching Division Data...");
      } else {
        // filteredDivisionsGeojson contains the data you need
        if (data.features.length > 0) {
          setCurrentLayer("Division");
          setBounds(featureBounds);
          //set hasDrilledDown to true
          setHasDrilledDown(true);
        } else {
          alert("No divisions found for the selected State");
          setSelectedFeature(null);
          setSelectedFeatureName(null);
          setHasDrilledDown(false);
          return;
        }
      }

      // increment layer number, new val: 2
      setLayerNo(layerNo + 1);

      // console.log(layerNo);
    };

    // call getData function
    getData();
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////  DIVISION DRILL DOWN  /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // function to handle double-click on a Division
  function divisionDrillDown(e) {
    var districtData;
    const divisionID = e.target.feature.properties.id;
    const divisionName = e.target.feature.properties.division;
    var clickedFeature = e;
    // setSelectedFeature(divisionName);
    var divisionBounds = e.target._bounds;
    featureBounds = divisionBounds;

    const cql_filter = `division=\'${divisionName}\'`;

    // build queryParams object
    const queryParams = {
      admin_level: "district",
      params: "pm2.5cnc,pm10cnc,temp,humidity,so2ppb,no2ppb,o3ppb,co",
    };

    // fetch division data and do something with it
    const getData = async () => {
      // set loading state
      setIsLoading(true);

      // first fetch AQ Data
      const AQData = await fetchAQData(queryParams);
      // console.log("AQ Data: ");
      // console.log(AQData);

      // then fetch Geo Data
      const { data, isLoading, isError } = await getGeoDataV2(
        districtDataLayerName,
        cql_filter
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
      const filteredDistrictsGeojson = mergeAQAndGeoData(
        AQData,
        data,
        "district"
      );
      setFilteredDistrictsGeojson(filteredDistrictsGeojson);
      setIsLoading(false);

      // handle data loading and error state
      if (isLoading) {
        // Handle loading state
        console.log("Loading District Data...");
      } else if (isError) {
        // Handle error state
        console.log("Error in fetching District Data...");
      } else {
        // filteredDivisionsGeojson contains the data you need
        if (data.features.length > 0) {
          setCurrentLayer("District");
          setBounds(featureBounds);
          //set hasDrilledDown to true
          setHasDrilledDown(true);
        } else {
          alert("No districts found for the selected Division");
          setSelectedFeature(null);
          setSelectedFeatureName(null);
          setHasDrilledDown(false);
          return;
        }
      }

      // increment layer number, new val: 2
      setLayerNo(layerNo + 1);

      // console.log(layerNo);
    };

    // call getData function
    getData();
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////  DISTRICT DRILL DOWN  /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // function to handle  click on a District
  function districtDrillDown(e) {
    var sensorGeoData;
    const districtID = e.target.feature.properties.district_id;
    const districtName = e.target.feature.properties.district;
    featureBounds = e.target._bounds;
    // setSelectedFeature(districtName);
    setBounds(featureBounds);
  }

  //===============================================================
  //===============================================================
  //
  // END OF MAIN CODE
  //
  //===============================================================
  //===============================================================

  //===============================================================
  //===============================================================
  //
  // MAIN CODE - DRILL UP
  //
  //===============================================================
  //===============================================================

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////  DRILL UP /////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // create DrillUpButton component to display on the map during drill up
  // function DrillUpButton() {
  //   const { layerNo } = useContext(DataContext);
  //   const [isVisible, setIsVisible] = useState(false);
  //   // const [layerName, setLayerName] = React.useState("");
  //   const [layerName, setLayerName] = useState("");

  //   React.useEffect(() => {
  //     setIsVisible(hasDrilledDown);
  //     if (layerNo === 2) {
  //       setLayerName("State");
  //     } else if (layerNo === 3) {
  //       setLayerName("Division");
  //     } else if (layerNo === 1) {
  //       setIsVisible(false);
  //     }
  //   }, [hasDrilledDown, layerNo]);

  //   function drillUp() {
  //     if (layerNo === 3) {
  //       setCurrentLayer("Division");
  //       setBounds(filteredDivisionBounds);
  //       setFilteredDistrictsGeojson(null);
  //       setLayerNo(layerNo - 1);
  //     } else if (layerNo === 2) {
  //       setCurrentLayer("State");
  //       setBounds(indiaBounds);
  //       setFilteredDivisionGeojson(null);
  //       setLayerNo(layerNo - 1);
  //       setSelectedFeature("Click Feature");
  //     } else if (layerNo === 1) {
  //       alert("No drill up possible at this level.");
  //     }
  //   }

  //   return (
  //     <button
  //       className={`drillup-btn ${isVisible ? "visible" : "hidden"}`}
  //       onClick={drillUp}
  //     >
  //       Drill Up to {layerName} Level
  //     </button>
  //   );
  // }

  // function DrillUpButton() {
  //   const { layerNo } = useContext(DataContext);
  //   const [isVisible, setIsVisible] = useState(false);

  //   const layerName = useMemo(() => {
  //     if (layerNo === 2) {
  //       return "State";
  //     } else if (layerNo === 3) {
  //       return "Division";
  //     } else {
  //       return "";
  //     }
  //   }, [layerNo]);

  //   const drillUp = useCallback(() => {
  //     if (layerNo === 3) {
  //       setCurrentLayer("Division");
  //       setBounds(filteredDivisionBounds);
  //       setFilteredDistrictsGeojson(null);
  //       setLayerNo(layerNo - 1);
  //     } else if (layerNo === 2) {
  //       setCurrentLayer("State");
  //       setBounds(indiaBounds);
  //       setFilteredDivisionGeojson(null);
  //       setLayerNo(layerNo - 1);
  //       setSelectedFeature("Click Feature");
  //     } else if (layerNo === 1) {
  //       alert("No drill up possible at this level.");
  //     }
  //   }, [
  //     layerNo,
  //     setCurrentLayer,
  //     setBounds,
  //     setFilteredDistrictsGeojson,
  //     setFilteredDivisionGeojson,
  //     setLayerNo,
  //     setSelectedFeature,
  //   ]);

  //   useEffect(() => {
  //     setIsVisible(hasDrilledDown);
  //   }, [hasDrilledDown]);

  //   return (
  //     <button
  //       className={`drillup-btn ${isVisible ? "visible" : "hidden"}`}
  //       onClick={drillUp}
  //     >
  //       Drill Up to {layerName} Level
  //     </button>
  //   );
  // }

  //===============================================================
  //===============================================================
  //
  // END OF MAIN CODE
  //
  //===============================================================
  //===============================================================

  // Render map layers based on currentLayer state
  // India States Layer
  const IndiaLayer = () => {
    return (
      <GeoJSON
        data={statesData}
        style={indiaGeoJSONStyleV1}
        onEachFeature={(feature, layer) => {
          layer.on({
            click: onFeatureClick,
            dblclick: stateDrillDown,
          });
        }}
      />
    );
  };

  // Filtered Divisions Layer
  const FilteredDivisionLayer = () => {
    return (
      <GeoJSON
        data={filteredDivisionsGeojson}
        style={divisionGeoJSONStyleV1}
        onEachFeature={(feature, layer) => {
          layer.on({
            click: onFeatureClick,
            dblclick: divisionDrillDown,
          });
        }}
      />
    );
  };

  // Filtered Districts Layer
  const FilteredDistrictLayer = () => {
    return (
      <GeoJSON
        data={filteredDistrictsGeojson}
        style={districtGeoJSONStyleV1}
        onEachFeature={(feature, layer) => {
          layer.on({
            click: onFeatureClick,
            dblclick: districtDrillDown,
          });
        }}
      />
    );
  };

  return (
    <MapContainer
      center={mapCenter}
      zoom={4.75}
      zoomSnap={0.25}
      zoomDelta={1}
      doubleClickZoom={false}
      minZoom={4}
      maxZoom={14}
    >
      <TileLayer url="https://api.mapbox.com/styles/v1/divcsoni99/clf9jbl3d004501qolng7pt76/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGl2Y3Nvbmk5OSIsImEiOiJjbGYydHV1NDgwNWoyM3NvMXR4bXZra2VyIn0._t8rySAgLoxsMRl0UwvBUg" />
      {/* Render map layers based on currentLayer state */}
      {currentLayer === "State" && <IndiaLayer />}
      {currentLayer === "Division" && <FilteredDivisionLayer />}
      {currentLayer === "District" && <FilteredDistrictLayer />}
      {/* {hasDrilledDown && <DrillUpButton />} */}
      {bounds.length !== 0 && <ZoomtoBounds bounds={bounds} />}
    </MapContainer>
  );
}

export default LeafletMap;
