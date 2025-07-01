import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ClaimList from "./pages/ClaimList";
import ClaimDetails from "./pages/ClaimDetails";
import NewClaim from "./pages/NewClaim";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link className="navbar-brand" to="/">FlowClaims</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/claims">Claims</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/new-claim">New Claim</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="container my-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/claims" element={<ClaimList />} />
            <Route path="/claims/:id" element={<ClaimDetails />} />
            <Route path="/new-claim" element={<NewClaim />} />
          </Routes>
        </main>

        <footer className="bg-light text-center py-3">
          <small>© 2025 FlowClaims</small>
        </footer>
      </div>
    </Router>
  );
}

export default App;


