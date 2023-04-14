// This component is used to display an error message when the GeoData component fails to fetch data from the API.
// NOTE: This component is not used in the current version of the app. It is kept here for future reference.

// React Imports
import React from "react";

const GeoDataError = ({ message }) => {
  return <div>Failed to fetch data: {message}</div>;
};

export default GeoDataError;
