import React, {
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import DataContext from "../contexts/Data.Context.js";
import "../styles/DrillUpButton.css";
import L from "leaflet";

function DrillUpButton() {
  const { layerNo, setLayerNo } = useContext(DataContext);
  const { currentLayer, setCurrentLayer } = useContext(DataContext);
  const { bounds, setBounds } = useContext(DataContext);
  const { hasDrilledDown, setHasDrilledDown } = useContext(DataContext);
  const { filteredDivisionGeojson, setFilteredDivisionGeojson } =
    useContext(DataContext);
  const { filteredDistrictsGeojson, setFilteredDistrictsGeojson } =
    useContext(DataContext);
  const { setSelectedFeature } = useContext(DataContext);
  const [isVisible, setIsVisible] = useState(false);
  const { statesData } = useContext(DataContext);
  const { filteredDivisionsGeojson } = useContext(DataContext);

  // set some bounds for drill up
  var indiaBounds = L.geoJSON(statesData).getBounds();
  var filteredDivisionBounds = L.geoJSON(filteredDivisionsGeojson).getBounds();
  // var districtBounds;
  var featureBounds;

  const layerName = useMemo(() => {
    if (layerNo === 2) {
      return "State";
    } else if (layerNo === 3) {
      return "Division";
    } else {
      return "";
    }
  }, [layerNo]);

  const drillUp = () => {
    // district layer -> division layer
    if (layerNo === 3) {
      setCurrentLayer("Division");
      setBounds(filteredDivisionBounds);
      setFilteredDistrictsGeojson(null);
      setLayerNo(layerNo - 1);
      setSelectedFeature("Select Feature");
    }
    // division layer -> state layer
    else if (layerNo === 2) {
      setCurrentLayer("State");
      setBounds(indiaBounds);
      setFilteredDivisionGeojson(null);
      setLayerNo(layerNo - 1);
      setSelectedFeature("Select Feature");
      setHasDrilledDown(false);
    }
    // state layer -> no drill up possible
    else if (layerNo === 1) {
      alert("No drill up possible at this level.");
    }
  };

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
