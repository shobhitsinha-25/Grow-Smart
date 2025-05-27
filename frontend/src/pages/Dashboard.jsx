import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";

const GaugeChart = ({ value, min = 0, max = 100, label }) => {
  const gaugeData = [
    { value: value - min }, // Filled part
    { value: max - value }, // Empty part
  ];

  const COLORS = ["orange", "red"]; // Colors for filled and empty segments

  return (
    <div style={{ textAlign: "center", margin: "20px 10px" }}>
      <PieChart width={200} height={150}>
        <Pie
          data={gaugeData}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={70}
          dataKey="value"
          stroke="none"
        >
          {gaugeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <p style={{ marginTop: "-80px", fontSize: "20px", fontWeight: "bold" }}>
        {value} {label}
      </p>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const apibaseurl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }

    // Fetch weather data
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`${apibaseurl}/weather`); 
        const data = await response.json();
        if (response.ok && data.length) {
          setWeatherData(data); 
        } else {
          console.error("No weather data found.");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [navigate]);

  // Prepare historical data for charts
  const historicalData = weatherData || [];
  const latestData = weatherData ? weatherData[weatherData.length-1] : null;

  return (
    <div>
      <DashboardNavbar />
      <div className="mt-[100px] bg-black text-white">
        {latestData ? (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 mt-[3px]">Weather Data</h2>

            {/* Gauges for latest data */}
            <div className="flex justify-center mt-[10px]">
              <GaugeChart value={latestData.temperature} min={0} max={50} label="°C" />
              <GaugeChart value={latestData.humidity} min={0} max={100} label="" />
              <GaugeChart value={latestData.soilMoisture} min={0} max={100} label="" />
            </div>

            {/* Section for Historical Data and Charts */}
            <div className="flex justify-between ">
              <div style={{ width: "48%" }}>
                {/* Line Chart for historical data */}
                <h3 className="text-lg font-semibold mb-4">Historical Data (Line Chart)</h3>
                <LineChart width={600} height={300} data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="humidity" stroke="#8884d8" />
                  <Line type="monotone" dataKey="soilMoisture" stroke="#ffc658" />
                </LineChart>
              </div>
              <div style={{ width: "48%" }}>
                {/* Bar Chart for historical data */}
                <h3 className="text-lg font-semibold mb-4">Historical Data (Bar Chart)</h3>
                <BarChart width={600} height={300} data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="temperature" fill="#82ca9d" />
                  <Bar dataKey="humidity" fill="#8884d8" />
                  <Bar dataKey="soilMoisture" fill="#ffc658" />
                </BarChart>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <footer className="bg-black text-white text-center py-4">
        &copy; {new Date().getFullYear()} All Rights Reserved By Team Grow Smart.
      </footer>
    </div>
  );
};

export default Dashboard;
