// // This function fetches the air quality data from the API

// // util imports
// import buildAQUrl from "./buildAqURL.js";

// // function to fetch the air quality data from the API asynchonously
// async function fetchAQData(queryParams) {

//     // Define the base URL and default parameters
//     const baseURL = "http://18.221.91.95:81/data";
//     const defaultParams = {
//         admin_level: null,
//         params: null,
//         admin_id: null,
//         from_date: null,
//         to_date: null,
//         sampling: null,
//         sampling_value: null,
//     };

//     // Merge the default params with the query params
//     const mergedParams = { ...defaultParams, ...queryParams };

//     // Build the dynamic URL using the merged params
//     const dynamicURL = buildAQUrl(baseURL, mergedParams);

//     try {
//         // Fetch the data from the dynamic URL
//         const response = await fetch(dynamicURL);

//         // Check that the response is OK, if not throw an error
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         // Check that the response is JSON, if not throw an error
//         const contentType = response.headers.get("Content-Type");
//         if (!contentType || !contentType.includes("application/json")) {
//             throw new Error("Invalid response type. Expected JSON");
//         }

//         // Parse the response JSON and return it
//         const data = await response.json();

//         // return the data
//         return data;
//     }
//     catch (error) {
//         // Log the error and re-throw it if necessary
//         console.error(`Error fetching air quality data: ${error}`);
//         throw error;
//     }
// }

// export default fetchAQData;

import buildAQUrl from "./buildAqURL.js";

async function fetchAQData(queryParams, fallbackQueryParams = null) {
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

    const mergedParams = { ...defaultParams, ...queryParams };
    const dynamicURL = buildAQUrl(baseURL, mergedParams);

    try {
        const response = await fetch(dynamicURL);

        if (!response.ok) {
            if (response.status === 404 && fallbackQueryParams) {
                console.warn('Error 404: Retrying with fallback AQDataQueryParams');
                const fallbackMergedParams = { ...defaultParams, ...fallbackQueryParams };
                const fallbackDynamicURL = buildAQUrl(baseURL, fallbackMergedParams);
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
        console.error(`Error fetching air quality data: ${error}`);
        throw error;
    }
}

export default fetchAQData;