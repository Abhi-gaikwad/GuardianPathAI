import React, { useState } from "react";
import axios from "axios";
import "./FeedbackForm.css";

const FeedbackForm = ({ onFeedbackSubmit }) => { // Changed prop name to be consistent with usage
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    roadCondition: "Good",
    trafficDensity: 0,
    roadQuality: 3,
    safestTime: "Morning",
    accidentOccurred: false,
    accidentCount: 0,
    crimeRate: 0,
    review: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) :
             type === "checkbox" ? e.target.checked :
             value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Removed the axios.post call from here.
      // Now, we pass the formData up to the parent component (MapRoutes)
      // for centralized handling of the API call and alerts.
      await onFeedbackSubmit(formData); // Pass formData to the parent handler

      // Reset the form only after the parent's submission is successful
      setFormData({
        source: "",
        destination: "",
        roadCondition: "Good",
        trafficDensity: 0,
        roadQuality: 3,
        safestTime: "Morning",
        accidentOccurred: false,
        accidentCount: 0,
        crimeRate: 0,
        review: "",
      });
    } catch (error) {
      // The parent component (MapRoutes) will handle the alert for submission errors.
      // You can log errors here for debugging if needed.
      console.error("❌ Error in FeedbackForm handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h3>Submit Your Feedback</h3>

      <label>
        Source:
        <input type="text" name="source" value={formData.source} onChange={handleChange} required />
      </label>

      <label>
        Destination:
        <input type="text" name="destination" value={formData.destination} onChange={handleChange} required />
      </label>

      <label>
        Road Condition:
        <select name="roadCondition" value={formData.roadCondition} onChange={handleChange} required>
          <option value="Good">Good</option>
          <option value="Moderate">Moderate</option>
          <option value="Bad">Bad</option>
        </select>
      </label>

      <label>
        Traffic Density (0-100):
        <input
          type="number"
          name="trafficDensity"
          min="0"
          max="100"
          value={formData.trafficDensity}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Road Quality (1-5):
        <input
          type="number"
          name="roadQuality"
          min="1"
          max="5"
          value={formData.roadQuality}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Safest Time:
        <select name="safestTime" value={formData.safestTime} onChange={handleChange} required>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>
      </label>

      <label>
        Accident Occurred:
        <input
          type="checkbox"
          name="accidentOccurred"
          checked={formData.accidentOccurred}
          onChange={handleChange}
        />
      </label>

      {formData.accidentOccurred && (
        <label>
          Accident Count:
          <input
            type="number"
            name="accidentCount"
            min="0"
            value={formData.accidentCount}
            onChange={handleChange}
            required
          />
        </label>
      )}

      <label>
        Crime Rate (0-100):
        <input
          type="number"
          name="crimeRate"
          min="0"
          max="100"
          value={formData.crimeRate}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Review:
        <textarea name="review" value={formData.review} onChange={handleChange} required></textarea>
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;