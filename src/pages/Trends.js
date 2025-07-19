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

export default function TrendsPage() {
  const [claims, setClaims] = useState([]);
  const [locationCounts, setLocationCounts] = useState({});
  const [statusCounts, setStatusCounts] = useState({});
  const [weatherCounts, setWeatherCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const locationCache = {};

  const reverseGeocode = async (lat, lon) => {
    const key = `${lat},${lon}`;
    if (locationCache[key]) return locationCache[key];

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      const locationName =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.state ||
        data.display_name ||
        "Unknown";
      locationCache[key] = locationName;
      return locationName;
    } catch (error) {
      console.error("Reverse geocode error:", error);
      return "Unknown";
    }
  };

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

          // Location
          const loc = await reverseGeocode(claim.latitude, claim.longitude);
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

  if (loading) return <div>Loading trends...</div>;

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

  const weatherLabels = Object.keys(weatherCounts);
const weatherValues = Object.values(weatherCounts);

// Generate a distinct color for each label
const colors = [
  "#FF6384", // red
  "#36A2EB", // blue
  "#FFCE56", // yellow
  "#4BC0C0", // teal
  "#9966FF", // purple
  "#FF9F40", // orange
  "#C9CBCF", // gray
  "#8BC34A", // green
  "#E91E63", // pink
  "#00BCD4"  // cyan
];

// Repeat colors if there are more labels than colors
const backgroundColor = weatherLabels.map((_, idx) => colors[idx % colors.length]);

const weatherData = {
  labels: weatherLabels,
  datasets: [
    {
      label: "Claims by Weather",
      data: weatherValues,
      backgroundColor
    }
  ]
};


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
      <h2>📊 Trends Dashboard</h2>

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
