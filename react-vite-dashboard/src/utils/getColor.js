// function to get color based on value
export default function getColor(d) {
    return d > 50
        ? "#9A0000"
        : d > 40
            ? "#FF5728"
            : d > 30
                ? "#F59F43"
                : d > 20
                    ? "#FAE26C"
                    : d > 10
                        ? "#CBF826"
                        : "#2B7602";
}
