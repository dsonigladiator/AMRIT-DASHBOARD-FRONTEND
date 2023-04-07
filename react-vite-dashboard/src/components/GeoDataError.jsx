import React from "react";

const GeoDataError = ({ message }) => {
    return <div>Failed to fetch data: {message}</div>;
};

export default GeoDataError;
