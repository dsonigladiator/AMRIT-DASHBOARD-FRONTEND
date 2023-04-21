// This function calculates the sampling value for the given startDateTime and endDateTime and the given sampling interval

export default function calculateSamplingValue(startDateTime, endDateTime, sampling) {

    // check if sampling is valid
    if (sampling !== 'days' && sampling !== 'hours') {
        alert('Sampling must be either "days" or "hours"!');
        return null;
    }

    // get the start and end date values as Date objects
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    // compute the difference between start and end date in seconds
    const diff = (end - start) / 1000

    // check if startDate is less than endDate
    if (diff < 0) {
        alert('End date must be greater than start date!');
        return null;
    }

    let samplingValue;
    // calculate difference in days
    var daysDiff = diff / (24 * 60 * 60);
    // calculate difference in hours but add the days difference to it to get the total hours, plus 1 to include the start date
    var hoursDiff = (diff / (60 * 60)) + daysDiff + 1;

    if (sampling === 'days') {
        // // calculate difference in days
        // daysDiff = diff / (24 * 60 * 60);

        // check if the difference is at least 24 hours
        if (daysDiff < 1) {
            alert('The difference between start and end date must be at least 24 hours');
            return null;
        }
        samplingValue = Math.ceil(daysDiff);
    } else {
        // // calculate difference in hours
        // hoursDiff = (diff / (60 * 60)) + daysDiff;
        samplingValue = Math.ceil(hoursDiff);
    }

    return samplingValue;
}