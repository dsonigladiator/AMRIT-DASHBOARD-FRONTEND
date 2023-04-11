import { useContext } from "react";
import DataContext from "../contexts/Data.Context.js";

export default function getColor(value) {
    const { selectedPollutant } = useContext(DataContext);

    // define color scale based on selectedPollutant value
    const colorScale = [
        "#00E400",
        "#FFFF00",
        "#FF7E00",
        "#FF0000",
        "#8F3F97",
        "#7E0023",
    ];

    // define value ranges based on pollutant
    let range;
    let good, fair, poor, veryPoor, hazardous;
    switch (selectedPollutant) {
        case "pm2.5cnc":
            range = 300;
            good = 25;
            fair = 50;
            poor = 100;
            veryPoor = 300;
            hazardous = Number.POSITIVE_INFINITY;
            break;
        case "pm10cnc":
            range = 300;
            good = 40;
            fair = 80;
            poor = 120;
            veryPoor = 300;
            hazardous = Number.POSITIVE_INFINITY;
            break;
        case "so2ppb":
            range = 600;
            good = 60;
            fair = 200;
            poor = 300;
            veryPoor = 600;
            hazardous = Number.POSITIVE_INFINITY;
            break;
        case "no2ppb":
            range = 360;
            good = 100;
            fair = 120;
            poor = 180;
            veryPoor = 360;
            hazardous = Number.POSITIVE_INFINITY;
            break;
        case "o3ppb":
            range = 300;
            good = 50;
            fair = 100;
            poor = 150;
            veryPoor = 300;
            hazardous = Number.POSITIVE_INFINITY;
            break;
        case "co":
            range = 300;
            good = 30;
            fair = Number.POSITIVE_INFINITY;
            poor = 70;
            veryPoor = Number.POSITIVE_INFINITY;
            hazardous = Number.POSITIVE_INFINITY;
            break;
        case "temp":
            range = 50;
            good = -10;
            fair = 10;
            poor = 30;
            veryPoor = 40;
            hazardous = Number.POSITIVE_INFINITY;
            break;
        case "humidity":
            range = 100;
            good = 30;
            fair = 50;
            poor = 70;
            veryPoor = 90;
            hazardous = Number.POSITIVE_INFINITY;
            break;
        default:
            range = 300;
            good = 25;
            fair = 50;
            poor = 100;
            veryPoor = 300;
            hazardous = Number.POSITIVE_INFINITY;
            break;
    }

    // define color based on value and selectedPollutant
    let color;
    if (value <= good) {
        color = colorScale[0];
    } else if (value <= fair) {
        color = colorScale[1];
    } else if (value <= poor) {
        color = colorScale[2];
    } else if (value <= veryPoor) {
        color = colorScale[3];
    } else if (value <= hazardous) {
        color = colorScale[4];
    } else {
        color = colorScale[5];
    }

    return color;
}

