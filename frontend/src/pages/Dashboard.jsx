import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";  // Import socket.io-client
import DashboardNavbar from "./DashboardNavbar";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, BarChart, Bar,
} from "recharts";
import RainStatus from "./RainStatus";
import LottieLoader from "./Loader";

const GaugeChart = ({ value, min = 0, max = 100, label }) => {
  const gaugeData = [{ value: value - min }, { value: max - value }];
  const COLORS = ["orange", "red"];

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
      <div style={{ marginTop: "-100px", textAlign: "center" }}>
        <p style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
          {value} {label.includes("°C") ? "°C" : label.includes("%") ? "%" : ""}
        </p>
        <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
          {label.includes("Temperature")
            ? "Temperature"
            : label.includes("Humidity")
            ? "Humidity"
            : label.includes("Soil Moisture")
            ? "Soil Moisture"
            : ""}
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState([]);
  const [isDark, setIsDark] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const apibaseurl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
    const timeout = setTimeout(() => setShowLoader(false), 5000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  // Fetch initial weather data on mount
  useEffect(() => {
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
  }, [apibaseurl]);

  // Socket.io real-time updates
  useEffect(() => {
    const socket = io(apibaseurl); // Connect to your backend Socket.IO server

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    // Listen for new sensor data event from backend
    socket.on("newSensorData", (newData) => {
      console.log("New sensor data received:", newData);
      // Add new data to the front of the weatherData array (assuming latest first)
      setWeatherData(prevData => [newData, ...prevData]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [apibaseurl]);

  const historicalData = weatherData.slice(0, 7).reverse();
  const latestData = weatherData[0] || null;

  const toggleDarkMode = () => setIsDark(!isDark);

  return (
    <div className={isDark ? "dark" : ""}>
      <DashboardNavbar isDark={isDark} toggleDarkMode={toggleDarkMode} />

      <div className="mt-[100px] bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        {latestData ? (
          <div className="p-4">
            <h2 className="text-[30px] font-bold mt-[2px] text-center">
              Real-Time Weather & Soil Stats
            </h2>
            <div className="flex justify-center">
              <GaugeChart value={latestData.temperature} min={0} max={50} label="°C (Temperature)" />
              <GaugeChart value={latestData.humidity} min={0} max={100} label="(% Humidity)" />
              <GaugeChart value={latestData.soilMoisture} min={0} max={100} label="(% Soil Moisture)" />
            </div>

            <div className="flex justify-between">
              <div style={{ width: "48%" }}>
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
            <RainStatus rainDetected={latestData?.rainDetected} />
          </div>
        ) : showLoader ? (
          <LottieLoader />
        ) : null}
      </div>

      <footer className="bg-black text-white text-center py-4">
        &copy; {new Date().getFullYear()} All Rights Reserved By Team Grow Smart.
      </footer>
    </div>
  );
};

export default Dashboard;
