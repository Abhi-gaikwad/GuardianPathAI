import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './frontend/components/signin';
import SignUp from './frontend/components/signup';
import Dashboard from './frontend/components/Dashboard'; // New Dashboard Component
import Profile from './frontend/components/Profile.jsx'

// Importing necessary components for routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard/:uniqueId" element={<Dashboard />} /> {/* Accept uniqueId as a parameter */}
        <Route path="/profile/:uniqueId" element={<Profile />} />
        
      </Routes>
    </Router>
  );
}

export default App;
