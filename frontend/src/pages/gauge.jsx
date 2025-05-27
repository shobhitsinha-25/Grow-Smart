import React from "react";
import { PieChart, Pie, Cell, Label } from "recharts";

const GaugeChart = ({ value, min = 0, max = 100 }) => {
  const gaugeData = [
    { value: value - min }, // Filled part
    { value: max - value }, // Empty part
  ];

  const COLORS = ["blue", "#d9d9d9"]; // Green for filled and light grey for empty

  return (
    <div style={{ textAlign: "center", margin: "20px 0", position: "relative" }}>
      <PieChart width={200} height={200}>
        <Pie
          data={gaugeData}
          startAngle={180}
          endAngle={0}
          innerRadius={50}
          outerRadius={80}
          dataKey="value"
          stroke="none"
          cornerRadius={10} // Rounded corners for smoother transition
        >
          {gaugeData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index]}
              stroke="none"
            />
          ))}
        </Pie>
        <Label
          value={value}
          position="center"
          fontSize="22"
          fontWeight="bold"
          fill="#333"
          style={{ textAnchor: "middle" }}
        />
      </PieChart>

      {/* Adding a shadow effect around the gauge */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
          padding: "10px",
          borderRadius: "50%",
        }}
      />
      
    </div>
  );
};

export default GaugeChart;
