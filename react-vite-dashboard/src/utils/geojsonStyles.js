import getColor from "./getColor";
import { useContext } from "react";
import DataContext from "../contexts/Data.Context.js";

// define geojson style for each State
export const indiaGeoJSONStyleV1 = (feature) => {
    const { selectedPollutant } = useContext(DataContext);
    if (feature.properties.param_values && feature.properties.param_values[selectedPollutant]) {
        return {
            fillColor: getColor(feature.properties.param_values[selectedPollutant]),
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
        };
    } else {
        return {
            fillColor: "#e6ffe6",
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
        };
    }
};

// style for each Division
export const divisionGeoJSONStyleV1 = (feature) => {
    const { selectedPollutant } = useContext(DataContext);
    if (feature.properties.param_values && feature.properties.param_values[selectedPollutant]) {
        return {
            fillColor: getColor(feature.properties.param_values[selectedPollutant]),
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
        };
    } else {
        return {
            fillColor: "#ffe6f3",
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
        };
    }
};

// Style for each district
export const districtGeoJSONStyleV1 = (feature) => {
    const { selectedPollutant } = useContext(DataContext);
    if (feature.properties.param_values && feature.properties.param_values[selectedPollutant]) {
        return {
            fillColor: getColor(feature.properties.param_values[selectedPollutant]),
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
        };
    } else {
        return {
            fillColor: "#e6ccff",
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
        };
    }
};
