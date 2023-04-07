import buildAQUrl from "./buildAqURL.js";

async function fetchAQData(queryParams) {
    const baseURL = "http://18.221.91.95:81/data";
    const defaultParams = {
        admin_level: null,
        params: null,
        admin_id: null,
        from_date: null,
        to_date: null,
        sampling: null,
        sampling_value: null,
    };

    // Merge the default params with the query params
    const mergedParams = { ...defaultParams, ...queryParams };

    // Build the dynamic URL using the merged params
    const dynamicURL = buildAQUrl(baseURL, mergedParams);

    try {
        // Fetch the data from the dynamic URL
        const response = await fetch(dynamicURL);

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
        return data;
    } catch (error) {
        console.error(`Error fetching air quality data: ${error}`);
        throw error;
    }
}

export default fetchAQData;
