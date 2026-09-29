
const locationInput = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");

const weatherContent = document.getElementById("weatherContent");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

// Weather elements
const cityName = document.getElementById("cityName");
const dateTime = document.getElementById("dateTime");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const feelsLike = document.getElementById("feelsLike");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const uv = document.getElementById("uv");
const cloud = document.getElementById("cloud");

const weatherSummary = document.getElementById("weatherSummary");
const lastUpdated = document.getElementById("lastUpdated");


// Search button
searchBtn.addEventListener("click", () => {
    searchWeather();
});


// Enter key
locationInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchWeather();
    }

});


// Main function
async function searchWeather() {

    const location = locationInput.value.trim();

    if (location === "") {
        showError("Please enter a city or location.");
        return;
    }

    hideError();

    weatherContent.style.display = "none";
    loading.style.display = "block";

    try {

        const url =
    `http://localhost:3000/weather?location=${encodeURIComponent(location)}`;

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Unable to find this location.");
        }

        displayWeather(data);

    } catch (error) {

        console.error(error);

        showError(
            error.message ||
            "Something went wrong. Please try again."
        );

    } finally {

        loading.style.display = "none";

    }
}


// Display weather
function displayWeather(data) {

    const location = data.location;
    const current = data.current;

    // Location
    cityName.textContent =
        `${location.name}, ${location.country}`;

    // Date and time
    const localDate = new Date(location.localtime);

    dateTime.textContent = localDate.toLocaleString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );

    // Main weather
    temperature.textContent =
        Math.round(current.temp_c);

    feelsLike.textContent =
        `${Math.round(current.feelslike_c)}°C`;

    condition.textContent =
        current.condition.text;

    // Weather icon
    weatherIcon.src =
        current.condition.icon.startsWith("//")
            ? "https:" + current.condition.icon
            : current.condition.icon;

    weatherIcon.alt =
        current.condition.text;


    // Details
    humidity.textContent =
        `${current.humidity}%`;

    wind.textContent =
        `${current.wind_kph} km/h`;

    pressure.textContent =
        `${current.pressure_mb} mb`;

    visibility.textContent =
        `${current.vis_km} km`;

    uv.textContent =
        current.uv;

    cloud.textContent =
        `${current.cloud}%`;


    // Weather summary
    weatherSummary.textContent =
        getWeatherMessage(
            current.temp_c,
            current.condition.text
        );


    // Last updated
    lastUpdated.textContent =
        current.last_updated;


    // Show app
    weatherContent.style.display = "block";
}


// Dynamic weather message
function getWeatherMessage(temp, condition) {

    const weather = condition.toLowerCase();

    if (weather.includes("rain")) {
        return "Don't forget your umbrella. It looks like a rainy day!";
    }

    if (weather.includes("snow")) {
        return "A chilly snowy day. Stay warm and enjoy the weather!";
    }

    if (weather.includes("sunny")) {
        return "It's a bright and sunny day. Perfect time to get outside!";
    }

    if (weather.includes("cloud")) {
        return "A cloudy day is ahead. Comfortable weather for a relaxing day.";
    }

    if (temp >= 35) {
        return "It's very hot outside. Stay hydrated and avoid excessive sun.";
    }

    if (temp <= 10) {
        return "It's quite cold outside. Grab something warm before heading out.";
    }

    return "The weather looks comfortable today. Have a wonderful day!";
}


// Show error
function showError(message) {

    errorText.textContent = message;

    errorMessage.style.display = "flex";

    weatherContent.style.display = "none";
}


// Hide error
function hideError() {

    errorMessage.style.display = "none";

}


// Default location
window.addEventListener("load", () => {

    locationInput.value = "London";

    searchWeather();

});

