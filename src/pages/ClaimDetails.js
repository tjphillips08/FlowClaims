import { useParams, Link } from "react-router-dom";
import { claims } from "../api/mockData";

export default function ClaimDetails() {
  const { id } = useParams();
  const claim = claims.find((c) => c.id === parseInt(id));

  if (!claim) {
    return (
      <div>
        <h2>Claim Not Found</h2>
        <Link to="/claims" className="btn btn-secondary mt-3">Back to Claims</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">🔍 Claim Details</h2>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          Claim #{claim.id}
        </div>
        <div className="card-body">
          <h5 className="card-title">{claim.name}</h5>
          <p className="card-text"><strong>Status:</strong> 
            <span className={`badge ms-2 bg-${
              claim.status === "Completed" ? "success" :
              claim.status === "In Progress" ? "primary" :
              "warning"
            }`}>{claim.status}</span>
          </p>
          <p className="card-text"><strong>Date:</strong> {claim.date}</p>
          <p className="card-text"><strong>Description:</strong> This is a placeholder description for the claim submitted by {claim.name}.</p>
        </div>
      </div>

      <Link to="/claims" className="btn btn-outline-secondary">← Back to Claims List</Link>
    </div>
  );
}
