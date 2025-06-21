import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapRoutes.css";

import police_icon from "./assets/police_icon.png";
import source_icon from "./assets/source_icon.png";
import destination_icon from "./assets/destination_icon.png";

import FeedbackForm from "./FeedbackForm";
import IssueHandler from "./IssueHandler";

const API_KEY = "5b3ce3597851110001cf6248904c76737b0f4e92813fedf9aaac7cc9";

const MapRoutes = ({ source, destination, userChoice }) => {
  const [routes, setRoutes] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [journeyCompleted, setJourneyCompleted] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [feedbackError, setFeedbackError] = useState("");
  const [hasFeedback, setHasFeedback] = useState(false);
  const [showIssueOptions, setShowIssueOptions] = useState(false);

  useEffect(() => {
    if (!source || !destination) return;

    const initializeRoute = async () => {
      if (userChoice === "showRoutes") {
        await fetchRoutes(true);
      } else if (userChoice === "startJourney") {
        await fetchRoutes(false);
        handleStartJourney();
      }
    };

    initializeRoute();
  }, [source, destination, userChoice]);

  useEffect(() => {
    if (source && destination) {
      fetchFeedback();
    } else {
      setFeedbackList([]);
      setHasFeedback(false);
      setFeedbackError("");
    }
  }, [source, destination]);

  const getCoordinates = async (place, type) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
      );
      if (response.data.length === 0) {
        window.alert(`Invalid ${type}. Please enter a valid location.`);
        return null;
      }
      return [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
    } catch {
      window.alert(`Error fetching ${type} coordinates.`);
      return null;
    }
  };

  const fetchRoutes = async (showAllRoutes) => {
    const srcCoords = await getCoordinates(source, "source");
    const destCoords = await getCoordinates(destination, "destination");

    if (!srcCoords || !destCoords) return;

    setSourceCoords(srcCoords);
    setDestinationCoords(destCoords);

    try {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
        {
          coordinates: [srcCoords.reverse(), destCoords.reverse()],
          alternative_routes: { target_count: 3, weight_factor: 1.3 },
        },
        {
          headers: {
            Authorization: API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.data.features || response.data.features.length === 0) {
        window.alert("No route found. Try another location.");
        return;
      }

      const allRoutes = response.data.features.map((feature) => ({
        path: feature.geometry.coordinates.map((coord) => [coord[1], coord[0]]),
        distance: feature.properties.segments[0].distance / 1000,
        duration: feature.properties.segments[0].duration / 60,
      }));

      if (showAllRoutes) {
        setRoutes(allRoutes.map(route => route.path));
      } else {
        const bestRoute = allRoutes.reduce((best, current) => {
          return current.distance < best.distance ? current : best;
        }, allRoutes[0]);

        setRoutes([bestRoute.path]);
        setRouteDetails({
          distance: bestRoute.distance,
          duration: bestRoute.duration,
        });
      }

      const waypointsData = response.data.features[0].properties.segments[0].steps
        .map((step) => step.name)
        .filter(name => name && name.trim() !== "");
      setWaypoints(waypointsData);
    } catch (error) {
      console.error("Route fetching error:", error);
      window.alert("Error fetching routes. Please try again.");
    }
  };

  const fetchFeedback = async () => {
    try {
      setLoadingFeedback(true);
      setFeedbackError("");

      if (!source || !destination) {
        setFeedbackList([]);
        setHasFeedback(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/feedbacks", {
        params: {
          source: source.trim(),
          destination: destination.trim()
        }
      });

      setFeedbackList(response.data);
      setHasFeedback(response.data.length > 0);
    } catch (err) {
      setFeedbackError("Failed to load feedback for this route");
      setHasFeedback(false);
      setFeedbackList([]);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const markerIcon = (iconUrl) =>
    new L.Icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

  const handleStartJourney = () => {
    setJourneyStarted(true);
    setJourneyCompleted(false);
    setShowIssueOptions(false);
  };

  const handleCompleteJourney = () => {
    setJourneyCompleted(true);
    setJourneyStarted(false);
  };

  // This function now receives the formData from FeedbackForm.js
  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      console.log("📤 Submitting feedback from MapRoutes:", feedbackData);

      // Add source and destination to the feedbackData if not already present,
      // as FeedbackForm might not have them if initialized without.
      const dataToSubmit = {
        ...feedbackData,
        source: feedbackData.source || source,
        destination: feedbackData.destination || destination
      };

      const response = await axios.post("http://localhost:5000/api/feedbacks", dataToSubmit);

      console.log("✅ Feedback submitted successfully:", response.data);

      setJourneyCompleted(false);
      setJourneyStarted(false);
      setFeedbackError("");
      alert("✅ Feedback submitted successfully!"); // Success alert here

      await fetchFeedback(); // Fetch updated feedback list
    } catch (err) {
      console.error("❌ Feedback submit error:", err);

      let errorMessage = "Failed to submit feedback. Please try again.";

      if (err.response) {
        errorMessage = err.response.data?.message ||
                      err.response.data?.error ||
                      `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      setFeedbackError(errorMessage);
      alert(errorMessage); // Error alert here
    }
  };

  const getCrimeRateLevel = (rate) => {
    if (rate === 0) return 'Low';
    if (rate <= 3) return 'Moderate';
    return 'High';
  };

  return (
    <div className="map-wrapper">
      <h2 className="map-heading">Route Planner: {source} to {destination}</h2>

      <div className="map-container">
        <MapContainer
          center={sourceCoords || [18.5204, 73.8567]}
          zoom={sourceCoords ? 10 : 12}
          className="map"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {(journeyStarted || userChoice === "showRoutes") && routes.map((route, index) => (
            <Polyline
              key={index}
              positions={route}
              color={index === 0 ? "blue" : "gray"}
              weight={4}
            />
          ))}

          {sourceCoords && (
            <Marker position={sourceCoords} icon={markerIcon(source_icon)}>
              <Popup>Source: {source}</Popup>
            </Marker>
          )}

          {destinationCoords && (
            <Marker position={destinationCoords} icon={markerIcon(destination_icon)}>
              <Popup>Destination: {destination}</Popup>
            </Marker>
          )}
        </MapContainer>

        <div className="route-details">
          <h3>Route Details</h3>
          <p><strong>Source:</strong> {source}</p>
          <p><strong>Destination:</strong> {destination}</p>
          {routeDetails && (
            <>
              <p><strong>Distance:</strong> {routeDetails.distance.toFixed(2)} km</p>
              <p><strong>Duration:</strong> {routeDetails.duration.toFixed(2)} minutes</p>
            </>
          )}
          {waypoints.length > 0 && (
            <>
              <h4>Waypoints:</h4>
              <ul>
                {waypoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="feedback-section">
        <h3>Journey Reviews: {source} to {destination}</h3>
        {loadingFeedback ? (
          <div className="loading-message">Loading reviews...</div>
        ) : feedbackError ? (
          <div className="error-message">{feedbackError}</div>
        ) : hasFeedback ? (
          <div className="feedback-list">
            {feedbackList.map((feedback) => (
              <div key={feedback._id} className="feedback-item">
                <div className="feedback-header">
                  <span className="feedback-date">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="feedback-metrics">
                  <div className="metric">
                    <span className="metric-label">Road Condition:</span>
                    <span className={`metric-value ${feedback.roadCondition.toLowerCase()}`}>
                      {feedback.roadCondition}
                    </span>
                  </div>

                  <div className="metric">
                    <span className="metric-label">Traffic Density:</span>
                    <span className="metric-value">{feedback.trafficDensity}%</span>
                  </div>

                  <div className="metric">
                    <span className="metric-label">Road Quality:</span>
                    <span className="metric-value">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`star ${i < feedback.roadQuality ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                  </div>

                  <div className="metric">
                    <span className="metric-label">Safest Time:</span>
                    <span className="metric-value">{feedback.safestTime}</span>
                  </div>

                  <div className="metric">
                    <span className="metric-label">Crime Rate:</span>
                    <span className="metric-value">
                      {getCrimeRateLevel(feedback.crimeRate)}
                    </span>
                  </div>
                </div>

                {feedback.accidentOccurred && (
                  <div className="accident-info">
                    <p><strong>⚠️ Accident Occurred:</strong> {feedback.accidentCount} incident(s)</p>
                  </div>
                )}

                <div className="user-review">
                  <p><strong>User Review:</strong></p>
                  <p className="review-text">{feedback.review}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            No reviews available for this route yet. Be the first to share your experience!
          </div>
        )}
      </div>

      {journeyStarted && !journeyCompleted && (
        <div className="journey-controls">
          <button className="complete-btn" onClick={handleCompleteJourney}>
            Complete Journey
          </button>
          <button
            className="issue-btn"
            onClick={() => setShowIssueOptions(true)}
          >
            Report Issue
          </button>
        </div>
      )}

      {journeyCompleted && (
        <FeedbackForm
          source={source}
          destination={destination}
          onFeedbackSubmit={handleFeedbackSubmit} // Corrected prop name to match FeedbackForm's usage
        />
      )}

      {showIssueOptions && (
        <IssueHandler
          source={source}
          destination={destination}
          onClose={() => setShowIssueOptions(false)}
          onSubmit={() => {
            setShowIssueOptions(false);
            fetchFeedback();
          }}
        />
      )}
    </div>
  );
};

export default MapRoutes;
