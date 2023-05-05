// This function fetches the sensor IMEI data from the API as point data

// util imports
import buildSensorURL from "./buildSensorURL.js";

// function to fetch the sensor IMEI Geo data from the API asynchonously
async function fetchSensorGeoData(queryParams) {

    // Define the base URL and default parameters for Sensor API
    const baseURL = "http://18.221.91.95:81/devices";
    const defaultParams = {
        admin_level: null,
        admin_id: null,
    };

    // Merge the default params with the query params
    const mergedParams = { ...defaultParams, ...queryParams };

    // Build the dynamic URL using the merged params
    const dynamicURL = buildSensorURL(baseURL, mergedParams);

    // Fetch the data from the dynamic URL
    try {
        // Fetch the data from the dynamic URL
        const response = await fetch(dynamicURL);

        // Check that the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check that the response is JSON
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid response type. Expected JSON");
        }

        // Parse the response JSON and return it
        const data = await response.json();

        // return the data
        return data;
    }
    catch (error) {
        // Log the error and re-throw it if necessary
        console.error(`Error fetching sensor data: ${error}`);
        throw error;
    }
}

export default fetchSensorGeoData;
