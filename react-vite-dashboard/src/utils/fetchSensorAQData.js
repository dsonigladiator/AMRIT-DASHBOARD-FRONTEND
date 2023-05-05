// This function fetches the sensor AQ data from the API

// util imports
import buildSensorURL from "./buildSensorURL.js";

// function to fetch the sensor AQ data from the API asynchonously
async function fetchSensorAQData(queryParams, fallbackQueryParams = null) {
    const baseURL = "http://18.221.91.95:81/devices/data";
    const defaultParams = {
        device_id: null,
        params: null,
        from_date: null,
        to_date: null,
        sampling: null,
        sampling_value: null,
    };

    const mergedParams = { ...defaultParams, ...queryParams };
    const dynamicURL = buildSensorURL(baseURL, mergedParams);

    try {
        const response = await fetch(dynamicURL);

        if (!response.ok) {
            if (response.status === 404 && fallbackQueryParams) {
                console.warn('Error 404: Retrying with fallback AQDataQueryParams');
                const fallbackMergedParams = { ...defaultParams, ...fallbackQueryParams };
                const fallbackDynamicURL = buildSensorURL(baseURL, fallbackMergedParams);
                const fallbackResponse = await fetch(fallbackDynamicURL);

                if (!fallbackResponse.ok) {
                    throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
                }

                const contentType = fallbackResponse.headers.get("Content-Type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Invalid response type. Expected JSON");
                }

                const data = await fallbackResponse.json();
                return data;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid response type. Expected JSON");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching sensor air quality data: ${error}`);
        throw error;
    }
}

export default fetchSensorAQData;