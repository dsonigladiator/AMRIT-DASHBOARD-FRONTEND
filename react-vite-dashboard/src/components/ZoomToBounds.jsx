// This component is used to zoom to the bounds of the polygon

// React Imports
import React from "react";

// Leaflet Imports
import { useMap } from "react-leaflet";
import L from "leaflet";

// This component is used to zoom to the bounds of the polygon
function ZoomtoBounds(polygonBounds) {
  // import map from Leaflet
  const map = useMap();

  // get the bounds of the polygon
  const lat1 = polygonBounds.bounds._southWest.lat;
  const lng1 = polygonBounds.bounds._southWest.lng;
  const lat2 = polygonBounds.bounds._northEast.lat;
  const lng2 = polygonBounds.bounds._northEast.lng;

  // create a new bounds array
  const newBounds = [
    [lat1, lng1],
    [lat2, lng2],
  ];

  // zoom to the bounds of the polygon
  // map.fitBounds(newBounds);
  map.flyToBounds(newBounds);
  return null;
}

export default ZoomtoBounds;
