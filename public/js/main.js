// The secret key for the WeatherAPI service.
const key = "da0b890fa3584c76b8b222516252905";

// This function gets the current weather data from the API.
async function getData(key, city) {
    // Tries to fetch data and catches any potential errors.
    try {
        // Fetches the weather data from the API's URL.
        const response = await fetch(
            `http://api.weatherapi.com/v1/current.json?q=${city}&key=${key}`
        );

        // Throws an error if the response from the server is not okay.
        if (!response.ok) {
            throw new Error(`Error Status: ${response.status}`);
        }

        // Converts the API's JSON response into an object.
        const infoFromServer = await response.json();
        
        // Logs the full data to the console for debugging purposes.
        console.log(infoFromServer);

        // Calls the function to display the weather on the page.
        displayWeather(infoFromServer);

    // This part runs if the 'try' block had an error.
    } catch (error) {
        // Gets the results div to show the error message.
        const weatherResultsDiv = document.getElementById('weather-results');
        // This puts a user-friendly error message on the page.
        weatherResultsDiv.innerHTML = `<p style="color: red;">Failed to fetch weather data: ${error.message}. Please check the city name or API key.</p>`;
    }
}

// This function displays the weather information on the page.
function displayWeather(data) {
    // Gets the div where the results will be shown.
    const weatherResultsDiv = document.getElementById('weather-results');
    
    // Clears any old weather results from the div first.
    weatherResultsDiv.innerHTML = '';

    // Checks for valid data before trying to display it.
    if (data && data.location && data.current) {
        // Gets all the specific data points from the object.
        const locationName = data.location.name;
        const country = data.location.country;
        const tempC = data.current.temp_c;
        const tempF = data.current.temp_f;
        const conditionText = data.current.condition.text;
        const conditionIcon = data.current.condition.icon;

        // Builds the HTML to display the weather information.
        weatherResultsDiv.innerHTML = `
            <h2>${locationName}, ${country}</h2>
            <p>Temperature: ${tempC}°C / ${tempF}°F</p>
            <p>Condition: ${conditionText} <img src="${conditionIcon}" alt="${conditionText}"/></p>
            <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind: ${data.current.wind_kph} kph ${data.current.wind_dir}</p>
        `;
    // Shows an error if the data was not valid.
    } else {
        weatherResultsDiv.innerHTML = `<p>Could not retrieve weather data for that city. Please try again.</p>`;
    }
}

// This function searches for locations as the user types.
async function searchLocations(query) {
    // Gets the div for the search results dropdown.
    const searchResultsDiv = document.getElementById('search-results');
    
    // Only starts searching after 3 characters are typed.
    if (query.length < 3) {
        searchResultsDiv.style.display = 'none';
        return;
    }
    
    // Tries to fetch search results from the search API.
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/search.json?key=${key}&q=${query}`);
        if (!response.ok) {
            throw new Error(`Error Status: ${response.status}`);
        }
        const locations = await response.json();
        // Calls the function to display the search results.
        displaySearchResults(locations);
    
    // Hides the dropdown if the search request fails.
    } catch (error) {
        console.warn(`Search error: ${error.message}`);
        searchResultsDiv.style.display = 'none';
    }
}

// Shows the search results in the dropdown menu.
function displaySearchResults(locations) {
    // Gets the dropdown div and then clears it.
    const searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML = '';

    // Checks if the API actually found any locations.
    if (locations && locations.length > 0) {
        // Loops through each location found in the results.
        locations.forEach(location => {
            // Creates a new div for each search result.
            const locationDiv = document.createElement('div');
            
            // Sets the text content for the location div.
            locationDiv.textContent = `${location.name}, ${location.region}, ${location.country}`;
            
            // Adds a click listener to each location div.
            locationDiv.addEventListener('click', () => {
                // Clicking a location gets that city's weather.
                document.getElementById('city-input').value = location.name;
                searchResultsDiv.style.display = 'none';
                getData(key, location.name);
            });
            
            // Adds the new location div to the dropdown box.
            searchResultsDiv.appendChild(locationDiv);
        });
        
        // Makes the entire search dropdown visible.
        searchResultsDiv.style.display = 'block';
    } else {
        // Hides dropdown if no locations were found.
        searchResultsDiv.style.display = 'none';
    }
}

// This code runs only after the page has fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    // Gets all the HTML elements needed for the script.
    const cityInput = document.getElementById('city-input');
    const getWeatherBtn = document.getElementById('get-weather-btn');
    const searchResultsDiv = document.getElementById('search-results');

    // This is the event listener for the button click.
    getWeatherBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            searchResultsDiv.style.display = 'none';
            getData(key, city);
        } else {
            const weatherResultsDiv = document.getElementById('weather-results');
            weatherResultsDiv.innerHTML = `<p style="color: orange;">Please enter a city name.</p>`;
        }
    });
    
    // This listener makes the search-as-you-type work.
    cityInput.addEventListener('input', () => {
        const query = cityInput.value.trim();
        searchLocations(query);
    });

    // This listener allows using the 'Enter' key to search.
    cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            getWeatherBtn.click();
        }
    });
    
    // Hides the dropdown when clicking away from it.
    document.addEventListener('click', (event) => {
        if (!cityInput.contains(event.target) && !searchResultsDiv.contains(event.target)) {
            searchResultsDiv.style.display = 'none';
        }
    });
});