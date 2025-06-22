// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const SignUp = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [emergencyMobile, setEmergencyMobile] = useState('');
//   const navigate = useNavigate();

//   // Check for existing session on component mount
//   useEffect(() => {
//     const checkExistingSession = () => {
//       const storedSession = localStorage.getItem('userSession');
//       const sessionExpiry = localStorage.getItem('sessionExpiry');
      
//       if (storedSession && sessionExpiry) {
//         const currentTime = new Date().getTime();
//         const expiryTime = parseInt(sessionExpiry);
        
//         if (currentTime < expiryTime) {
//           // Session is still valid, redirect to dashboard
//           const sessionData = JSON.parse(storedSession);
//           console.log('Valid session found, redirecting to dashboard');
//           navigate(`/dashboard/${sessionData.uniqueId}`);
//         } else {
//           // Session expired, clear storage
//           localStorage.removeItem('userSession');
//           localStorage.removeItem('sessionExpiry');
//           console.log('Session expired, cleared storage');
//         }
//       }
//     };

//     checkExistingSession();
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }
  
//     const userData = { name, email, password, mobile, emergencyMobile };
  
//     try {
//       const response = await fetch("http://localhost:5000/api/users/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         console.log('Account created successfully');
//         navigate("/signin");
//       } else {
//         alert(data.message || "Sign up failed!");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.backgroundElements}>
//         <div style={styles.circle1}></div>
//         <div style={styles.circle2}></div>
//         <div style={styles.circle3}></div>
//       </div>
//       <div style={styles.card}>
//         <div style={styles.header}>
//           <div style={styles.iconContainer}>
//             <div style={styles.icon}>👤</div>
//           </div>
//           <h2 style={styles.title}>Create Account</h2>
//           <p style={styles.subtitle}>Join us for a safer journey</p>
//         </div>
        
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.inputGroup}>
//             <label htmlFor="name" style={styles.label}>Full Name</label>
//             <input
//               type="text"
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               style={styles.input}
//               placeholder="Enter your full name"
//               required
//             />
//           </div>
          
//           <div style={styles.inputGroup}>
//             <label htmlFor="email" style={styles.label}>Email Address</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               style={styles.input}
//               placeholder="Enter your email"
//               required
//             />
//           </div>
          
//           <div style={styles.inputRow}>
//             <div style={styles.inputGroup}>
//               <label htmlFor="mobile" style={styles.label}>Mobile Number</label>
//               <input
//                 type="tel"
//                 id="mobile"
//                 value={mobile}
//                 onChange={(e) => setMobile(e.target.value)}
//                 style={styles.input}
//                 placeholder="Your mobile"
//                 required
//               />
//             </div>
//             <div style={styles.inputGroup}>
//               <label htmlFor="emergencyMobile" style={styles.label}>Emergency Contact</label>
//               <input
//                 type="tel"
//                 id="emergencyMobile"
//                 value={emergencyMobile}
//                 onChange={(e) => setEmergencyMobile(e.target.value)}
//                 style={styles.input}
//                 placeholder="Emergency mobile"
//                 required
//               />
//             </div>
//           </div>
          
//           <div style={styles.inputRow}>
//             <div style={styles.inputGroup}>
//               <label htmlFor="password" style={styles.label}>Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 style={styles.input}
//                 placeholder="Create password"
//                 required
//               />
//             </div>
//             <div style={styles.inputGroup}>
//               <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 style={styles.input}
//                 placeholder="Confirm password"
//                 required
//               />
//             </div>
//           </div>
          
//           <button type="submit" style={styles.button}>
//             <span style={styles.buttonText}>Create Account</span>
//             <span style={styles.buttonIcon}>→</span>
//           </button>
//         </form>
        
//         <div style={styles.footer}>
//           <p style={styles.footerText}>
//             Already have an account? 
//             <Link to="/signin" style={styles.link}> Sign in here</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     padding: '20px',
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   backgroundElements: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     pointerEvents: 'none',
//   },
//   circle1: {
//     position: 'absolute',
//     width: '200px',
//     height: '200px',
//     borderRadius: '50%',
//     background: 'rgba(255, 255, 255, 0.1)',
//     top: '10%',
//     left: '10%',
//     animation: 'float 6s ease-in-out infinite',
//   },
//   circle2: {
//     position: 'absolute',
//     width: '150px',
//     height: '150px',
//     borderRadius: '50%',
//     background: 'rgba(255, 255, 255, 0.05)',
//     bottom: '20%',
//     right: '15%',
//     animation: 'float 8s ease-in-out infinite reverse',
//   },
//   circle3: {
//     position: 'absolute',
//     width: '100px',
//     height: '100px',
//     borderRadius: '50%',
//     background: 'rgba(255, 255, 255, 0.08)',
//     top: '60%',
//     left: '5%',
//     animation: 'float 7s ease-in-out infinite',
//   },
//   card: {
//     width: '100%',
//     maxWidth: '480px',
//     background: 'rgba(255, 255, 255, 0.95)',
//     backdropFilter: 'blur(20px)',
//     borderRadius: '20px',
//     padding: '40px',
//     boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//     position: 'relative',
//     zIndex: 1,
//   },
//   header: {
//     textAlign: 'center',
//     marginBottom: '30px',
//   },
//   iconContainer: {
//     display: 'inline-flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '60px',
//     height: '60px',
//     borderRadius: '50%',
//     background: 'linear-gradient(135deg, #667eea, #764ba2)',
//     marginBottom: '20px',
//   },
//   icon: {
//     fontSize: '24px',
//     color: 'white',
//   },
//   title: {
//     fontSize: '28px',
//     fontWeight: '700',
//     color: '#2d3748',
//     marginBottom: '8px',
//     letterSpacing: '-0.5px',
//   },
//   subtitle: {
//     fontSize: '16px',
//     color: '#718096',
//     margin: 0,
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '20px',
//   },
//   inputRow: {
//     display: 'flex',
//     gap: '15px',
//   },
//   inputGroup: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//     flex: 1,
//   },
//   label: {
//     fontSize: '14px',
//     fontWeight: '600',
//     color: '#4a5568',
//     letterSpacing: '0.1px',
//   },
//   input: {
//     width: '100%',
//     padding: '14px 16px',
//     fontSize: '15px',
//     borderRadius: '12px',
//     border: '2px solid #e2e8f0',
//     outline: 'none',
//     transition: 'all 0.3s ease',
//     boxSizing: 'border-box',
//     background: 'rgba(255, 255, 255, 0.8)',
//     color: '#2d3748',
//   },
//   button: {
//     width: '100%',
//     padding: '16px',
//     fontSize: '16px',
//     fontWeight: '600',
//     color: 'white',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     border: 'none',
//     borderRadius: '12px',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '8px',
//     marginTop: '10px',
//     boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
//   },
//   buttonText: {
//     fontSize: '16px',
//   },
//   buttonIcon: {
//     fontSize: '18px',
//     transition: 'transform 0.3s ease',
//   },
//   footer: {
//     textAlign: 'center',
//     marginTop: '30px',
//     paddingTop: '20px',
//     borderTop: '1px solid #e2e8f0',
//   },
//   footerText: {
//     fontSize: '15px',
//     color: '#718096',
//     margin: 0,
//   },
//   link: {
//     color: '#667eea',
//     textDecoration: 'none',
//     fontWeight: '600',
//     transition: 'color 0.3s ease',
//   },
// };

// // Add CSS animations
// const styleSheet = document.createElement("style");
// styleSheet.innerText = `
//   @keyframes float {
//     0%, 100% { transform: translateY(0px) rotate(0deg); }
//     50% { transform: translateY(-20px) rotate(180deg); }
//   }
  
//   input:focus {
//     border-color: #667eea !important;
//     box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
//     transform: translateY(-1px);
//   }
  
//   button:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
//   }
  
//   button:hover span:last-child {
//     transform: translateX(4px);
//   }
  
//   a:hover {
//     color: #764ba2 !important;
//   }
// `;
// document.head.appendChild(styleSheet);

// export default SignUp;



import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  // State for traditional signup
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [emergencyMobile, setEmergencyMobile] = useState('');
  
  // State for authentication mode
  const [authMode, setAuthMode] = useState('email'); // 'email', 'phone', 'google'
  const [loading, setLoading] = useState(false);
  
  // State for phone authentication
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = () => {
      const storedSession = localStorage.getItem('userSession');
      const sessionExpiry = localStorage.getItem('sessionExpiry');
      
      if (storedSession && sessionExpiry) {
        const currentTime = new Date().getTime();
        const expiryTime = parseInt(sessionExpiry);
        
        if (currentTime < expiryTime) {
          const sessionData = JSON.parse(storedSession);
          console.log('Valid session found, redirecting to dashboard');
          navigate(`/dashboard/${sessionData.uniqueId}`);
        } else {
          localStorage.removeItem('userSession');
          localStorage.removeItem('sessionExpiry');
          console.log('Session expired, cleared storage');
        }
      }
    };

    checkExistingSession();
  }, [navigate]);

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id',
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
      }
    };

    // Load Google Sign-In script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  // Handle traditional email/password signup
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      setLoading(false);
      return;
    }
  
    const userData = { name, email, password, mobile, emergencyMobile };
  
    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Account created successfully');
        alert('Account created successfully! Please sign in.');
        navigate("/signin");
      } else {
        alert(data.message || "Sign up failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In response
  const handleGoogleResponse = async (response) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        // Store session data
        const sessionData = {
          uniqueId: data.user.uniqueId,
          name: data.user.name,
          email: data.user.email,
          authProvider: data.user.authProvider
        };
        
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        localStorage.setItem('sessionExpiry', expiryTime.toString());
        
        console.log('Google authentication successful');
        navigate(`/dashboard/${data.user.uniqueId}`);
      } else {
        alert(data.message || "Google authentication failed!");
      }
    } catch (error) {
      console.error("Google auth error:", error);
      alert("Google authentication failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In button click
  const handleGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      alert('Google Sign-In is not available. Please try again later.');
    }
  };

  // Send OTP for phone authentication
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    setOtpLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/users/auth/phone/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mobile: phoneNumber,
          name: name.trim()
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setCountdown(60);
        alert('OTP sent successfully! Please check your phone.');
      } else {
        alert(data.message || "Failed to send OTP!");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      alert("Failed to send OTP! Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP for phone authentication
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/users/auth/phone/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mobile: phoneNumber,
          otp: otp,
          name: name.trim(),
          emergencyMobile: emergencyMobile || ''
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store session data
        const sessionData = {
          uniqueId: data.user.uniqueId,
          name: data.user.name,
          mobile: data.user.mobile,
          authProvider: data.user.authProvider
        };
        
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        localStorage.setItem('sessionExpiry', expiryTime.toString());
        
        console.log('Phone authentication successful');
        navigate(`/dashboard/${data.user.uniqueId}`);
      } else {
        alert(data.message || "OTP verification failed!");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      alert("OTP verification failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setOtpLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/auth/phone/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mobile: phoneNumber,
          name: name.trim()
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCountdown(60);
        alert('OTP resent successfully!');
      } else {
        alert(data.message || "Failed to resend OTP!");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      alert("Failed to resend OTP! Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const renderEmailSignup = () => (
    <form onSubmit={handleEmailSignup} style={styles.form}>
      <div style={styles.inputGroup}>
        <label htmlFor="name" style={styles.label}>Full Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          placeholder="Enter your full name"
          required
        />
      </div>
      
      <div style={styles.inputGroup}>
        <label htmlFor="email" style={styles.label}>Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="Enter your email"
          required
        />
      </div>
      
      <div style={styles.inputRow}>
        <div style={styles.inputGroup}>
          <label htmlFor="mobile" style={styles.label}>Mobile Number</label>
          <input
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={styles.input}
            placeholder="Your mobile"
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="emergencyMobile" style={styles.label}>Emergency Contact</label>
          <input
            type="tel"
            id="emergencyMobile"
            value={emergencyMobile}
            onChange={(e) => setEmergencyMobile(e.target.value)}
            style={styles.input}
            placeholder="Emergency mobile"
            required
          />
        </div>
      </div>
      
      <div style={styles.inputRow}>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Create password (min 6 chars)"
            required
            minLength={6}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            placeholder="Confirm password"
            required
          />
        </div>
      </div>
      
      <button type="submit" style={styles.button} disabled={loading}>
        <span style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </span>
        {!loading && <span style={styles.buttonIcon}>→</span>}
      </button>
    </form>
  );

  const renderPhoneSignup = () => (
    <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} style={styles.form}>
      <div style={styles.inputGroup}>
        <label htmlFor="phoneName" style={styles.label}>Full Name</label>
        <input
          type="text"
          id="phoneName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          placeholder="Enter your full name"
          required
          disabled={otpSent}
        />
      </div>
      
      <div style={styles.inputGroup}>
        <label htmlFor="phoneNumber" style={styles.label}>Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={styles.input}
          placeholder="Enter your phone number"
          required
          disabled={otpSent}
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="phoneEmergency" style={styles.label}>Emergency Contact (Optional)</label>
        <input
          type="tel"
          id="phoneEmergency"
          value={emergencyMobile}
          onChange={(e) => setEmergencyMobile(e.target.value)}
          style={styles.input}
          placeholder="Emergency contact number"
          disabled={otpSent}
        />
      </div>
      
      {otpSent && (
        <div style={styles.inputGroup}>
          <label htmlFor="otp" style={styles.label}>Enter OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            required
          />
          <div style={styles.otpActions}>
            <button
              type="button"
              onClick={handleResendOTP}
              style={{...styles.linkButton, opacity: countdown > 0 ? 0.5 : 1}}
              disabled={countdown > 0 || otpLoading}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
            </button>
          </div>
        </div>
      )}
      
      <button type="submit" style={styles.button} disabled={loading || otpLoading}>
        <span style={styles.buttonText}>
          {loading ? 'Verifying...' : otpLoading ? 'Sending OTP...' : otpSent ? 'Verify & Create Account' : 'Send OTP'}
        </span>
        {!loading && !otpLoading && <span style={styles.buttonIcon}>→</span>}
      </button>

      {otpSent && (
        <button
          type="button"
          onClick={() => {
            setOtpSent(false);
            setOtp('');
            setCountdown(0);
          }}
          style={styles.backButton}
        >
          ← Change Phone Number
        </button>
      )}
    </form>
  );

  return (
    <div style={styles.container}>
      <div style={styles.backgroundElements}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>
      </div>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <div style={styles.icon}>👤</div>
          </div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join us for a safer journey</p>
        </div>

        {/* Authentication Mode Selector */}
        <div style={styles.authModeSelector}>
          <button
            type="button"
            onClick={() => setAuthMode('email')}
            style={{
              ...styles.authModeButton,
              ...(authMode === 'email' ? styles.authModeButtonActive : {})
            }}
          >
            📧 Email
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('phone')}
            style={{
              ...styles.authModeButton,
              ...(authMode === 'phone' ? styles.authModeButtonActive : {})
            }}
          >
            📱 Phone
          </button>
        </div>
{/* 
        Google Sign-In Button
        <div style={styles.googleSection}>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={styles.googleButton}
            disabled={loading}
          >
            <svg style={styles.googleIcon} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing up...' : 'Continue with Google'}
          </button>
        </div> */}

        {/* <div style={styles.divider}>
          <span style={styles.dividerText}>or</span>
        </div> */}

        {/* Render appropriate form based on auth mode */}
        {authMode === 'email' ? renderEmailSignup() : renderPhoneSignup()}
        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account? 
            <Link to="/signin" style={styles.link}> Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  circle1: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    top: '10%',
    left: '10%',
    animation: 'float 6s ease-in-out infinite',
  },
  circle2: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    bottom: '20%',
    right: '15%',
    animation: 'float 8s ease-in-out infinite reverse',
  },
  circle3: {
    position: 'absolute',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
    top: '60%',
    left: '5%',
    animation: 'float 7s ease-in-out infinite',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  iconContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    marginBottom: '20px',
  },
  icon: {
    fontSize: '24px',
    color: 'white',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096',
    margin: 0,
  },
  authModeSelector: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  authModeButton: {
    flex: 1,
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    background: 'white',
    color: '#718096',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  authModeButtonActive: {
    borderColor: '#667eea',
    background: '#667eea',
    color: 'white',
  },
  googleSection: {
    marginBottom: '20px',
  },
  googleButton: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
    background: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  googleIcon: {
    width: '18px',
    height: '18px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
  },
  dividerText: {
    padding: '0 15px',
    fontSize: '14px',
    color: '#718096',
    background: 'rgba(255, 255, 255, 0.95)',
    position: 'relative',
    zIndex: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputRow: {
    display: 'flex',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    letterSpacing: '0.1px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    background: 'rgba(255, 255, 255, 0.8)',
    color: '#2d3748',
  },
  otpActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '5px',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  button: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  backButton: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
    background: 'transparent',
    border: '2px solid #667eea',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
  },
  buttonText: {
    fontSize: '16px',
  },
  buttonIcon: {
    fontSize: '18px',
    transition: 'transform 0.3s ease',
  },
  footer: {
    textAlign: 'center',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
  },
  footerText: {
    fontSize: '15px',
    color: '#718096',
    margin: 0,
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s ease',
  },
};

// Add CSS animations and styles
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    transform: translateY(-1px);
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  button:hover:not(:disabled) span:last-child {
    transform: translateX(4px);
  }
  
  a:hover {
    color: #764ba2 !important;
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .divider::before {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
  
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
`;
document.head.appendChild(styleSheet);

export default SignUp;