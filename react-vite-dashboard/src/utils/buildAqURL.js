// function to build the URL for the Air Quality API
function buildAQUrl(baseURL, defaultParameters = {}) {
    const urlSearchParams = new URLSearchParams();

    // Add non-null default parameters to the URL search params object
    Object.entries(defaultParameters).forEach(([key, value]) => {
        if (value !== null) {
            urlSearchParams.append(key, value);
        }
    });

    // Construct the dynamic URL by appending the query string to the base URL
    const queryString = urlSearchParams.toString();
    const dynamicURL = `${baseURL}${queryString ? `?${queryString}` : ""}`;

    return dynamicURL;
}

export default buildAQUrl;
