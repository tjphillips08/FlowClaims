import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ClaimList() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    console.log("API base URL:", process.env.REACT_APP_API_BASE_URL);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/claims`)  // Adjust the base URL if different
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch claims");
        return res.json();
      })
      .then((data) => {
        setClaims(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredClaims = claims.filter((claim) => {
    // Adjust property names to match your Claim model fields
    const matchesSearch = claim.claimantName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div>Loading claims...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;

  return (
    <div>
      <h2 className="mb-4">📋 Claims List</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by claimant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Received">Received</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Claimant Name</th>
            <th>Status</th>
            <th>Received Date</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredClaims.length > 0 ? (
            filteredClaims.map((claim) => (
              <tr key={claim.id}>
                <td>{claim.id}</td>
                <td>{claim.claimantName}</td>
                <td>
                  <span
                    className={`badge bg-${
                      claim.status === "Completed"
                        ? "success"
                        : claim.status === "In Progress"
                        ? "primary"
                        : "warning"
                    }`}
                  >
                    {claim.status}
                  </span>
                </td>
                <td>{new Date(claim.receivedDate).toLocaleDateString()}</td>
                <td>
                  <Link
                    to={`/claims/${claim.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No claims found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
