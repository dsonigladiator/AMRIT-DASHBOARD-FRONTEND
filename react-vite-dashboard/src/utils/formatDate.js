// This file contains functions to format the date and time for the API call

// This function formats the date and time for the start date
export const formatStartDate = (date) => {

    // Get the year, month, day, and hours from the date object
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();

    // Pad the month, day, and hours with a 0 if they are less than 10
    const pad = (num) => String(num).padStart(2, '0');
    const formattedMonth = pad(month);
    const formattedDay = pad(day);
    const formattedHours = pad(hours);

    // Return the formatted date and time
    return `${year}-${formattedMonth}-${formattedDay}T${formattedHours}:00:00`;
};

// This function formats the date and time for the end date
export const formatEndDate = (date) => {

    // Get the year, month, day, and hours from the date object
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();

    // Pad the month, day, and hours with a 0 if they are less than 10
    const pad = (num) => String(num).padStart(2, '0');
    const formattedMonth = pad(month);
    const formattedDay = pad(day);
    const formattedHours = pad(hours);

    // Return the formatted date and time
    return `${year}-${formattedMonth}-${formattedDay}T${formattedHours}:59:59`;
};
