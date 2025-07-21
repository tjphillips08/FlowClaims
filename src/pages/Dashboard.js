import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const [claims, setClaims] = useState([]);
  const [locationCounts, setLocationCounts] = useState({});
  const [statusCounts, setStatusCounts] = useState({});
  const [weatherCounts, setWeatherCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcess = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/claims");
        const rawClaims = await res.json();

        const _statusCounts = {};
        const _weatherCounts = {};
        const _locationCounts = {};

        for (const claim of rawClaims) {
          // Status
          _statusCounts[claim.status] = (_statusCounts[claim.status] || 0) + 1;

          // Weather
          const weather = claim.weatherSummary || "Unknown";
          _weatherCounts[weather] = (_weatherCounts[weather] || 0) + 1;

          // Location (from backend now)
          const loc = claim.locationName || "Unknown";
          _locationCounts[loc] = (_locationCounts[loc] || 0) + 1;
        }

        setClaims(rawClaims);
        setStatusCounts(_statusCounts);
        setWeatherCounts(_weatherCounts);
        setLocationCounts(_locationCounts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load claims or process data", err);
        setLoading(false);
      }
    };

    fetchAndProcess();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  // Status Bar Chart
  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Claims by Status",
        data: Object.values(statusCounts),
        backgroundColor: "skyblue"
      }
    ]
  };

  // Weather Pie Chart
  const weatherLabels = Object.keys(weatherCounts);
  const weatherValues = Object.values(weatherCounts);

  const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#C9CBCF", "#8BC34A", "#E91E63", "#00BCD4"
  ];
  const weatherColors = weatherLabels.map((_, idx) => colors[idx % colors.length]);

  const weatherData = {
    labels: weatherLabels,
    datasets: [
      {
        label: "Claims by Weather",
        data: weatherValues,
        backgroundColor: weatherColors
      }
    ]
  };

  // Location Bar Chart
  const locationData = {
    labels: Object.keys(locationCounts),
    datasets: [
      {
        label: "Claims by Location",
        data: Object.values(locationCounts),
        backgroundColor: "lightgreen"
      }
    ]
  };

  return (
    <div className="container mt-5">
      <h2>📊 Dashboard</h2>

      <div className="mb-5">
        <h4>Claim Status Distribution</h4>
        <Bar data={statusData} />
      </div>

      <div className="mb-5">
        <h4>Claims by Weather Summary</h4>
        <Pie data={weatherData} />
      </div>

      <div className="mb-5">
        <h4>Claims by Location (City or State)</h4>
        <Bar data={locationData} />
      </div>
    </div>
  );
}
