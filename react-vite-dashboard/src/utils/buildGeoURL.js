// function to build the url for the geoserver API
const buildGeoUrl = (typeName, cql = null) => {

    // define the base url and default parameters
    const baseUrl = "https://geonode.communitygis.in/geoserver/ows";
    const defaultParameters = {
        service: "WFS",
        version: "1.0.0",
        request: "GetFeature",
        outputFormat: "application/json",
        srs: "EPSG:4326",
        srsName: "EPSG:4326",
        access_token: "P9o1msbwJs4TMF0PosP6tg1ZX0Pcjt",
    };

    // create new parameters object with default parameters and the typeName
    const parameters = { ...defaultParameters, typeName };

    // add the cql filter if it is not null
    if (cql) {
        parameters.cql_filter = cql;
    }

    // create the query string from the new parameters object
    const queryString = Object.entries(parameters)
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

    // construct the dynamic url by appending the query string to the base url
    var dynamicurl = `${baseUrl}?${queryString}`;

    // return the dynamic url
    return dynamicurl;
};

export default buildGeoUrl;
