import { useParams } from "react-router-dom";

export default function ClaimDetails() {
  const { id } = useParams();
  return (
    <div>
      <h2 className="mb-4">🔍 Claim Details</h2>
      <p>Viewing details for claim ID: <strong>{id}</strong></p>
    </div>
  );
}
