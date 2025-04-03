import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import SignIn from './frontend/components/signin'; 
import SignUp from './frontend/components/signup.jsx'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App/>
    {/* <SignUp/>
    <SignIn /> */}
  </React.StrictMode>
);