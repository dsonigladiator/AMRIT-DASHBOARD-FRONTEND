import getColor from "./getColor";

// define geojson style for each State
export const indiaGeoJSONStyle = (feature) => {
    if (
        feature.properties.state === "Uttar Pradesh" ||
        feature.properties.state === "Bihar"
    ) {
        return {
            fillColor: "magenta",
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
export const divisionGeoJSONStyle = (feature) => {
    return {
        fillColor: "mediumspringgreen",
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9,
    };
};

// Style for each district
export const districtGeoJSONStyle = (feature) => {
    return {
        fillColor: "magenta",
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9,
    };
};

// ===========================================================================
// ===========================================================================
//
// NEW STYLES BASED ON API DATA
//
// ===========================================================================
// ===========================================================================

// define geojson style for each State
export const indiaGeoJSONStyleV1 = (feature) => {
    if (feature.properties.param_value
    ) {
        return {
            fillColor: getColor(feature.properties.param_value),
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
    return {
        fillColor: getColor(feature.properties.param_value),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9,
    };
};

// Style for each district
export const districtGeoJSONStyleV1 = (feature) => {
    return {
        fillColor: getColor(feature.properties.param_value),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9,
    };
};
