import { useState } from "react";
import { claims as mockClaims } from "../api/mockData";
import { Link } from "react-router-dom";

export default function ClaimList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredClaims = mockClaims.filter((claim) => {
    const matchesSearch = claim.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);

  return (
    <div>
      <h2 className="mb-4">📋 Claims List</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-6">
          <select className="form-select" value={statusFilter} onChange={handleStatusChange}>
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
            <th>Name</th>
            <th>Status</th>
            <th>Date</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredClaims.map((claim) => (
            <tr key={claim.id}>
              <td>{claim.id}</td>
              <td>{claim.name}</td>
              <td>
                <span className={`badge bg-${
                  claim.status === "Completed" ? "success" :
                  claim.status === "In Progress" ? "primary" :
                  "warning"
                }`}>
                  {claim.status}
                </span>
              </td>
              <td>{claim.date}</td>
              <td>
                <Link to={`/claims/${claim.id}`} className="btn btn-sm btn-outline-primary">
                  View
                </Link>
              </td>
            </tr>
          ))}
          {filteredClaims.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">No claims found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

  