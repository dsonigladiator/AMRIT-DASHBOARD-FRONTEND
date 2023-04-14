// This function rounds off the digits of a number to 2 decimal places

export default function roundOffDigits(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};