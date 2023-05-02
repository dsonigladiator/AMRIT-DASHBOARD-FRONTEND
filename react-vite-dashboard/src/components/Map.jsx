//This is the main map component. It is responsible for rendering the map and handling all the drill down and drill up functionality.

// React Imports
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// Context Imports
import DataContext from "../contexts/Data.Context.js";

// React Leaflet Imports
import { MapContainer, TileLayer } from "react-leaflet";
import { GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Component Imports
import DrillUpButton from "./DrillUpButton.jsx";
import ZoomtoBounds from "./ZoomToBounds";

// api imports
import fetchAQData from "../utils/fetchAQData.js";
import getGeoDataV2 from "../utils/fetchGeoDataV2.js";
import fetchSensorData from "../utils/fetchSensorData.js";

// style imports
import "../styles/Map.css";
import {
  indiaGeoJSONStyleV1,
  divisionGeoJSONStyleV1,
  districtGeoJSONStyleV1,
} from "../utils/geojsonStyles.js";

// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// let DefaultIcon = L.icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow
// });

// layer names as defined in geoserver
const stateDataLayerName = "geonode:India_States_Simplified_V2";
const divisionDataLayerName = "geonode:India_Divisions_Merged_V1";
const districtDataLayerName = "geonode:India_Districts_Merged_Simplified_V1";

// global variables
const mapCenter = [23.5937, 80.9629];

// Main Map component
function LeafletMap() {
  // get data from context
  // get start date and end date
  const { startDate } = useContext(DataContext);
  const { endDate } = useContext(DataContext);

  // get sampling period and sampling value
  const { samplingPeriod } = useContext(DataContext);
  const { samplingValue } = useContext(DataContext);

  // get AQ Data Query Params
  const { AQDataQueryParams, setAQDataQueryParams } = useContext(DataContext);

  // geo data names
  const { selectedState, setSelectedState } = useContext(DataContext);
  const { selectedDivision, setSelectedDivision } = useContext(DataContext);
  const { selectedDistrict, setSelectedDistrict } = useContext(DataContext);

  // geo data
  const { statesData, setStatesData } = useContext(DataContext);
  const { filteredDivisionsGeojson, setFilteredDivisionGeojson } =
    useContext(DataContext);
  const { filteredDistrictsGeojson, setFilteredDistrictsGeojson } =
    useContext(DataContext);

  // sensor data
  const { statesSensorData, setStatesSensorData } = useContext(DataContext);
  const { divisionsSensorData, setDivisionsSensorData } =
    useContext(DataContext);
  const { districtsSensorData, setDistrictsSensorData } =
    useContext(DataContext);
  const { localSensorData, setLocalSensorData } = useContext(DataContext);

  // selected feature and feature name
  const { selectedFeature, setSelectedFeature } = useContext(DataContext);
  const { setSelectedFeatureName } = useContext(DataContext);

  // layer number
  const { layerNo, setLayerNo } = useContext(DataContext);

  // loading state
  const { isLoading, setIsLoading } = useContext(DataContext);

  // set initial currentLayer to "India" (State Level)
  const { currentLayer, setCurrentLayer } = useContext(DataContext);

  // set initial bounds of map
  const { bounds, setBounds } = useContext(DataContext);

  // some useState variables
  const { setHasDrilledDown } = useContext(DataContext);

  // show or hide sensor layer
  const { showSensorLayer, setShowSensorLayer } = useContext(DataContext);

  // global variables in this component
  var featureBounds;

  // variable to track drill up and drill down;
  // State: 1
  // Division: 2
  // District: 3
  // Sensor: 4
  // var layerNo = 1;

  // function to handle single click on feature
  // this updates the card component header
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
  ////////////////////////////////////////////  INITIAL MAP LOAD  ////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // // fetch and Load all state level data on initial map load
  // // fetch all geo data and AQ data and merge them
  // useEffect(() => {
  //   // build AQDataQueryParams object
  //   // build AQDataQueryParams object
  //   // const AQDataQueryParams = {
  //   //   admin_level: "state",
  //   //   params: "pm2.5cnc,pm10cnc,temp,humidity,so2ppb,no2ppb,o3ppb,co",
  //   // };
  //   let AQDataQueryParams = {};

  //   if (startDate && endDate && samplingPeriod && samplingValue) {
  //     AQDataQueryParams = {
  //       admin_level: "state",
  //       params: "pm2.5cnc,pm10cnc,temp,humidity,so2ppb,no2ppb,o3ppb,co",
  //       from_date: startDate,
  //       to_date: endDate,
  //       sampling: samplingPeriod || "hours",
  //       sampling_value: samplingValue || 1,
  //     };
  //   } else {
  //     AQDataQueryParams = {
  //       admin_level: "state",
  //       params: "pm2.5cnc,pm10cnc,temp,humidity,so2ppb,no2ppb,o3ppb,co",
  //     };
  //   }

  //   // build sensorDataQueryParams object
  //   const sensorDataQueryParams = {
  //     admin_level: "state",
  //   };

  //   const getData = async () => {
  //     // set loading state
  //     setIsLoading(true);

  //     // first fetch AQ Data
  //     const AQData = await fetchAQData(AQDataQueryParams);
  //     console.log("AQ Data: ");
  //     console.log(AQData);

  //     // fetch sensor data
  //     const sensorData = await fetchSensorData(sensorDataQueryParams);
  //     // console.log("States Sensor Data: ");
  //     // console.log(sensorData);

  //     // create GeoJSON FeatureCollection from the fetched sensor data
  //     const sensorFeatures = sensorData.data
  //       .filter((sensor) => sensor.lat && sensor.lon) // filter out invalid lat/lon values
  //       .map((sensor) => ({
  //         type: "Feature",
  //         geometry: {
  //           type: "Point",
  //           coordinates: [sensor.lon, sensor.lat],
  //         },
  //         properties: {
  //           district_id: sensor.district_id,
  //           division_id: sensor.division_id,
  //           state_id: sensor.state_id,
  //           imei_id: sensor.imei_id,
  //           updated_time: sensor.updated_time,
  //         },
  //       }));
  //     const sensorGeoJSON = {
  //       type: "FeatureCollection",
  //       features: sensorFeatures,
  //     };
  //     // console.log("States Sensor GeoJSON: ");
  //     // console.log(sensorGeoJSON);

  //     // then fetch Geo Data
  //     const { data, statesLoading, statesError } = await getGeoDataV2(
  //       stateDataLayerName
  //     );

  //     function mergeAQAndGeoData(AQData, data, featureName) {
  //       if (!AQData || !data) {
  //         console.log("Error: AQData or data is undefined");
  //         return;
  //       }

  //       // console.log("AQData length:", AQData.data.length);

  //       data.features.forEach((feature) => {
  //         const featureNameLower =
  //           feature.properties[featureName].toLowerCase();
  //         // console.log(`${featureName}: ${featureNameLower}`);

  //         // Get all the AQ data points for the matching feature
  //         const aqDataForFeature = AQData.data.filter(
  //           (aqData) =>
  //             aqData[`${featureName}_name`].toLowerCase() === featureNameLower
  //         );
  //         // console.log("aqDataForFeature:", aqDataForFeature);

  //         if (aqDataForFeature.length > 0) {
  //           if (!feature.properties.hasOwnProperty("param_values")) {
  //             feature.properties.param_values = {};
  //           }

  //           // Set the AQ data values for each parameter
  //           aqDataForFeature.forEach((aqData) => {
  //             feature.properties.param_values[aqData.param_name] =
  //               aqData.param_value;
  //             feature.properties.number_of_sensors = aqData.number_of_sensors;
  //           });
  //         }
  //       });

  //       // console.log("data after merging AQ and Geo Data");
  //       // console.log(data);

  //       return data;
  //     }

  //     // Example usage:
  //     const filteredStatesGeojson = mergeAQAndGeoData(AQData, data, "state");
  //     setStatesData(filteredStatesGeojson);
  //     setStatesSensorData(sensorGeoJSON);
  //     setIsLoading(false);

  //     while (statesLoading) {
  //       console.log("Loading States Data...");
  //     }

  //     if (statesError) {
  //       console.log("Error in loading States Data!");
  //     }
  //   };

  //   getData();
  // }, [startDate, endDate, samplingPeriod, samplingValue]);

  // Fetch and load all state level data on initial map load
  // Fetch all geo data and AQ data and merge them
  const fetchData = async (
    setIsLoading,
    setStatesData,
    setStatesSensorData,
    startDate,
    endDate,
    samplingPeriod,
    samplingValue
  ) => {
    // Set loading state
    setIsLoading(true);

    const AQDataQueryParams = buildStateAQDataQueryParams(
      startDate,
      endDate,
      samplingPeriod,
      samplingValue
    );

    const fallbackAQDataQueryParams = buildStateAQDataQueryParams(null);

    const sensorDataQueryParams = buildStateSensorDataQueryParams();

    const AQData = await fetchAQData(
      AQDataQueryParams,
      fallbackAQDataQueryParams
    );
    const sensorData = await fetchSensorData(sensorDataQueryParams);
    const sensorGeoJSON = createSensorGeoJSON(sensorData);
    const geoData = await fetchStateGeoData();

    const mergedData = mergeAQAndGeoData(AQData, geoData, "state");
    setStatesData(mergedData);
    setStatesSensorData(sensorGeoJSON);
    setIsLoading(false);
  };

  const buildStateAQDataQueryParams = (
    startDate,
    endDate,
    samplingPeriod,
    samplingValue
  ) => {
    let AQDataQueryParams = {
      admin_level: "state",
      params: "pm2.5cnc,pm10cnc,temp,humidity,so2ppb,no2ppb,o3ppb,co",
    };

    if (startDate && endDate && samplingPeriod && samplingValue) {
      AQDataQueryParams = {
        ...AQDataQueryParams,
        from_date: startDate,
        to_date: endDate,
        sampling: samplingPeriod || "hours",
        sampling_value: samplingValue || 1,
      };
    }

    return AQDataQueryParams;
  };

  const buildStateSensorDataQueryParams = () => {
    return {
      admin_level: "state",
    };
  };

  const createSensorGeoJSON = (sensorData) => {
    const sensorFeatures = sensorData.data
      .filter((sensor) => sensor.lat && sensor.lon)
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

    return {
      type: "FeatureCollection",
      features: sensorFeatures,
    };
  };

  const fetchStateGeoData = async () => {
    const { data } = await getGeoDataV2(stateDataLayerName);
    return data;
  };

  const mergeAQAndGeoData = (AQData, geoData, featureName) => {
    if (!AQData || !geoData) {
      console.error("Error: AQData or geoData is undefined");
      return;
    }

    geoData.features.forEach((feature) => {
      const featureNameLower = feature.properties[featureName].toLowerCase();

      const aqDataForFeature = AQData.data.filter(
        (aqData) =>
          aqData[`${featureName}_name`].toLowerCase() === featureNameLower
      );

      if (aqDataForFeature.length > 0) {
        if (!feature.properties.hasOwnProperty("param_values")) {
          feature.properties.param_values = {};
        }

        aqDataForFeature.forEach((aqData) => {
          feature.properties.param_values[aqData.param_name] =
            aqData.param_value;
          feature.properties.number_of_sensors = aqData.number_of_sensors;
        });
      }
    });

    return geoData;
  };

  useEffect(() => {
    fetchData(
      setIsLoading,
      setStatesData,
      setStatesSensorData,
      startDate,
      endDate,
      samplingPeriod,
      samplingValue
    );
  }, [startDate, endDate, samplingPeriod, samplingValue]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////  STATE DRILL DOWN  ////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // function to handle double-click on State
  // function stateDrillDown(e) {
  //   // const stateName = e.target.feature.properties.state.toLowerCase();
  //   const stateName = e.target.feature.properties.state;
  //   const stateID = e.target.feature.properties.id;
  //   var clickedFeature = e;
  //   var stateBounds = e.target._bounds;
  //   featureBounds = stateBounds;

  //   const cql_filter = `state=\'${stateName.toUpperCase()}\'`;

  //   // build AQDataQueryParams object
  //   const AQDataQueryParams = {
  //     admin_level: "division",
  //     params: "pm2.5cnc,pm10cnc,temp,humidity,so2ppb,no2ppb,o3ppb,co",
  //   };

  //   // build sensorDataQueryParams object
  //   const sensorDataQueryParams = {
  //     admin_level: "state",
  //     admin_id: stateID,
  //   };

  //   // fetch division data and do something with it
  //   const getData = async () => {
  //     // set loading state
  //     setIsLoading(true);

  //     // first fetch AQ Data
  //     const AQData = await fetchAQData(AQDataQueryParams);
  //     console.log("AQ Data: ");
  //     console.log(AQData);

  //     // then fetch sensor data for all divisions in the state
  //     const sensorData = await fetchSensorData(sensorDataQueryParams);
  //     // console.log("Sensor Data: ");
  //     // console.log(sensorData);

  //     /// create GeoJSON FeatureCollection from the fetched sensor data
  //     const sensorFeatures = sensorData.data
  //       .filter((sensor) => sensor.lat && sensor.lon) // filter out invalid lat/lon values
  //       .map((sensor) => ({
  //         type: "Feature",
  //         geometry: {
  //           type: "Point",
  //           coordinates: [sensor.lon, sensor.lat],
  //         },
  //         properties: {
  //           district_id: sensor.district_id,
  //           division_id: sensor.division_id,
  //           state_id: sensor.state_id,
  //           imei_id: sensor.imei_id,
  //           updated_time: sensor.updated_time,
  //         },
  //       }));
  //     const sensorGeoJSON = {
  //       type: "FeatureCollection",
  //       features: sensorFeatures,
  //     };
  //     // console.log("Sensor GeoJSON: ");
  //     // console.log(sensorGeoJSON);

  //     // then fetch Geo Data
  //     const { data, isLoading, isError } = await getGeoDataV2(
  //       divisionDataLayerName,
  //       cql_filter
  //     );

  //     function mergeAQAndGeoData(AQData, data, featureName) {
  //       if (!AQData || !data) {
  //         console.log("Error: AQData or data is undefined");
  //         return;
  //       }

  //       // console.log("AQData length:", AQData.data.length);

  //       data.features.forEach((feature) => {
  //         const featureNameLower =
  //           feature.properties[featureName].toLowerCase();
  //         // console.log(`${featureName}: ${featureNameLower}`);

  //         // Get all the AQ data points for the matching feature
  //         const aqDataForFeature = AQData.data.filter(
  //           (aqData) =>
  //             aqData[`${featureName}_name`].toLowerCase() === featureNameLower
  //         );
  //         // console.log("aqDataForFeature:", aqDataForFeature);

  //         if (aqDataForFeature.length > 0) {
  //           if (!feature.properties.hasOwnProperty("param_values")) {
  //             feature.properties.param_values = {};
  //           }

  //           // Set the AQ data values for each parameter
  //           aqDataForFeature.forEach((aqData) => {
  //             feature.properties.param_values[aqData.param_name] =
  //               aqData.param_value;
  //             feature.properties.number_of_sensors = aqData.number_of_sensors;
  //           });
  //         }
  //       });

  //       // console.log("data after merging AQ and Geo Data");
  //       // console.log(data);

  //       return data;
  //     }

  //     // Example usage:
  //     const filteredDivisionGeojson = mergeAQAndGeoData(
  //       AQData,
  //       data,
  //       "division"
  //     );
  //     setFilteredDivisionGeojson(filteredDivisionGeojson);
  //     setDivisionsSensorData(sensorGeoJSON);
  //     setIsLoading(false);

  //     // handle data loading and error state
  //     if (isLoading) {
  //       // Handle loading state
  //       console.log("Loading Division Data...");
  //     } else if (isError) {
  //       // Handle error state
  //       console.log("Error in fetching Division Data...");
  //     } else {
  //       // filteredDivisionsGeojson contains the data you need
  //       if (data.features.length > 0) {
  //         setCurrentLayer("Division");
  //         setBounds(featureBounds);
  //         //set hasDrilledDown to true
  //         setHasDrilledDown(true);
  //       } else {
  //         alert("No divisions found for the selected State");
  //         setSelectedFeature(null);
  //         setSelectedFeatureName(null);
  //         setHasDrilledDown(false);
  //         return;
  //       }
  //     }

  //     // increment layer number, new val: 2
  //     setLayerNo(layerNo + 1);

  //     // console.log(layerNo);
  //   };

  //   // call getData function
  //   getData();
  // }

  const getStateInfo = (e) => {
    const stateName = e.target.feature.properties.state;
    const stateID = e.target.feature.properties.id;
    const stateBounds = e.target._bounds;

    return { stateName, stateID, stateBounds };
  };

  const buildDivisionAQDataQueryParams = (adminLevel) => {
    return {
      admin_level: adminLevel,
      params: "pm2.5cnc,pm10cnc,temp,humidity,so2ppb,no2ppb,o3ppb,co",
    };
  };

  const buildDivisionSensorDataQueryParams = (adminLevel, adminID) => {
    const queryParams = {
      admin_level: adminLevel,
    };

    if (adminID) {
      queryParams.admin_id = adminID;
    }

    return queryParams;
  };

  const fetchDivisionGeoData = async (dataLayerName, cql_filter) => {
    const { data } = await getGeoDataV2(dataLayerName, cql_filter);
    return data;
  };

  const handleStateDrillDownResults = (
    mergedData,
    sensorGeoJSON,
    stateBounds
  ) => {
    setFilteredDivisionGeojson(mergedData);
    setDivisionsSensorData(sensorGeoJSON);
    setIsLoading(false);

    if (mergedData.features.length > 0) {
      setCurrentLayer("Division");
      setBounds(stateBounds);
      setHasDrilledDown(true);
    } else {
      alert("No divisions found for the selected State");
      setSelectedFeature(null);
      setSelectedFeatureName(null);
      setHasDrilledDown(false);
    }

    setLayerNo((prevLayerNo) => prevLayerNo + 1);
  };

  const stateDrillDown = async (e) => {
    const { stateName, stateID, stateBounds } = getStateInfo(e);

    const cql_filter = `state=\'${stateName.toUpperCase()}\'`;

    const AQDataQueryParams = buildDivisionAQDataQueryParams("division");
    const sensorDataQueryParams = buildDivisionSensorDataQueryParams(
      "state",
      stateID
    );

    setIsLoading(true);

    const AQData = await fetchAQData(AQDataQueryParams);
    const sensorData = await fetchSensorData(sensorDataQueryParams);
    const sensorGeoJSON = createSensorGeoJSON(sensorData);
    const geoData = await fetchDivisionGeoData(
      divisionDataLayerName,
      cql_filter
    );

    const mergedData = mergeAQAndGeoData(AQData, geoData, "division");
    handleStateDrillDownResults(mergedData, sensorGeoJSON, stateBounds);

    // Update selected state name
    setSelectedState(stateName);
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////  DIVISION DRILL DOWN  /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // function to handle double-click on a Division
  // function divisionDrillDown(e) {
  //   var districtData;
  //   const divisionID = e.target.feature.properties.id;
  //   const divisionName = e.target.feature.properties.division;
  //   var clickedFeature = e;
  //   // setSelectedFeature(divisionName);
  //   var divisionBounds = e.target._bounds;
  //   featureBounds = divisionBounds;

  //   const cql_filter = `division=\'${divisionName}\'`;

  //   // build AQDataQueryParams object
  //   const AQDataQueryParams = {
  //     admin_level: "district",
  //     params: "pm2.5cnc,pm10cnc,temp,humidity,so2ppb,no2ppb,o3ppb,co",
  //   };

  //   // build sensorDataQueryParams object
  //   const sensorDataQueryParams = {
  //     admin_level: "division",
  //     admin_id: divisionID,
  //   };

  //   // fetch division data and do something with it
  //   const getData = async () => {
  //     // set loading state
  //     setIsLoading(true);

  //     // first fetch AQ Data
  //     const AQData = await fetchAQData(AQDataQueryParams);
  //     console.log("AQ Data: ");
  //     console.log(AQData);

  //     // then fetch sensor data for all districts in the selected division
  //     const sensorData = await fetchSensorData(sensorDataQueryParams);
  //     // console.log("Sensor Data: ");
  //     // console.log(sensorData);

  //     // create GeoJSON FeatureCollection from the fetched sensor data
  //     const sensorFeatures = sensorData.data
  //       .filter((sensor) => sensor.lat && sensor.lon) // filter out invalid lat/lon values
  //       .map((sensor) => ({
  //         type: "Feature",
  //         geometry: {
  //           type: "Point",
  //           coordinates: [sensor.lon, sensor.lat],
  //         },
  //         properties: {
  //           district_id: sensor.district_id,
  //           division_id: sensor.division_id,
  //           state_id: sensor.state_id,
  //           imei_id: sensor.imei_id,
  //           updated_time: sensor.updated_time,
  //         },
  //       }));
  //     const sensorGeoJSON = {
  //       type: "FeatureCollection",
  //       features: sensorFeatures,
  //     };
  //     // console.log("Sensor GeoJSON: ");
  //     // console.log(sensorGeoJSON);

  //     // then fetch Geo Data
  //     const { data, isLoading, isError } = await getGeoDataV2(
  //       districtDataLayerName,
  //       cql_filter
  //     );

  //     function mergeAQAndGeoData(AQData, data, featureName) {
  //       if (!AQData || !data) {
  //         console.log("Error: AQData or data is undefined");
  //         return;
  //       }

  //       // console.log("AQData length:", AQData.data.length);

  //       data.features.forEach((feature) => {
  //         const featureNameLower =
  //           feature.properties[featureName].toLowerCase();
  //         // console.log(`${featureName}: ${featureNameLower}`);

  //         // Get all the AQ data points for the matching feature
  //         const aqDataForFeature = AQData.data.filter(
  //           (aqData) =>
  //             aqData[`${featureName}_name`].toLowerCase() === featureNameLower
  //         );
  //         // console.log("aqDataForFeature:", aqDataForFeature);

  //         if (aqDataForFeature.length > 0) {
  //           if (!feature.properties.hasOwnProperty("param_values")) {
  //             feature.properties.param_values = {};
  //           }

  //           // Set the AQ data values for each parameter
  //           aqDataForFeature.forEach((aqData) => {
  //             feature.properties.param_values[aqData.param_name] =
  //               aqData.param_value;
  //             feature.properties.number_of_sensors = aqData.number_of_sensors;
  //           });
  //         }
  //       });

  //       // console.log("data after merging AQ and Geo Data");
  //       // console.log(data);

  //       return data;
  //     }

  //     // Example usage:
  //     const filteredDistrictsGeojson = mergeAQAndGeoData(
  //       AQData,
  //       data,
  //       "district"
  //     );
  //     setFilteredDistrictsGeojson(filteredDistrictsGeojson);
  //     setDistrictsSensorData(sensorGeoJSON);
  //     setIsLoading(false);

  //     // handle data loading and error state
  //     if (isLoading) {
  //       // Handle loading state
  //       console.log("Loading District Data...");
  //     } else if (isError) {
  //       // Handle error state
  //       console.log("Error in fetching District Data...");
  //     } else {
  //       // filteredDivisionsGeojson contains the data you need
  //       if (data.features.length > 0) {
  //         setCurrentLayer("District");
  //         setBounds(featureBounds);
  //         //set hasDrilledDown to true
  //         setHasDrilledDown(true);
  //       } else {
  //         alert("No districts found for the selected Division");
  //         setSelectedFeature(null);
  //         setSelectedFeatureName(null);
  //         setHasDrilledDown(false);
  //         return;
  //       }
  //     }

  //     // increment layer number, new val: 2
  //     setLayerNo(layerNo + 1);

  //     // console.log(layerNo);
  //   };

  //   // call getData function
  //   getData();
  // }

  const createDistrictAQDataQueryParams = (adminLevel) => {
    return {
      admin_level: adminLevel,
      params: "pm2.5cnc,pm10cnc,temp,humidity,so2ppb,no2ppb,o3ppb,co",
    };
  };

  const buildDistrictSensorDataQueryParams = (adminLevel, adminID) => {
    return {
      admin_level: adminLevel,
      admin_id: adminID,
    };
  };

  const fetchDistrictGeoData = async (dataLayerName, cql_filter) => {
    const { data, isLoading, isError } = await getGeoDataV2(
      dataLayerName,
      cql_filter
    );

    if (isLoading) {
      console.log(`Loading ${dataLayerName} Data...`);
    } else if (isError) {
      console.log(`Error in fetching ${dataLayerName} Data...`);
    }

    return data;
  };

  const divisionDrillDown = async (e) => {
    const { divisionID, divisionName, divisionBounds } = getDivisionInfo(e);

    const cql_filter = `division=\'${divisionName}\'`;

    const AQDataQueryParams = createDistrictAQDataQueryParams("district");
    const sensorDataQueryParams = buildDistrictSensorDataQueryParams(
      "division",
      divisionID
    );

    setIsLoading(true);

    const AQData = await fetchAQData(AQDataQueryParams);
    const sensorData = await fetchSensorData(sensorDataQueryParams);
    const sensorGeoJSON = createSensorGeoJSON(sensorData);
    const geoData = await fetchDistrictGeoData(
      districtDataLayerName,
      cql_filter
    );

    const mergedData = mergeAQAndGeoData(AQData, geoData, "district");
    handleDivisionDrillDownResults(mergedData, sensorGeoJSON, divisionBounds);
    setSelectedDivision(divisionName);
  };

  const getDivisionInfo = (e) => {
    return {
      divisionID: e.target.feature.properties.id,
      divisionName: e.target.feature.properties.division,
      divisionBounds: e.target._bounds,
    };
  };

  const handleDivisionDrillDownResults = (
    filteredDistrictsGeojson,
    sensorGeoJSON,
    divisionBounds
  ) => {
    setFilteredDistrictsGeojson(filteredDistrictsGeojson);
    setDistrictsSensorData(sensorGeoJSON);
    setIsLoading(false);

    if (filteredDistrictsGeojson.features.length > 0) {
      setCurrentLayer("District");
      setBounds(divisionBounds);
      setHasDrilledDown(true);
    } else {
      alert("No districts found for the selected Division");
      setSelectedFeature(null);
      setSelectedFeatureName(null);
      setHasDrilledDown(false);
    }

    setLayerNo((prevLayerNo) => prevLayerNo + 1);
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////  DISTRICT DRILL DOWN  /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // function to handle  click on a District
  function districtDrillDown(e) {
    const districtID = e.target.feature.properties.id;
    const districtName = e.target.feature.properties.district;
    featureBounds = e.target._bounds;

    // fetch local sensor data for the selected district
    const sensorDataQueryParams = {
      admin_level: "district",
      district_id: districtID,
    };

    const getData = async () => {
      setIsLoading(true);
      try {
        const sensorData = await fetchSensorData(sensorDataQueryParams);
        // console.log("Sensor Data: ");
        // console.log(sensorData);

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
        // console.log("Sensor GeoJSON: ");
        // console.log(sensorGeoJSON);

        setLocalSensorData(sensorGeoJSON);
        setBounds(featureBounds);
        setCurrentLayer("Local");
        setHasDrilledDown(true);
      } catch (error) {
        console.log("Error fetching sensor data:", error);
        setLocalSensorData(null); // reset the local sensor data
        setBounds(featureBounds);
        setCurrentLayer("District");
        setHasDrilledDown(true);
      }
      setIsLoading(false);
    };

    getData();
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

  // This has been shifted to DrillUpButton.jsx component

  //===============================================================
  //===============================================================
  //
  // END OF MAIN CODE
  //
  //===============================================================
  //===============================================================

  // Render map layers based on currentLayer state
  // Polygon Layers
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

  // Marker Layers
  // State Sensor Markers
  const StateSensorsLayer = () => {
    return <GeoJSON data={statesSensorData} />;
  };

  // Division Sensor Markers
  const DivisionSensorsLayer = () => {
    return <GeoJSON data={divisionsSensorData} />;
  };

  // District Sensor Markers
  const DistrictSensorsLayer = () => {
    return <GeoJSON data={districtsSensorData} />;
  };

  // Local Sensor Markers
  const LocalSensorsLayer = () => {
    return <GeoJSON data={localSensorData} />;
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
      {/* Render map layers based on currentLayer value */}

      {/* State GeoJSON Layers */}
      {currentLayer === "State" && (
        <>
          {showSensorLayer && <StateSensorsLayer />}
          <IndiaLayer />
        </>
      )}

      {/* Division GeoJSON Layers */}
      {currentLayer === "Division" && (
        <>
          {showSensorLayer && <DivisionSensorsLayer />}
          <FilteredDivisionLayer />
        </>
      )}

      {/* Division GeoJSON Layers */}
      {currentLayer === "District" && (
        <>
          {showSensorLayer && <DistrictSensorsLayer />}
          <FilteredDistrictLayer />
        </>
      )}

      {/* Local GeoJSON Layers */}
      {currentLayer === "Local" && (
        <>
          {showSensorLayer && <LocalSensorsLayer />}
          <FilteredDistrictLayer />
        </>
      )}

      {/* Fit Map Bounds */}
      {bounds.length !== 0 && <ZoomtoBounds bounds={bounds} />}
    </MapContainer>
  );
}

export default LeafletMap;
