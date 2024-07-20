// Function to convert timestamp to YYYY-MM-DD format
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
// Function to convert timestamp to YYYY-MM-DD format
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function getDayOfWeek(dt) {
    let wd = dt.getDay(); // 0..6, from sunday
    wd = (wd + 6) % 7 + 1; // 1..7 from monday
    return '' + wd; // string so it gets parsed
}

function timeAgo(dateTime) {
    const now = new Date();
    const then = new Date(dateTime);

    const diffInSeconds = Math.floor((now - then) / 1000);

    const seconds = diffInSeconds % 60;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const minutes = diffInMinutes % 60;
    const diffInHours = Math.floor(diffInMinutes / 60);
    const hours = diffInHours % 24;
    const days = Math.floor(diffInHours / 24);

    let result = '';

    if (days > 0) {
        result += days + ' day' + (days > 1 ? 's' : '') + ' ';
    }
    if (hours > 0) {
        result += hours + ' hour' + (hours > 1 ? 's' : '') + ' ';
    }
    if (minutes > 0) {
        result += minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ';
    }
    if (seconds > 0 || result === '') {
        result += seconds + ' second' + (seconds > 1 ? 's' : '') + ' ';
    }

    return result.trim();
}
function getLatestDateTime(dateTimes) {
    if (!dateTimes || dateTimes.length === 0) {
        throw new Error("The array must contain at least one datetime string.");
    }
    
    return new Date(Math.max(...dateTimes));
}

function getFirstDayOfYearFromArray(dateArray){
    // Find the minimum date
    const minDate = new Date(Math.min(...dateArray));

    // Get the year of the minimum date
    const year = minDate.getFullYear();

    // Get the first date of the year
    return new Date(year, 0, 2);
}
function getLastDayOfYearFromArray(dateArray){
    // Find the maximum date
    const maxDate = new Date(Math.max(...dateArray));

    // Get the year of the maximum date
    const year = maxDate.getFullYear();

    // Get the last date of the month
    return new Date(year + 1, 0, 0); 
}
function getFirstDayOfMonthFromArray(dateArray){
    // Find the minimum date
    const minDate = new Date(Math.min(...dateArray));

    // Get the year and month of the maximum date
    const year = minDate.getFullYear();
    const month = minDate.getMonth();

    // Get the first date of the month
    return new Date(year, month, 1);
}
function getLastDayOfMonthFromArray(dateArray){
    // Find the maximum date
    const maxDate = new Date(Math.max(...dateArray));

    // Get the year and month of the maximum date
    const year = maxDate.getFullYear();
    const month = maxDate.getMonth();

    // Get the last date of the month
    return new Date(year, month + 1, 0); 
}
function exportToJsonFile(data) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
}