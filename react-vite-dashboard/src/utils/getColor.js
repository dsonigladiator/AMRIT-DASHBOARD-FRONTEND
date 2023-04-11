// import { useContext } from "react";
// import DataContext from "../contexts/Data.Context.js";

// export default function getColor(value) {
//     const { selectedPollutant } = useContext(DataContext);

//     // define color scale based on selectedPollutant value
//     let colorScale;
//     switch (selectedPollutant) {
//         case "pm2.5cnc":
//             colorScale = [
//                 "#f1eef6",
//                 "#d0d1e6",
//                 "#a6bddb",
//                 "#67a9cf",
//                 "#1c9099",
//                 "#016c59",
//             ];
//             break;
//         case "pm10cnc":
//             colorScale = [
//                 "#f1eef6",
//                 "#d4b9da",
//                 "#c994c7",
//                 "#df65b0",
//                 "#e7298a",
//                 "#ce1256",
//                 "#91003f",
//             ];
//             break;
//         case "so2ppb":
//             colorScale = [
//                 "#feebe2",
//                 "#fbb4b9",
//                 "#f768a1",
//                 "#c51b8a",
//                 "#7a0177",
//             ];
//             break;
//         case "no2ppb":
//             colorScale = [
//                 "#f1eef6",
//                 "#d0d1e6",
//                 "#a6bddb",
//                 "#67a9cf",
//                 "#1c9099",
//                 "#016c59",
//             ];
//             break;
//         case "o3ppb":
//             colorScale = [
//                 "#e5f5e0",
//                 "#a1d99b",
//                 "#31a354",
//                 "#006d2c",
//                 "#00441b",
//             ];
//             break;
//         case "co":
//             colorScale = [
//                 "#f1eef6",
//                 "#d0d1e6",
//                 "#a6bddb",
//                 "#67a9cf",
//                 "#1c9099",
//                 "#016c59",
//             ];
//             break;
//         case "temp":
//             colorScale = [
//                 "#b2182b",
//                 "#d6604d",
//                 "#f4a582",
//                 "#fddbc7",
//                 "#f7f7f7",
//                 "#d1e5f0",
//                 "#92c5de",
//                 "#4393c3",
//                 "#2166ac",
//             ];
//             break;
//         case "humidity":
//             colorScale = [
//                 "#f7fcfd",
//                 "#e5f5f9",
//                 "#ccece6",
//                 "#99d8c9",
//                 "#66c2a4",
//                 "#41ae76",
//                 "#238b45",
//                 "#006d2c",
//                 "#00441b",
//             ];
//             break;
//         default:
//             colorScale = [
//                 "#f1eef6",
//                 "#d0d1e6",
//                 "#a6bddb",
//                 "#67a9cf",
//                 "#1c9099",
//                 "#016c59",
//             ];
//     }

//     // define color based on value and selectedPollutant
//     let color;
//     if (value <= 20) {
//         color = colorScale[0];
//     } else if (value <= 30) {
//         color = colorScale[1];
//     } else if (value <= 40) {
//         color = colorScale[2];
//     } else if (value <= 50) {
//         color = colorScale[3];
//     } else if (value <= 60) {
//         color = colorScale[4];
//     } else {
//         color = colorScale[5];
//     }
//     return color;
// };


import { useContext } from "react";
import DataContext from "../contexts/Data.Context.js";

export default function getColor(value) {
    const { selectedPollutant } = useContext(DataContext);

    // define color scale based on selectedPollutant value
    const colorScale = [
        "#f1eef6",
        "#d0d1e6",
        "#a6bddb",
        "#67a9cf",
        "#1c9099",
        "#016c59",
    ];

    // define value scales based on pollutant
    let minValue, maxValue;
    switch (selectedPollutant) {
        case "pm2.5cnc":
            minValue = 0;
            maxValue = 60;
            break;
        case "pm10cnc":
            minValue = 0;
            maxValue = 90;
            break;
        case "so2ppb":
            minValue = 0;
            maxValue = 10;
            break;
        case "no2ppb":
            minValue = 0;
            maxValue = 80;
            break;
        case "o3ppb":
            minValue = 0;
            maxValue = 120;
            break;
        case "co":
            minValue = 0;
            maxValue = 300;
            break;
        case "temp":
            minValue = -10;
            maxValue = 40;
            break;
        case "humidity":
            minValue = 0;
            maxValue = 100;
            break;
        default:
            minValue = 0;
            maxValue = 60;
            break;
    }

    // define color based on value and selectedPollutant
    const range = maxValue - minValue;
    const step = range / colorScale.length;
    const index = Math.min(Math.floor((value - minValue) / step), colorScale.length - 1);
    return colorScale[index];
};
