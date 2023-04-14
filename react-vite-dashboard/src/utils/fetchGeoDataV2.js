// This is the new version of the function that fetches the geojson data from the geoserver API

// utils imports
import buildGeoUrl from "./buildGeoURL.js";

// This function fetches the geojson data from the API asynchrnously
export default async function getGeoDataV2(typename, cql = null) {

    // Build the URL
    const url = buildGeoUrl(typename, cql);

    // Define loading and error states
    let isLoading = false;
    let isError = false;

    // Fetch the data
    try {
        isLoading = true;

        // fetch the data
        const res = await fetch(url, { mode: "cors" });

        // check if the response is ok, if not throw an error, else return the data
        if (!res.ok) {
            const error = "GeoJSon response not ok";
            console.log(error);
            isError = true;
            isLoading = false;
        } else {
            const geoData = await res.json();
            return {
                data: geoData,
                isLoading: false,
                isError: false,
            };
        }
    }
    catch (err) {
        console.log("err caught while fetching geojson data");
        console.log(err);
        isError = true;
        isLoading = false;
    }

    // return null data if there is an error or if data is still loading
    return {
        data: null,
        isLoading,
        isError,
    };
}
