export default function roundOffDigits(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};