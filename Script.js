// ===============================
// API KEY
// ===============================

const apiKey = "e2344e5934454aca800214406262407";

// ===============================
// HTML ELEMENTS
// ===============================

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const locationBtn = document.getElementById("locationBtn");

const cityName = document.getElementById("cityName");
const country = document.getElementById("country");

const weatherEmoji = document.getElementById("weatherEmoji");

const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const feelsLike = document.getElementById("feelsLike");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const visibility = document.getElementById("visibility");
const uv = document.getElementById("uv");

const currentBtn = document.getElementById("currentBtn");
const hourlyBtn = document.getElementById("hourlyBtn");
const forecastBtn = document.getElementById("forecastBtn");

const hourlyContainer = document.getElementById("hourlyContainer");
const forecastContainer = document.getElementById("forecastContainer");

const historyBox = document.getElementById("history");

const loading = document.getElementById("loading");

// Stores latest searched city
let currentCity = "";

// ===============================
// SEARCH BUTTON
// ===============================

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  getWeather(city);
});

// Enter key search

cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

// ===============================
// LOCATION BUTTON
// ===============================

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      getWeather(`${lat},${lon}`);
    });
  } else {
    alert("Location not supported");
  }
});

// ===============================
// BUTTON SWITCHING
// ===============================

currentBtn.addEventListener("click", () => {
  hourlyContainer.style.display = "none";

  forecastContainer.style.display = "none";
});

hourlyBtn.addEventListener("click", () => {
  hourlyContainer.style.display = "flex";

  forecastContainer.style.display = "none";
});

forecastBtn.addEventListener("click", () => {
  forecastContainer.style.display = "flex";

  hourlyContainer.style.display = "none";
});

// ===============================
// GET CURRENT WEATHER
// ===============================

async function getWeather(city) {
  showLoading();

  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`;

    const response = await fetch(url);

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    currentCity = data.location.name;

    displayCurrentWeather(data);

    displayHourly(data);

    displayForecast(data);

    saveHistory(currentCity);

    changeBackground(data.current.condition.text);
  } catch (error) {
    alert(error.message);
  } finally {
    hideLoading();
  }
}

// ===============================
// DISPLAY CURRENT WEATHER
// ===============================

function displayCurrentWeather(data) {
  cityName.textContent = data.location.name;

  country.textContent = data.location.country;

  temperature.textContent = `${data.current.temp_c}°C`;

  condition.textContent = data.current.condition.text;

  feelsLike.textContent = `Feels Like: ${data.current.feelslike_c}°C`;

  humidity.textContent = `${data.current.humidity}%`;

  wind.textContent = `${data.current.wind_kph} km/h`;

  visibility.textContent = `${data.current.vis_km} km`;

  uv.textContent = data.current.uv;

  weatherEmoji.textContent = getEmoji(data.current.condition.text);
}

// ===============================
// HOURLY FORECAST
// ===============================

function displayHourly(data) {
  hourlyContainer.innerHTML = "";

  const hours = data.forecast.forecastday[0].hour;

  hours.forEach((hour) => {
    const card = document.createElement("div");

    card.className = "forecast-card";

    card.innerHTML = `

            <h3>
            ${hour.time.split(" ")[1]}
            </h3>


            <div class="emoji">

            ${getEmoji(hour.condition.text)}

            </div>


            <p>
            ${hour.temp_c}°C
            </p>


            <p>
            ${hour.condition.text}
            </p>

        `;

    hourlyContainer.appendChild(card);
  });
}

// ===============================
// 3 DAY FORECAST
// ===============================

function displayForecast(data) {
  forecastContainer.innerHTML = "";

  data.forecast.forecastday.forEach((day) => {
    const card = document.createElement("div");

    card.className = "forecast-card";

    card.innerHTML = `

        <h3>
        ${day.date}
        </h3>


        <div class="emoji">

        ${getEmoji(day.day.condition.text)}

        </div>


        <p>
        ${day.day.avgtemp_c}°C
        </p>


        <p>
        ${day.day.condition.text}
        </p>


        `;

    forecastContainer.appendChild(card);
  });
}

// ===============================
// WEATHER EMOJIS
// ===============================

function getEmoji(weather) {
  weather = weather.toLowerCase();

  if (weather.includes("sun")) return "☀️";

  if (weather.includes("clear")) return "🌙";

  if (weather.includes("cloud")) return "☁️";

  if (weather.includes("rain")) return "🌧️";

  if (weather.includes("storm")) return "⛈️";

  if (weather.includes("snow")) return "❄️";

  if (weather.includes("mist") || weather.includes("fog")) return "🌫️";

  return "🌤️";
}

// ===============================
// SEARCH HISTORY
// ===============================

function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("cities")) || [];

  if (!history.includes(city)) {
    history.unshift(city);

    history = history.slice(0, 5);

    localStorage.setItem("cities", JSON.stringify(history));
  }

  displayHistory();
}

function displayHistory() {
  historyBox.innerHTML = "";

  let history = JSON.parse(localStorage.getItem("cities")) || [];

  history.forEach((city) => {
    const item = document.createElement("div");

    item.className = "history-item";

    item.textContent = city;

    item.onclick = () => {
      getWeather(city);
    };

    historyBox.appendChild(item);
  });
}

// ===============================
// BACKGROUND CHANGE
// ===============================

function changeBackground(weather) {
  document.body.className = "";

  weather = weather.toLowerCase();

  if (weather.includes("rain")) document.body.classList.add("rainy");
  else if (weather.includes("cloud")) document.body.classList.add("cloudy");
  else if (weather.includes("snow")) document.body.classList.add("snowy");
  else if (weather.includes("storm")) document.body.classList.add("storm");
  else document.body.classList.add("sunny");
}

// ===============================
// LOADING
// ===============================

function showLoading() {
  loading.style.display = "block";
}

function hideLoading() {
  loading.style.display = "none";
}

// Load history when page opens

displayHistory();
