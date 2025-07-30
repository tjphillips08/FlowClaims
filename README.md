# 🌪️ FlowClaims – Insurance Claims Dashboard & Heatmap Visualization

FlowClaims is a full-stack application designed to visualize and analyze insurance claim data in real-time. It includes a powerful dashboard, geospatial heatmap, and weather insights to detect trends, support emergency response, and help identify potentially fraudulent claims.

## 🚀 Live Demo

- **Frontend:** [https://flowclaims.netlify.app](https://flowclaims.netlify.app)
- **Backend (Heroku):** [https://flowclaims-backend.herokuapp.com](https://flowclaims-backend.herokuapp.com)

---

## 🛠 Tech Stack

### 🔷 Frontend
- **React** with Hooks
- **MUI (Material UI)** – UI components and gauge charts
- **Leaflet.js** – Interactive map and heatmap overlays
- **Axios** – API communication
- **Netlify** – Deployment

### 🔶 Backend
- **Java Spring Boot**
- **RESTful API**
- **PostgreSQL** (via AWS RDS)
- **OpenWeather API** – Real-time weather data enrichment
- **Heroku** – Deployment

---

## 🌟 Features

### 📍 Geolocation & Weather Integration
- Claims automatically enriched with **reverse geocoded location names** and **current weather conditions** using OpenWeather API.
- Enhances contextual understanding of each claim.

### 🧭 Heatmap Visualization
- **Leaflet heatmap** highlights claim density by:
  - Count
  - Weather severity
  - Status (Open, Closed, In Review)
- Includes filters for **date range**, **status**, and **weather type**.

### 📊 Claims Dashboard
- Charts and gauges for:
  - Claims by status
  - Weather-related trends (e.g., rain vs hail vs clear)
  - Geographic distribution of claims

### 📝 Claim Management
- Submit new claims with address, description, and status
- View claim details enriched with weather summary
- Admin-ready interface to expand with claim approval workflows

---

## 🎯 Benefits

### ✅ Detect & Combat Fraudulent Claims
- Weather-linked claims help validate legitimacy (e.g., hail damage reported on sunny days is flagged).
- Claim clustering in unusual weather conditions can signal suspicious activity.

### ⚠️ Emergency Response & Resource Allocation
- Visualize high-claim regions during severe weather events in real-time.
- Allocate emergency teams more efficiently based on geographic and temporal data trends.

### 📈 Data-Driven Decisions
- Enable insurance analysts and management to spot trends, optimize operations, and improve forecasting.

---


