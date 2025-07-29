import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ClaimList from "./pages/ClaimList";
import ClaimDetails from "./pages/ClaimDetails";
import NewClaim from "./pages/NewClaim";
import DashboardPage from "./pages/Dashboard";
import HeatMapView from "./pages/HeatMapView";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/">
              🌀 FlowClaims
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/claims">Claims</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/new-claim">New Claim</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/heatmapview">Heat Map</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="container my-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<ClaimList />} />
            <Route path="/claims" element={<ClaimList />} />
            <Route path="/claims/:id" element={<ClaimDetails />} />
            <Route path="/new-claim" element={<NewClaim />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/heatmapview" element={<HeatMapView />} />
          </Routes>
        </main>

        <footer className="bg-light text-center py-3 mt-auto border-top">
          <small>© 2025 FlowClaims — Claims Workflow Tracker</small>
        </footer>
      </div>
    </Router>
  );
}

export default App;
