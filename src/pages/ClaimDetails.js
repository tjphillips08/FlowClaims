import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { claims } from "../api/mockData";


export default function ClaimDetails() {
    const { id } = useParams();
    const claim = claims.find((c) => c.id === parseInt(id));
    const [notes, setNotes] = useState([]);
    const [noteInput, setNoteInput] = useState("");
  
    if (!claim) {
      return (
        <div>
          <h2>Claim Not Found</h2>
          <Link to="/claims" className="btn btn-secondary mt-3">Back to Claims</Link>
        </div>
      );
    }
  
    const handleAddNote = () => {
      if (noteInput.trim() !== "") {
        setNotes([{ text: noteInput, date: new Date().toLocaleString() }, ...notes]);
        setNoteInput("");
      }
    };
  
    return (
      <div>
        <h2 className="mb-4">🔍 Claim Details</h2>
  
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            Claim #{claim.id}
          </div>
          <div className="card-body">
            <h5 className="card-title">{claim.name}</h5>
            <p className="card-text">
              <strong>Status:</strong>{" "}
              <span className={`badge bg-${
                claim.status === "Completed" ? "success" :
                claim.status === "In Progress" ? "primary" :
                "warning"
              }`}>{claim.status}</span>
            </p>
            <p className="card-text"><strong>Date:</strong> {claim.date}</p>
            <p className="card-text"><strong>Description:</strong> This is a placeholder description for the claim submitted by {claim.name}.</p>
          </div>
        </div>
  
        {/* Notes Section */}
        <div className="card mb-4">
          <div className="card-header">🗒️ Claim Notes</div>
          <div className="card-body">
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Add a note..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
              ></textarea>
            </div>
            <button className="btn btn-outline-primary mb-3" onClick={handleAddNote}>Add Note</button>
  
            {notes.length === 0 ? (
              <p className="text-muted">No notes added yet.</p>
            ) : (
              <ul className="list-group">
                {notes.map((note, index) => (
                  <li key={index} className="list-group-item">
                    <small className="text-muted d-block">{note.date}</small>
                    {note.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
  
        <Link to="/claims" className="btn btn-outline-secondary">← Back to Claims List</Link>
      </div>
    );
  }
  