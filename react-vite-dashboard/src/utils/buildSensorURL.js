// function to build the dynamic URL for the sensor data API
function buildSensorURL(baseURL, params = {}) {

    // Create a URLSearchParams object to hold the query string parameters
    const urlSearchParams = new URLSearchParams();

    // Add non-null parameters to the URL search params object
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null) {
            urlSearchParams.append(key, value);
        }
    });

    // Construct the dynamic URL by appending the query string to the base URL
    const queryString = urlSearchParams.toString();
    const dynamicURL = `${baseURL}${queryString ? `?${queryString}` : ""}`;

    // Return the dynamic URL
    return dynamicURL;
}

export default buildSensorURL;
