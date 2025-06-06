key = "da0b890fa3584c76b8b222516252905"
// Function to fetch weather data from the WeatherAPI
async function getData(key, city) {
    try {
        // Construct the API URL with the provided city and key
        const response = await fetch(
            `http://api.weatherapi.com/v1/current.json?q=${city}&key=${key}`
        );

        // Check if the response was successful
        if (!response.ok) {
            // If response is not OK (e.g., 404, 401), throw an error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response from the server
        const infoFromServer = await response.json();
        console.log(infoFromServer); // Log the full data to the console

        // Display relevant weather information on the HTML page
        displayWeather(infoFromServer);

    } catch (error) {
        // Catch any errors during the fetch operation or JSON parsing
        console.warn(`Nope: ${error.message}`);
        // Display an error message to the user
        const weatherResultsDiv = document.getElementById('weather-results');
        weatherResultsDiv.innerHTML = `<p style="color: red;">Failed to fetch weather data: ${error.message}. Please check the city name or API key.</p>`;
    }
}

// Function to display weather information on the page
function displayWeather(data) {
    const weatherResultsDiv = document.getElementById('weather-results');
    // Clear previous results
    weatherResultsDiv.innerHTML = '';

    if (data && data.location && data.current) {
        // Extract relevant information from the API response
        const locationName = data.location.name;
        const country = data.location.country;
        const tempC = data.current.temp_c;
        const tempF = data.current.temp_f;
        const conditionText = data.current.condition.text;
        const conditionIcon = data.current.condition.icon;

        // Create HTML content to display the weather data
        weatherResultsDiv.innerHTML = `
            <h2>${locationName}, ${country}</h2>
            <p>Temperature: ${tempC}°C / ${tempF}°F</p>
            <p>Condition: ${conditionText} <img src="${conditionIcon}" alt="${conditionText}"/></p>
            <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind: ${data.current.wind_kph} kph ${data.current.wind_dir}</p>
        `;
    } else {
        // Handle cases where data is not in expected format or city not found
        weatherResultsDiv.innerHTML = `<p>Could not retrieve weather data for that city. Please try again.</p>`;
    }
}

// Event listener to ensure the DOM is fully loaded before attaching events
document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const getWeatherBtn = document.getElementById('get-weather-btn');

    // Add click event listener to the button
    getWeatherBtn.addEventListener('click', () => {
        // Get the city name from the input field
        const city = cityInput.value.trim(); // .trim() removes leading/trailing whitespace
        const apiKey = key; 

        if (city) {
            getData(apiKey, city); // Call getData function with the city and API key
        } else {
            const weatherResultsDiv = document.getElementById('weather-results');
            weatherResultsDiv.innerHTML = `<p style="color: orange;">Please enter a city name.</p>`;
        }
    });

    // Optional: Allow fetching weather by pressing Enter in the input field
    cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            getWeatherBtn.click(); // Simulate a button click
        }
    });
});