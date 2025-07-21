import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

const HeatLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: {
        0.2: 'blue',
        0.4: 'lime',
        0.6: 'yellow',
        0.8: 'orange',
        1.0: 'red',
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

const statusLevels = {
  All: null,
  Received: 1,
  'In Progress': 2,
  Completed: 3,
  Open: 4,
};

const weatherSeverityMap = {
  All: null,
  Clear: 0,
  'Partly Cloudy': 1,
  Rain: 2,
  'Storm/Hail/Snow': 3,
  Extreme: 4,
};

function getWeatherSeverity(weather) {
  if (!weather) return 0;
  const w = weather.toLowerCase();
  const severity = {
    clear: 0,
    sunny: 0,
    'partly cloudy': 1,
    cloudy: 1,
    foggy: 1,
    rain: 2,
    rainy: 2,
    hail: 3,
    storm: 3,
    thunderstorms: 3,
    snow: 3,
    tornado: 4,
    flooding: 4,
    extreme: 4,
  };

  for (const key in severity) {
    if (w.includes(key)) return severity[key];
  }
  return 0;
}

function getStatusLevel(status) {
  return statusLevels[status] ?? 1;
}

const HeatMapView = () => {
  const [allClaims, setAllClaims] = useState([]);
  const [filteredPoints, setFilteredPoints] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedWeather, setSelectedWeather] = useState('All');
  const [selectedDaysAgo, setSelectedDaysAgo] = useState('All');

  const [showMarkers, setShowMarkers] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/heatmap')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setAllClaims(data))
      .catch((e) => console.error('Error fetching heatmap data:', e));
  }, []);

  useEffect(() => {
    const now = new Date();

    const filtered = allClaims.filter((claim) => {
      if (!claim.latitude || !claim.longitude) return false;

      // Date filter
      if (selectedDaysAgo !== 'All') {
        const claimDate = claim.receivedDate ? new Date(claim.receivedDate) : null;
        if (!claimDate) return false;
        const daysAgo = (now - claimDate) / (1000 * 3600 * 24);
        if (daysAgo > Number(selectedDaysAgo)) return false;
      }

      // Status filter
      if (selectedStatus !== 'All') {
        const statusLevel = getStatusLevel(claim.status);
        if (statusLevel !== statusLevels[selectedStatus]) return false;
      }

      // Weather filter
      if (selectedWeather !== 'All') {
        const weatherLevel = getWeatherSeverity(claim.weatherSummary);
        if (weatherLevel !== weatherSeverityMap[selectedWeather]) return false;
      }

      return true;
    });

    const heatPoints = filtered
      .map((claim) => {
        const lat = parseFloat(claim.latitude);
        const lon = parseFloat(claim.longitude);
        if (isNaN(lat) || isNaN(lon)) return null;

        let intensity = 0.4;
        intensity += (getStatusLevel(claim.status) - 1) * 0.15;
        intensity += getWeatherSeverity(claim.weatherSummary) * 0.15;
        intensity = Math.min(1.0, intensity);

        return [lat, lon, intensity];
      })
      .filter(Boolean);

    setFilteredPoints(heatPoints);
  }, [allClaims, selectedStatus, selectedWeather, selectedDaysAgo]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Claims Heatmap</h2>

      <div style={{ marginBottom: 20, display: 'flex', gap: 20 }}>
        <div>
          <label>Status:</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            {Object.keys(statusLevels).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Weather:</label>
          <select value={selectedWeather} onChange={(e) => setSelectedWeather(e.target.value)}>
            {Object.keys(weatherSeverityMap).map((weather) => (
              <option key={weather} value={weather}>
                {weather}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Max Days Ago:</label>
          <select value={selectedDaysAgo} onChange={(e) => setSelectedDaysAgo(e.target.value)}>
            <option value="All">All</option>
            <option value="1">Last 1 day</option>
            <option value="3">Last 3 days</option>
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>

        <label>
          <input
            type="checkbox"
            checked={showMarkers}
            onChange={() => setShowMarkers(!showMarkers)}
          />{' '}
          Show claim points
        </label>
      </div>

      <MapContainer center={[39.5, -98.35]} zoom={4} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatLayer points={filteredPoints} />
        {showMarkers &&
          filteredPoints.map(([lat, lon], idx) => (
            <CircleMarker
              key={idx}
              center={[lat, lon]}
              radius={5}
              color="red"
              fillOpacity={1.0}
              stroke={false}
            />
          ))}
      </MapContainer>
    </div>
  );
};

export default HeatMapView;
