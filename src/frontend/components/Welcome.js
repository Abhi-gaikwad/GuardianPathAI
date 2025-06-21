import React, { useState, useEffect } from 'react';
import { useSession } from './sessionUtils'; // Import useSession hook
import './Welcome.css';

const Welcome = ({ setSource, setDestination, handleUserChoice }) => {
  const { isLoggedIn, isLoading } = useSession(true); // Enable auto-redirect
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Load theme preference and listen for theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else if (prefersDark) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }

    // Listen for theme changes from navbar
    const handleThemeChange = (event) => {
      setDarkMode(event.detail.theme === 'dark');
    };

    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  // If not logged in and not loading, the useSession hook will handle the redirect.
  // We only need to render the component if the user is logged in or if we are still loading.
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  // If isLoading is false and isLoggedIn is false, useSession has already redirected.
  // So, we don't need to render anything further here for unauthenticated users.
  if (!isLoggedIn) {
    return null;
  }

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
    <section className={`welcome-section ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="welcome-content">
        <h1>Welcome to TravelSafe</h1>
        <p>Your guide to safer travels and smart route planning.</p>

        <div className="location-inputs">
          <input
            type="text"
            placeholder="Source Location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Destination Location"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
          />
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="buttons-container">
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