import React, { useContext } from "react";
import DataContext from "../contexts/Data.Context.js";
import "../styles/Card.css";

const Card = () => {
    const { selectedFeature } = useContext(DataContext);

    return (
        <div className="card-container" style={{ backgroundColor: "#ffe6cc" }}>
            <h1>{selectedFeature}</h1>
            <div className="card-item">
                <label>Sensor Details</label>
                <span>4</span>
            </div>
            <div className="card-item">
                <label>Last Update Sensor</label>
                <span>Shipra Mall</span>
            </div>
            <div className="card-item">
                <label>Most Polluted Area</label>
                <span>Shipra Mall</span>
            </div>
            <div className="card-item">
                <label>Statistics</label>
            </div>
            <div className="data-container">
                <div className="data-row">
                    <div className="data-item"><div>PM2.5</div><div>14</div></div>
                    <div className="data-item"><div>PM10</div><div>22</div></div>
                    <div className="data-item"><div>SO2</div><div>13.2</div></div>
                </div>
                <div className="data-row">
                    <div className="data-item">NO2</div>
                    <div className="data-item">O3</div>
                    <div className="data-item">CO</div>
                </div>
            </div>
        </div>
    );
};

export default Card;
