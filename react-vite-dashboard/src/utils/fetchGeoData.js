// This function fetches the geojson data from the API
// It uses the SWR library to cache the data and re-fetch it when the query params change
// It fetches all the data at once and then filters it based on the query params
// NOTE: This function is not used in the app, but is kept here for reference

// React imports
import useSWR from "swr";

// Define fetcher function
const fetcher = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

const fetchGeoData = () => {
    // state level data url
    const indiaGeojsonUrl =
        "https://geonode.communitygis.in/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=geonode%3AIndia_States_Simplified_V2&outputFormat=json&srs=EPSG%3A4326&srsName=EPSG%3A4326&access_token=P9o1msbwJs4TMF0PosP6tg1ZX0Pcjt";

    // division level data url
    const allDivisionDataUrl =
        "https://geonode.communitygis.in/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=geonode%3AIndia_Divisions_Merged_V1&outputFormat=json&srs=EPSG%3A4326&srsName=EPSG%3A4326&access_token=0mU5RiHQRcUmsFQbBrghUOmrEwM0OX";

    // district level data url
    const allDistrictDataUrl =
        "https://geonode.communitygis.in/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=geonode%3AIndia_Districts_Merged_Simplified_V1&outputFormat=json&srs=EPSG%3A4326&srsName=EPSG%3A4326&access_token=0mU5RiHQRcUmsFQbBrghUOmrEwM0OX";

    // Fetch India states data
    const { data: statesData, error: statesError } = useSWR(
        indiaGeojsonUrl,
        fetcher
    );

    // Fetch All division data
    const { data: allDivisionData, error: allDivisionDataFetchError } = useSWR(
        allDivisionDataUrl,
        fetcher
    );

    // Fetch All district data
    const { data: allDistrictData, error: allDistrictDataFetchError } = useSWR(
        allDistrictDataUrl,
        fetcher
    );

    return {
        statesData,
        allDivisionData,
        allDistrictData,
        statesError,
        allDivisionDataFetchError,
        allDistrictDataFetchError,
    };
};

export default fetchGeoData;
