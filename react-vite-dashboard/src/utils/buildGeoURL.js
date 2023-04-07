// function to build the url for the geoserver API
const buildGeoUrl = (typeName, cql = null) => {
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

    const parameters = { ...defaultParameters, typeName };
    if (cql) {
        parameters.cql_filter = cql;
    }
    const queryString = Object.entries(parameters)
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

    var dynamicurl = `${baseUrl}?${queryString}`;
    return dynamicurl;
};

export default buildGeoUrl;
