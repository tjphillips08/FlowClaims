import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewClaim() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    claimantName: "",
    status: "Received",
    receivedDate: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      (error) => {
        console.error("Geolocation error:", error);
        setGeoError("Location access denied. Location will not be saved.");
      }
    );
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.claimantName.trim()) errs.claimantName = "Name is required.";
    if (!formData.receivedDate) errs.receivedDate = "Date is required.";
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("${process.env.REACT_APP_API_BASE_URL}/claims", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to submit claim");

        await response.json();
        navigate("/claims");
      } catch (error) {
        setSubmitStatus("Error submitting claim. Please try again.");
        console.error("Submit error:", error);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">📝 New Claim</h2>

      {geoError && (
        <div className="alert alert-warning" role="alert">
          ⚠️ {geoError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="claimantName" className="form-label">Claimant Name</label>
          <input
            type="text"
            className={`form-control ${errors.claimantName ? "is-invalid" : ""}`}
            id="claimantName"
            name="claimantName"
            value={formData.claimantName}
            onChange={handleChange}
          />
          {errors.claimantName && <div className="invalid-feedback">{errors.claimantName}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Received">Received</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="receivedDate" className="form-label">Date</label>
          <input
            type="date"
            className={`form-control ${errors.receivedDate ? "is-invalid" : ""}`}
            id="receivedDate"
            name="receivedDate"
            value={formData.receivedDate}
            onChange={handleChange}
          />
          {errors.receivedDate && <div className="invalid-feedback">{errors.receivedDate}</div>}
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Latitude</label>
            <input type="text" className="form-control" value={formData.latitude} disabled />
          </div>
          <div className="col">
            <label className="form-label">Longitude</label>
            <input type="text" className="form-control" value={formData.longitude} disabled />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Submit Claim</button>
      </form>

      {submitStatus && (
        <div className={`mt-3 alert ${submitStatus.includes("Error") ? "alert-danger" : "alert-success"}`}>
          {submitStatus}
        </div>
      )}
    </div>
  );
}
