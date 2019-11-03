import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

let Weather = () => {
  const [weather, setWeather] = useState({
    currentTemperature: "",
    currentHumidity: "",
    currentPressure: ""
  });

  const endpoint = 'http://localhost:3000';

  useEffect( () => {
    const fetchData = async () => {
      const result = await axios.get(endpoint + '/api/weather');
      setWeather({
        currentTemperature: result.data.temperature,
        currentHumidity: result.data.humidity,
        currentPressure: result.data.pressure
      });
    };
    // Fetch latest data from the server
    fetchData();
    // Setup the socket.io socket to listen to new weather
    const socket = socketIOClient(endpoint);
    socket.on("WeatherAPI", data => console.log(data));
  }, []);

  return (
    <div id="Weather" className="InfoBlock">
      <h2>Météo courante</h2>
      <div className="WeatherLabelValue">
        <span className="Label">Température:</span>
        <span className="Value">{weather.currentTemperature}°C</span>
      </div>
      <div className="WeatherLabelValue">
        <span className="Label">Humidité:</span>
        <span className="Value">{weather.currentHumidity}%</span>
      </div>
      <div className="WeatherLabelValue">
        <span className="Label">Pression:</span>
        <span className="Value">{weather.currentPressure}</span>
      </div>
    </div>
  );
};

export default Weather;
