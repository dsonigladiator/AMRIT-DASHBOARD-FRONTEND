import React from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

function ZoomtoBounds(polygonBounds) {
  const map = useMap();
  // console.log("Map center:", map.getBounds());
  // console.log("polygonBounds");
  // console.log(polygonBounds);
  const lat1 = polygonBounds.bounds._southWest.lat;
  const lng1 = polygonBounds.bounds._southWest.lng;
  const lat2 = polygonBounds.bounds._northEast.lat;
  const lng2 = polygonBounds.bounds._northEast.lng;
  // const newBounds = [[23.87194074,77.09623614],[30.40518721,84.62944844]]
  const newBounds = [
    [lat1, lng1],
    [lat2, lng2],
  ];

  // map.fitBounds(newBounds);
  map.flyToBounds(newBounds);
  return null;
}

export default ZoomtoBounds;
