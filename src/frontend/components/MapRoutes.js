import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapRoutes.css";

import police_icon from "./assets/police_icon.png";
import source_icon from "./assets/source_icon.png";
import destination_icon from "./assets/destination_icon.png";

import FeedbackForm from "./FeedbackForm"; // Import FeedbackForm
import IssueHandler from "./IssueHandler"; // Import IssueHandler

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
  const [hasFeedback, setHasFeedback] = useState(false); // New state to track if feedback exists
  const [showIssueOptions, setShowIssueOptions] = useState(false); // State for showing IssueHandler

  useEffect(() => {
    if (!source || !destination) return;
    if (userChoice === "showRoutes") {
      fetchRoutes(true);
    } else if (userChoice === "startJourney") {
      fetchRoutes(false);
      handleStartJourney();
    }
    checkFeedbackAvailability(); // Check if feedback exists for the source and destination
  }, [source, destination, userChoice]);

  useEffect(() => {
    if (journeyCompleted) {
      fetchFeedback();
    }
  }, [journeyCompleted]);

  const getCoordinates = async (place, type) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`);
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
        { headers: { Authorization: API_KEY, "Content-Type": "application/json" } }
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
        });

        setRoutes([bestRoute.path]);
        setRouteDetails({
          distance: bestRoute.distance,
          duration: bestRoute.duration,
        });
      }

      const waypointsData = response.data.features[0].properties.segments[0].steps.map((step) => step.name);
      setWaypoints(waypointsData);
    } catch {
      window.alert("Error fetching routes. Please try again.");
    }
  };

  const fetchFeedback = async () => {
    try {
      setLoadingFeedback(true);
      const response = await axios.get(`http://localhost:5000/api/feedback/${encodeURIComponent(source)}/${encodeURIComponent(destination)}`);
      setFeedbackList(response.data);
      setHasFeedback(response.data.length > 0); // Set hasFeedback based on response
      setLoadingFeedback(false);
    } catch (err) {
      setFeedbackError("Failed to load feedback");
      setLoadingFeedback(false);
    }
  };

  const checkFeedbackAvailability = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/feedback/${encodeURIComponent(source)}/${encodeURIComponent(destination)}`);
      setHasFeedback(response.data.length > 0); // Set hasFeedback based on response
    } catch (err) {
      console.error("Error checking feedback availability:", err);
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
  };

  const handleCompleteJourney = () => {
    setJourneyCompleted(true);
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      await axios.post("http://localhost:5000/api/submit-feedback", feedbackData);
      setJourneyStarted(false);
      setJourneyCompleted(false);
      fetchFeedback();
    } catch (err) {
      setFeedbackError("Failed to submit feedback");
    }
  };

  return (
    <div className="map-wrapper">
      <h2 className="map-heading">Route Planner</h2>

      <div className="map-container">
        <MapContainer center={[18.5204, 73.8567]} zoom={12} className="map">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {journeyStarted && routes.length > 0 && routes.map((route, index) => (
            <Polyline key={index} positions={route} color={index === 0 ? "blue" : "gray"} />
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
          <p><strong>Distance:</strong> {routeDetails?.distance?.toFixed(2)} km</p>
          <p><strong>Duration:</strong> {routeDetails?.duration?.toFixed(2)} minutes</p>
          <h4>Waypoints:</h4>
          <ul>
            {waypoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="feedback-section">
        <h3>Journey Reviews</h3>
        {loadingFeedback ? (
          <p>Loading reviews...</p>
        ) : feedbackError ? (
          <p className="error">{feedbackError}</p>
        ) : hasFeedback ? (
          <ul className="feedback-list">
            {feedbackList.map((feedback, index) => (
              <li key={index} className="feedback-item">
                <p><strong>Condition:</strong> {feedback.condition}</p>
                <p><strong>Traffic:</strong> {feedback.traffic}</p>
                <p><strong>Safest Time:</strong> {feedback.safestTime}</p>
                {feedback.accidentOccurred === "Yes" && (
                  <>
                    <p><strong>Accident:</strong> {feedback.accidentDescription}</p>
                    {feedback.accidentImage && <img src={feedback.accidentImage} alt="Accident" />}
                  </>
                )}
                <p><strong>Review:</strong> {feedback.review}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews available for this journey.</p>
        )}
      </div>

      {journeyStarted && !journeyCompleted && (
        <div>
          <button className="complete-btn" onClick={handleCompleteJourney}>Complete Journey</button>
          <button className="issue-btn" onClick={() => setShowIssueOptions(true)}>Issue Happened</button>
        </div>
      )}

      {journeyCompleted && (
        <FeedbackForm source={source} destination={destination} onSubmit={handleFeedbackSubmit} />
      )}

      {showIssueOptions && (
        <IssueHandler
          source={source}
          destination={destination}
          onClose={() => setShowIssueOptions(false)}
        />
      )}
    </div>
  );
};

export default MapRoutes;