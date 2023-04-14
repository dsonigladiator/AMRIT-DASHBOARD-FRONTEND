// This file contains the style for each geojson layer - State, Division, District
// Based on the selected pollutant, the style is applied to the geojson layer

// react imports
import { useContext } from "react";

// context imports
import DataContext from "../contexts/Data.Context.js";

// utils imports
import getColor from "./getColor";


// define the geojson style for each State
export const indiaGeoJSONStyleV1 = (feature) => {

    // get the selected pollutant from the context to use in the style
    const { selectedPollutant } = useContext(DataContext);

    // check if the feature has the selected pollutant data
    if (feature.properties.param_values && feature.properties.param_values[selectedPollutant]) {
        return {
            fillColor: getColor(feature.properties.param_values[selectedPollutant]),
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
        };
    }
    // if the feature does not have the selected pollutant data, return a default style
    else {
        return {
            fillColor: "#e6ffe6",
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
        };
    }
};

// define the geojson style for each Division
export const divisionGeoJSONStyleV1 = (feature) => {

    // get the selected pollutant from the context to use in the style
    const { selectedPollutant } = useContext(DataContext);

    // check if the feature has the selected pollutant data
    if (feature.properties.param_values && feature.properties.param_values[selectedPollutant]) {
        return {
            fillColor: getColor(feature.properties.param_values[selectedPollutant]),
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
        };
    }
    // if the feature does not have the selected pollutant data, return a default style
    else {
        return {
            fillColor: "#ffe6f3",
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
        };
    }
};

// define the geojson style for each District
export const districtGeoJSONStyleV1 = (feature) => {

    // get the selected pollutant from the context to use in the style
    const { selectedPollutant } = useContext(DataContext);

    // check if the feature has the selected pollutant data
    if (feature.properties.param_values && feature.properties.param_values[selectedPollutant]) {
        return {
            fillColor: getColor(feature.properties.param_values[selectedPollutant]),
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
        };
    }
    // if the feature does not have the selected pollutant data, return a default style
    else {
        return {
            fillColor: "#e6ccff",
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
        };
    }
};
