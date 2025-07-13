import React, { useState, useEffect } from "react";
import axios from "axios";
import FeedbackForm from "./FeedbackForm";
import "./Feedback.css";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      // const response = await axios.get("https://pathbuddy.onrender.com/api/feedbacks");
      const response = await axios.get(`${process.env.REACT_APP_API_BASE}/api/feedbacks`);

      setFeedbackList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("❌ Failed to load feedback:", error);
      setError("Failed to fetch feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-container">
      <h2>Route Reviews</h2>

      {/* Feedback Form */}
      <FeedbackForm onFeedbackSubmit={fetchFeedback} />

      {/* Loading State */}
      {loading && <p>Loading feedback...</p>}

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Feedback List */}
      {!loading && feedbackList.length === 0 && <p>No feedback available.</p>}
      <div className="feedback-list">
        {feedbackList.map((feedback) => (
          <div key={feedback._id} className="feedback-item">
            <h3>{feedback.source} to {feedback.destination}</h3>
            <p><strong>Road Condition:</strong> {feedback.roadCondition}</p>
            <p><strong>Traffic Density:</strong> {feedback.trafficDensity}%</p>
            <p><strong>Road Quality:</strong> {feedback.roadQuality}/5</p>
            <p><strong>Safest Time:</strong> {feedback.safestTime}</p>
            <p><strong>Accident Occurred:</strong> {feedback.accidentOccurred ? "Yes" : "No"}</p>
            {feedback.accidentOccurred && <p><strong>Accident Count:</strong> {feedback.accidentCount}</p>}
            <p><strong>Crime Rate:</strong> {feedback.crimeRate}%</p>
            <p><strong>Review:</strong> {feedback.review}</p>
            <p><small>Submitted on: {new Date(feedback.createdAt).toLocaleString()}</small></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;