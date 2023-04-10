import buildGeoUrl from "./buildGeoURL.js";

export default async function getGeoDataV2(typename, cql = null) {
    const url = buildGeoUrl(typename, cql);

    let isLoading = false;
    let isError = false;

    try {
        isLoading = true;
        const res = await fetch(url, { mode: "cors" });
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
    } catch (err) {
        console.log("err caught while fetching geojson data");
        console.log(err);
        isError = true;
        isLoading = false;
    }

    return {
        data: null,
        isLoading,
        isError,
    };
}
