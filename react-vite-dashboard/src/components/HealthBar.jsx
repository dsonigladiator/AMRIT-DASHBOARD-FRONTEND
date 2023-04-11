import React from "react";

const HealthBar = ({ value = 0 }) => {
  const percent =
    Math.max(0, Math.min(100, Math.round((value * 100) / 60))) + "%"; // ensure value is within 0-100 and map 60 to 100%
  let color = "#D3D3D3"; // gray
  if (value < 10) {
    color = "#00FF00"; // green
  } else if (value < 20) {
    color = "#66FF00"; // yellowish-green
  } else if (value < 30) {
    color = "#99FF00"; // light yellow
  } else if (value < 40) {
    color = "#CCFF00"; // yellow
  } else if (value < 50) {
    color = "#FFCC00"; // orange
  } else if (value >= 50) {
    color = "#FF0000"; // red
  }
  const style = {
    width: percent,
    backgroundColor: color,
    height: "10px",
    borderRadius: "5px",
  };
  return (
    <div style={{ width: "100%", height: "12px" }}>
      <div style={style}></div>
    </div>
  );
};

export default HealthBar;
