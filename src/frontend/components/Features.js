import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <section className="features-section">
      <h2>Key Features</h2>
      <div className="features-container">
        <div className="feature-card">
          <div className="icon">&#128736;</div>
          <h3>Safe Routes</h3>
          <p>Find routes with proper lighting and lower risk of accidents.</p>
        </div>
        <div className="feature-card">
          <div className="icon">&#9888;</div>
          <h3>Real-time Alerts</h3>
          <p>Receive safety notifications for your selected route.</p>
        </div>
        <div className="feature-card">
          <div className="icon">&#127970;</div>
          <h3>Travel Recommendations</h3>
          <p>Discover hotels, gas stations, and other amenities along the way.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
