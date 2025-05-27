import React, { useState } from 'react';

const SaveWeatherData = () => {
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [soilMoisture, setSoilMoisture] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const weatherData = {
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      soilMoisture: parseFloat(soilMoisture),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/weather`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weatherData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Weather data saved:', data);
      } else {
        console.error('Error saving weather data:', data.message);
      }
    } catch (error) {
      console.error('Error saving weather data:', error);
    }
  };

  return (
    <div>
      <h2>Save Weather Data</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Temperature:
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </label>
        <br />
        <label>
          Humidity:
          <input
            type="number"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
          />
        </label>
        <br />
        <label>
          Soil Moisture:
          <input
            type="number"
            value={soilMoisture}
            onChange={(e) => setSoilMoisture(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Save Weather Data</button>
      </form>
    </div>
  );
};

export default SaveWeatherData;
