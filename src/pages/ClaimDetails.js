import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ClaimDetails() {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [locationName, setLocationName] = useState("Loading location...");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/claims/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Claim not found");
        return res.json();
      })
      .then((data) => {
        setClaim(data);
        setNotes(data.notes || []);
        setLoading(false);

        // Reverse geocode if lat/lng present
        if (data.latitude && data.longitude) {
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}`
          )
            .then((res) => res.json())
            .then((locationData) => {
              const address = locationData.address || {};
              // Prefer city, town, village, then fallback to display_name
              const name =
                address.city ||
                address.town ||
                address.village ||
                locationData.display_name ||
                "Unknown location";
              setLocationName(name);
            })
            .catch(() => setLocationName("Unknown location"));
        } else {
          setLocationName("Location not available");
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddNote = async () => {
    if (noteInput.trim() === "") return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/add-to-claim/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: noteInput }),
      });

      if (!response.ok) throw new Error("Failed to add note");

      const newNote = await response.json();
      setNotes((prev) => [newNote, ...prev]);
      setNoteInput("");
    } catch (err) {
      console.error(err);
      alert("Error adding note.");
    }
  };

  if (loading) return <div>Loading claim details...</div>;
  if (error)
    return (
      <div>
        <h2>Error: {error}</h2>
        <Link to="/claims" className="btn btn-secondary mt-3">
          Back to Claims
        </Link>
      </div>
    );

  return (
    <div>
      <h2 className="mb-4">🔍 Claim Details</h2>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">Claim #{claim.id}</div>
        <div className="card-body">
          <h5 className="card-title">{claim.claimantName}</h5>

          <p className="card-text">
            <strong>Status:</strong>{" "}
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
          </p>

          <p className="card-text">
            <strong>Date:</strong> {new Date(claim.receivedDate).toLocaleDateString()}
          </p>

          {/* Location Name */}
          <p className="card-text">
            <strong>Location:</strong> {locationName}
          </p>

          {/* Weather Summary */}
          <p className="card-text">
            <strong>Weather Summary:</strong>{" "}
            {claim.weatherSummary ? (
              <span>{claim.weatherSummary}</span>
            ) : (
              <em>No weather data available</em>
            )}
          </p>
        </div>
      </div>

      {/* Notes Section */}
      <div className="card mb-4">
        <div className="card-header">🗒️ Notes</div>
        <div className="card-body">
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Add a note..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
          </div>
          <button className="btn btn-outline-primary mb-3" onClick={handleAddNote}>
            Add Note
          </button>

          {notes.length === 0 ? (
            <p className="text-muted">No notes added yet.</p>
          ) : (
            <ul className="list-group">
              {notes.map((note, index) => (
                <li key={index} className="list-group-item">
                  <small className="text-muted d-block">
                    {new Date(note.createdAt).toLocaleString()}
                  </small>
                  {note.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Link to="/claims" className="btn btn-outline-secondary">
        ← Back to Claims List
      </Link>
    </div>
  );
}
