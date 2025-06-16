// sessionUtils.js - Enhanced utility functions for session management
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const SessionUtils = {
  // Check if user has valid session
  isSessionValid: () => {
    const storedSession = localStorage.getItem('userSession');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (!storedSession || !sessionExpiry) {
      return false;
    }
    
    const currentTime = new Date().getTime();
    const expiryTime = parseInt(sessionExpiry);
    
    if (currentTime >= expiryTime) {
      // Session expired, clear it
      SessionUtils.clearSession();
      return false;
    }
    
    return true;
  },

  // Get current session data
  getSessionData: () => {
    if (!SessionUtils.isSessionValid()) {
      return null;
    }
    
    const storedSession = localStorage.getItem('userSession');
    return JSON.parse(storedSession);
  },

  // Clear session (logout) - Enhanced version
  clearSession: () => {
    // Clear session-specific items
    localStorage.removeItem('userSession');
    localStorage.removeItem('sessionExpiry');
    
    // Clear other auth-related items that might exist
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('refreshToken');
    
    // Clear all sessionStorage
    sessionStorage.clear();
    
    console.log('Session and all auth data cleared');
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('sessionCleared'));
  },

  // Force logout and redirect
  forceLogout: (navigate) => {
    SessionUtils.clearSession();
    
    // Use navigate if provided, otherwise use window.location
    if (navigate) {
      navigate('/signin', { replace: true });
    } else {
      window.location.href = '/signin';
    }
  },

  // Get session info for debugging
  getSessionInfo: () => {
    const storedSession = localStorage.getItem('userSession');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (!storedSession || !sessionExpiry) {
      return {
        hasSession: false,
        message: 'No session found'
      };
    }
    
    const sessionData = JSON.parse(storedSession);
    const currentTime = new Date().getTime();
    const expiryTime = parseInt(sessionExpiry);
    const timeRemaining = expiryTime - currentTime;
    
    return {
      hasSession: true,
      isValid: timeRemaining > 0,
      sessionData: sessionData,
      expiryTime: new Date(expiryTime).toLocaleString(),
      timeRemaining: timeRemaining > 0 ? Math.floor(timeRemaining / (1000 * 60 * 60)) + ' hours' : 'Expired',
      currentTime: new Date(currentTime).toLocaleString()
    };
  },

  // Extend session (refresh expiry time)
  extendSession: (additionalHours = 24) => {
    if (!SessionUtils.isSessionValid()) {
      return false;
    }
    
    const newExpiryTime = new Date().getTime() + (additionalHours * 60 * 60 * 1000);
    localStorage.setItem('sessionExpiry', newExpiryTime.toString());
    console.log(`Session extended by ${additionalHours} hours`);
    return true;
  },

  // Set session with expiry
  setSession: (sessionData, hoursToExpire = 24) => {
    const expiryTime = new Date().getTime() + (hoursToExpire * 60 * 60 * 1000);
    localStorage.setItem('userSession', JSON.stringify(sessionData));
    localStorage.setItem('sessionExpiry', expiryTime.toString());
    console.log('Session set with expiry');
  }
};

// React Hook for session management - Enhanced version
export const useSession = (redirectOnInvalid = true) => {
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = () => {
      const data = SessionUtils.getSessionData();
      setSessionData(data);
      setIsLoading(false);
      
      // If no valid session and should redirect, go to signin
      if (!data && redirectOnInvalid && location.pathname !== '/signin') {
        navigate('/signin', { replace: true });
      }
    };

    checkSession();
    
    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    
    // Listen for session cleared events
    const handleSessionCleared = () => {
      setSessionData(null);
      if (redirectOnInvalid) {
        navigate('/signin', { replace: true });
      }
    };
    
    window.addEventListener('sessionCleared', handleSessionCleared);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('sessionCleared', handleSessionCleared);
    };
  }, [navigate, location.pathname, redirectOnInvalid]);

  const logout = () => {
    SessionUtils.forceLogout(navigate);
  };

  const extendSession = (hours = 24) => {
    return SessionUtils.extendSession(hours);
  };

  return {
    sessionData,
    isLoading,
    isLoggedIn: !!sessionData,
    logout,
    extendSession
  };
};

// Enhanced Logout Component
export const LogoutButton = ({ style = {}, onLogout = null }) => {
  const { logout } = useSession(false); // Don't auto-redirect
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // Call custom logout function if provided
    } else {
      logout(); // Use default logout
    }
  };
  
  return (
    <button 
      onClick={handleLogout}
      style={{
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        ...style
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = '#c82333';
        e.target.style.transform = 'translateY(-1px)';
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = '#dc3545';
        e.target.style.transform = 'translateY(0)';
      }}
    >
      Logout
    </button>
  );
};

// Protected Route Component - Enhanced
export const ProtectedRoute = ({ children }) => {
  const { sessionData, isLoading } = useSession(true); // Auto-redirect enabled

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

  return sessionData ? children : null;
};

// Session Debug Component (for development)
export const SessionDebug = () => {
  const [sessionInfo, setSessionInfo] = useState(null);
  
  const refreshInfo = () => {
    setSessionInfo(SessionUtils.getSessionInfo());
  };
  
  const clearSession = () => {
    SessionUtils.clearSession();
    refreshInfo();
  };
  
  useEffect(() => {
    refreshInfo();
  }, []);
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Session Debug</div>
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={refreshInfo}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '5px'
          }}
        >
          Refresh
        </button>
        <button 
          onClick={clearSession}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Session
        </button>
      </div>
      {sessionInfo && (
        <div>
          <div><strong>Has Session:</strong> {sessionInfo.hasSession ? 'Yes' : 'No'}</div>
          {sessionInfo.hasSession && (
            <>
              <div><strong>Valid:</strong> {sessionInfo.isValid ? 'Yes' : 'No'}</div>
              <div><strong>User:</strong> {sessionInfo.sessionData?.email || 'N/A'}</div>
              <div><strong>Expires:</strong> {sessionInfo.expiryTime}</div>
              <div><strong>Time Left:</strong> {sessionInfo.timeRemaining}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};