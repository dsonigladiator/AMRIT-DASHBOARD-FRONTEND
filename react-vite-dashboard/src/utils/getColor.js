// This function returns the color based on the selected pollutant and the value of the pollutant

// react imports
import { useContext } from "react";

// context imports
import DataContext from "../contexts/Data.Context.js";

// function to return the color based on the selected pollutant and the value of the pollutant
export default function getColor(value) {

    // get the selected pollutant from the context to determine the color scale
    const { selectedPollutant } = useContext(DataContext);

    // define color scale based on selectedPollutant value for pm2.5cnc, pm10cnc, so2ppb, no2ppb, o3ppb, co
    const colorScale1 = [
        "#00E400",
        "#FFFF00",
        "#FF7E00",
        "#FF0000",
        "#7E0023",
    ];

    // define color scale based on selectedPollutant value for temp
    const colorScale2 = [
        "#053061",
        "#2166ac",
        "#fddbc7",
        "#d6604d",
        "#b2182b",
        "#7E0023",
    ];

    // define color scale based on selectedPollutant value for humidity
    const colorScale3 = [
        "#b9fdff",
        "#a9dcf4",
        "#9da6e5",
        "#cc86ec",
        "#f288ff",
    ];

    // define value ranges based on pollutant
    let range;
    // define good, fair, poor, veryPoor, hazardous values based on pollutant
    let good, fair, poor, veryPoor, hazardous;
    // define veryDry, dry, normal, humid, veryHumid values based on pollutant
    let veryDry, dry, normal, humid, veryHumid;
    // define veryCold, cool, warm, hot, veryHot values based on pollutant
    let veryCold, cool, warm, hot, veryHot;

    // set the label and value ranges based on selectedPollutant
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
            range = 273;
            veryCold = 0;
            cool = 24;
            warm = 30;
            hot = 36;
            veryHot = 40;
            break;
        case "humidity":
            range = 100;
            veryDry = 0;
            dry = 20;
            normal = 40;
            humid = 60;
            veryHumid = 80;
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

    // if pollutant is pm2.5cnc, pm10cnc, so2ppb, no2ppb, o3ppb, or co use colorScale1
    if (
        selectedPollutant === "pm2.5cnc" ||
        selectedPollutant === "pm10cnc" ||
        selectedPollutant === "so2ppb" ||
        selectedPollutant === "no2ppb" ||
        selectedPollutant === "o3ppb" ||
        selectedPollutant === "co"
    ) {

        if (value <= good) {
            color = colorScale1[0];
        } else if (value <= fair) {
            color = colorScale1[1];
        } else if (value <= poor) {
            color = colorScale1[2];
        } else if (value <= veryPoor) {
            color = colorScale1[3];
        } else if (value <= hazardous) {
            color = colorScale1[4];
        } else {
            color = colorScale1[5];
        }
    }

    // if pollutant is temp use colorScale2
    if (selectedPollutant === "temp") {
        if (value <= veryCold) {
            color = colorScale2[0];
        } else if (value <= cool) {
            color = colorScale2[1];
        } else if (value <= warm) {
            color = colorScale2[2];
        } else if (value <= hot) {
            color = colorScale2[3];
        } else if (value <= veryHot) {
            color = colorScale2[4];
        } else {
            color = colorScale2[5];
        }
    }

    // if pollutant is humidity use colorScale3
    if (selectedPollutant === "humidity") {
        if (value <= veryDry) {
            color = colorScale3[0];
        } else if (value <= dry) {
            color = colorScale3[1];
        } else if (value <= normal) {
            color = colorScale3[2];
        } else if (value <= humid) {
            color = colorScale3[3];
        } else if (value <= veryHumid) {
            color = colorScale3[4];
        } else {
            color = colorScale3[5];
        }
    }

    // return color based on value and selectedPollutant
    return color;
}

