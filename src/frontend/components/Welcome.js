import React, { useState } from 'react';
import './Welcome.css';

const Welcome = ({ setSource, setDestination, handleUserChoice }) => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = (choice) => {
    setErrorMessage('');
    if (!startLocation || !endLocation) {
      setErrorMessage('Both fields are required!');
      return;
    }
    setSource(startLocation);
    setDestination(endLocation);
    handleUserChoice(choice); // Pass user choice to parent
  };

  return (
    <section className="welcome-section">
      <div className="welcome-content">
        <h1>Welcome to TravelSafe</h1>
        <p>Your guide to safer travels and smart route planning.</p>

        <div className="location-inputs">
          <input
            type="text"
            placeholder="Enter starting location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter destination"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
          />
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="buttons-container" >
          <button className="show-route-btn" onClick={() => handleClick('showRoutes')}>
            Show Routes
          </button>
        
          <button className="show-route-btn" onClick={() => handleClick('startJourney')}>
            Start Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
