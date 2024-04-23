////////////////////////////////
// Code by Alexy (MisterIdle) //
////////////////////////////////

// Function to set a cookie with a given name and value
function setCookie(name, value) {
    localStorage.setItem(name, value); // Store the value in the browser's local storage
}

// Function to get the value of a cookie with a given name
function getCookie(name) {
    return localStorage.getItem(name); // Retrieve the value from the browser's local storage
}
