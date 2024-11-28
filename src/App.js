import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";

// Styled Components
const AppContainer = styled.div`
  font-family: "Arial", sans-serif;
  min-height: 100vh;
  background: url('/background.jpg') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

const WeatherContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 800px;
  max-width: 90%;
`;

const LeftBox = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  padding: 20px;
  text-align: left;
  color: white;
  flex: 1;
`;

const RightBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ForecastBox = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 15px;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
  width: 100%;
`;

const ForecastCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  min-width: 100px;

  h4 {
    margin: 5px 0;
  }

  img {
    width: 50px;
  }

  p {
    margin: 5px 0;
    font-size: 14px;
  }
`;

const SearchBar = styled.div`
  margin-bottom: 20px;
  display: flex;

  input {
    padding: 10px;
    font-size: 16px;
    border-radius: 6px 0 0 6px;
    border: 1px solid #ddd;
    width: 300px;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0 6px 6px 0;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

// App Component
function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [city, setCity] = useState("Toronto"); // Default city
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY; // API Key from .env file

  // Fetch Weather Data
  const fetchWeatherData = useCallback(async () => {
    if (!city.trim()) return; // Validate city input
    setLoading(true);
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(weatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setForecastData(forecastResponse.data.list.slice(0, 6)); // 6 days
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  }, [city, API_KEY]);

  // Trigger data fetch when city changes
  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // Handle city search
  const handleSearch = () => {
    if (searchCity.trim()) setCity(searchCity);
  };

  return (
    <AppContainer>
      <SearchBar>
        <input
          type="text"
          placeholder="Search for a city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </SearchBar>

      {loading ? (
        <p>Loading...</p>
      ) : weatherData ? (
        <WeatherContainer>
          <LeftBox>
            <h1>{new Date().toLocaleDateString("en-US", { weekday: "long" })}</h1>
            <h3>{new Date().toLocaleDateString()}</h3>
            <h2>
              {weatherData.name} - {weatherData.sys.country}
            </h2>
            <h1>{Math.round(weatherData.main.temp)}°C</h1>
            <p>{weatherData.weather[0].description}</p>
          </LeftBox>

          <RightBox>
            <h3>Forecast:</h3>
            <ForecastBox>
              {forecastData.map((day) => (
                <ForecastCard key={day.dt}>
                  <h4>
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </h4>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt="Weather Icon"
                  />
                  <p>{Math.round(day.main.temp)}°C</p>
                  <p>{day.weather[0].description}</p>
                </ForecastCard>
              ))}
            </ForecastBox>
          </RightBox>
        </WeatherContainer>
      ) : (
        <p>No data available for "{city}".</p>
      )}
    </AppContainer>
  );
}

export default App;
