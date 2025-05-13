import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const SavingsChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getAllSavings");

        const labels = response.data.map((entry) =>
          new Date(entry.createdAt).toLocaleDateString()
        );
        const dataPoints = response.data.map((entry) => entry.remaining);

        setChartData({
          labels,
          datasets: [
            {
              label: "Savings Over Time",
              data: dataPoints,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 2,
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("Error loading savings chart:", error);
      }
    };

    fetchSavings();
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>📈 Savings Over Time</h2>
      <Line data={chartData} />
    </div>
  );
};

export default SavingsChart;
