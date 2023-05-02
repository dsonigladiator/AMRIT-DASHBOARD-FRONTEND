// This component is used to drill up from lower layers to higher layers

// React Imports
import React, {
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";

// Context Imports
import DataContext from "../contexts/Data.Context.js";

// style imports
import "../styles/DrillUpButton.css";

// Leaflet Imports
import L from "leaflet";

function DrillUpButton() {
  // layer number and current layer
  const { layerNo, setLayerNo } = useContext(DataContext);
  const { currentLayer, setCurrentLayer } = useContext(DataContext);

  // bounds and hasDrilledDown and isVisble
  const { bounds, setBounds } = useContext(DataContext);
  const { hasDrilledDown, setHasDrilledDown } = useContext(DataContext);
  const [isVisible, setIsVisible] = useState(false);

  // geo data names
  const { selectedState } = useContext(DataContext);
  const { selectedDivision } = useContext(DataContext);

  // geo data
  const { filteredDivisionGeojson, setFilteredDivisionGeojson } =
    useContext(DataContext);
  const { filteredDistrictsGeojson, setFilteredDistrictsGeojson } =
    useContext(DataContext);
  const { statesData } = useContext(DataContext);
  const { filteredDivisionsGeojson } = useContext(DataContext);

  // selected feature name
  const { setSelectedFeatureName } = useContext(DataContext);

  // set some bounds for drill up
  var indiaBounds = L.geoJSON(statesData).getBounds();
  var filteredDivisionBounds = L.geoJSON(filteredDivisionsGeojson).getBounds();

  // layer name to be displayed on button
  const layerName = useMemo(() => {
    if (layerNo === 2) {
      return "State";
    } else if (layerNo === 3) {
      return "Division";
    } else {
      return "";
    }
  }, [layerNo]);

  // drill up function
  const drillUp = () => {
    // district layer -> division layer
    if (layerNo === 3) {
      setCurrentLayer("Division");
      setBounds(filteredDivisionBounds);
      setFilteredDistrictsGeojson(null);
      setLayerNo(layerNo - 1);
      setSelectedFeatureName(selectedDivision);
    }
    // division layer -> state layer
    else if (layerNo === 2) {
      setCurrentLayer("State");
      setBounds(indiaBounds);
      setFilteredDivisionGeojson(null);
      setLayerNo(layerNo - 1);
      setSelectedFeatureName(selectedState);
      setHasDrilledDown(false);
    }
    // state layer -> no drill up possible
    else if (layerNo === 1) {
      alert("No drill up possible at this level.");
    }
  };

  // set visibility of button
  useEffect(() => {
    setIsVisible(hasDrilledDown);
  }, [hasDrilledDown]);

  return (
    <button
      className={`drillup-btn ${isVisible ? "visible" : "hidden"}`}
      onClick={drillUp}
    >
      Drill Up to {layerName} Level
    </button>
  );
}

export default DrillUpButton;
