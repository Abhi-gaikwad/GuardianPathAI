import React, { useState, useRef } from 'react';
import Navbar from './Navbar';
import Welcome from './Welcome';
import MapRoutes from './MapRoutes';
import SafetyInsights from './SafetyInsights';
import TravelRecommendations from './about';
import Footer from './Footer';
import Chatbot from './Chatbot';

const Dashboard = () => {
  // Define state for source, destination, and user choice
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [userChoice, setUserChoice] = useState(null); // Store user choice
  const mapRef = useRef(null); // Reference for scrolling to the map section

  // Function to handle user choice
  const handleUserChoice = (choice) => {
    setUserChoice(choice); // Save user choice for MapRoutes
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the map section
    }
  };

  return (
    <>
      <Navbar />
      <section id="welcome">
        {/* Pass the required props to Welcome */}
        <Welcome
          setSource={setSource}
          setDestination={setDestination}
          handleUserChoice={handleUserChoice}
        />
      </section>
      <section id="maproutes">
        <div ref={mapRef}>
          {/* Pass source, destination, and userChoice to MapRoutes */}
          <MapRoutes source={source} destination={destination} userChoice={userChoice} />
        </div>
      </section>
      <section id="safetyinsights">
        <SafetyInsights />
      </section>
      <section id="about">
        <TravelRecommendations />
      </section>
      <section id="footer">
        <Footer />
      </section>
      <div className="chatbot-container">
        <Chatbot open={true} />
      </div>
    </>
  );
};

export default Dashboard;