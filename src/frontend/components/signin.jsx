// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Import axios

// const SignIn = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
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
//           // Session is still valid
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

//   const storeSession = (userData, remember = false) => {
//     const sessionData = {
//       uniqueId: userData.uniqueId,
//       email: userData.email,
//       name: userData.name,
//       loginTime: new Date().toISOString()
//     };

//     // Set session duration: 7 days if remember me, 1 day otherwise
//     const sessionDuration = remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
//     const expiryTime = new Date().getTime() + sessionDuration;

//     localStorage.setItem('userSession', JSON.stringify(sessionData));
//     localStorage.setItem('sessionExpiry', expiryTime.toString());
    
//     console.log('Session stored:', {
//       data: sessionData,
//       expiresAt: new Date(expiryTime).toLocaleString(),
//       duration: remember ? '7 days' : '1 day'
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const userData = { email, password };
  
//     try {
//       const response = await fetch('http://localhost:5000/api/users/signin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         // Store session before navigation
//         storeSession(data, rememberMe);

//         // Fetch profile data including image immediately after successful login
//         try {
//           const profileResponse = await axios.get(`http://localhost:5000/api/users/profile/${data.uniqueId}`);
//           if (profileResponse.data.profileImage) {
//             localStorage.setItem('userProfileImage', profileResponse.data.profileImage); // Store image URL
//           } else {
//             localStorage.removeItem('userProfileImage'); // Clear if no image
//           }
//         } catch (profileError) {
//           console.error('Error fetching profile image:', profileError);
//           // Even if profile image fetch fails, proceed with navigation
//           localStorage.removeItem('userProfileImage'); // Ensure no stale image
//         }

//         navigate(`/dashboard/${data.uniqueId}`);
//       } else {
//         alert(data.message || 'Sign-in failed');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Something went wrong. Please try again.');
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
//             <div style={styles.icon}>🔐</div>
//           </div>
//           <h2 style={styles.title}>Welcome Back</h2>
//           <p style={styles.subtitle}>Sign in to your safe journey</p>
//         </div>
        
//         <form onSubmit={handleSubmit} style={styles.form}>
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
          
//           <div style={styles.inputGroup}>
//             <label htmlFor="password" style={styles.label}>Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               style={styles.input}
//               placeholder="Enter your password"
//               required
//             />
//           </div>
          
//           <div style={styles.extraOptions}>
//             <label style={styles.checkboxLabel}>
//               <input 
//                 type="checkbox" 
//                 style={styles.checkbox}
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//               />
//               <span style={styles.checkboxText}>Remember me</span>
//             </label>
//             <a href="#" style={styles.forgotLink}>Forgot password?</a>
//           </div>
          
//           <button type="submit" style={styles.button}>
//             <span style={styles.buttonText}>Sign In</span>
//             <span style={styles.buttonIcon}>→</span>
//           </button>
//         </form>
        
//         <div style={styles.divider}>
//           <span style={styles.dividerText}>or continue with</span>
//         </div>
        
//         <div style={styles.socialButtons}>
//           <button type="button" style={styles.socialButton}>
//             <span style={styles.socialIcon}>📧</span>
//             Google
//           </button>
//           <button type="button" style={styles.socialButton}>
//             <span style={styles.socialIcon}>📱</span>
//             Phone
//           </button>
//         </div>
        
//         <div style={styles.footer}>
//           <p style={styles.footerText}>
//             Don't have an account? 
//             <Link to="/signup" style={styles.link}> Create one here</Link>
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
//     maxWidth: '420px',
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
//   inputGroup: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
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
//   extraOptions: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     fontSize: '14px',
//   },
//   checkboxLabel: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     cursor: 'pointer',
//   },
//   checkbox: {
//     width: '16px',
//     height: '16px',
//     accentColor: '#667eea',
//   },
//   checkboxText: {
//     color: '#4a5568',
//   },
//   forgotLink: {
//     color: '#667eea',
//     textDecoration: 'none',
//     fontWeight: '500',
//     transition: 'color 0.3s ease',
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
//   divider: {
//     display: 'flex',
//     alignItems: 'center',
//     margin: '30px 0 20px',
//   },
//   dividerText: {
//     fontSize: '14px',
//     color: '#718096',
//     background: 'white',
//     padding: '0 15px',
//     position: 'relative',
//     zIndex: 1,
//   },
//   socialButtons: {
//     display: 'flex',
//     gap: '10px',
//     marginBottom: '20px',
//   },
//   socialButton: {
//     flex: 1,
//     padding: '12px',
//     fontSize: '14px',
//     fontWeight: '500',
//     color: '#4a5568',
//     background: 'rgba(255, 255, 255, 0.8)',
//     border: '2px solid #e2e8f0',
//     borderRadius: '10px',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '6px',
//   },
//   socialIcon: {
//     fontSize: '16px',
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

// // Add CSS animations and hover effects
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
//   }
  
//   button[type="submit"]:hover {
//     box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
//   }
  
//   button[type="submit"]:hover span:last-child {
//     transform: translateX(4px);
//   }
  
//   button[type="button"]:hover {
//     border-color: #667eea;
//     background: rgba(102, 126, 234, 0.05);
//     color: #667eea;
//   }
  
//   a:hover {
//     color: #764ba2 !important;
//   }
  
//   .divider::before {
//     content: '';
//     flex: 1;
//     height: 1px;
//     background: #e2e8f0;
//   }
  
//   .divider::after {
//     content: '';
//     flex: 1;
//     height: 1px;
//     background: #e2e8f0;
//   }
// `;
// document.head.appendChild(styleSheet);

// export default SignIn;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    // Load Google Sign-In script
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

  const storeSession = (userData, remember = false) => {
    const sessionData = {
      uniqueId: userData.uniqueId,
      email: userData.email,
      name: userData.name,
      loginTime: new Date().toISOString(),
      authMethod: userData.authMethod || 'email'
    };

    const sessionDuration = remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const expiryTime = new Date().getTime() + sessionDuration;

    localStorage.setItem('userSession', JSON.stringify(sessionData));
    localStorage.setItem('sessionExpiry', expiryTime.toString());
    
    console.log('Session stored:', {
      data: sessionData,
      expiresAt: new Date(expiryTime).toLocaleString(),
      duration: remember ? '7 days' : '1 day'
    });
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/users/google-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();
      if (response.ok) {
        storeSession({ ...data, authMethod: 'google' }, rememberMe);
        
        // Fetch profile data
        try {
          const profileResponse = await axios.get(`http://localhost:5000/api/users/profile/${data.uniqueId}`);
          if (profileResponse.data.profileImage) {
            localStorage.setItem('userProfileImage', profileResponse.data.profileImage);
          }
        } catch (profileError) {
          console.error('Error fetching profile image:', profileError);
        }

        navigate(`/dashboard/${data.uniqueId}`);
      } else {
        alert(data.message || 'Google sign-in failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Google Sign-In popup
  const handleGoogleSignInClick = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      alert('Google Sign-In is not loaded yet. Please try again.');
    }
  };

  // Send OTP for phone login
  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/users/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        alert('OTP sent to your phone number');
      } else {
        alert(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and sign in
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        storeSession({ ...data, authMethod: 'phone' }, rememberMe);
        
        // Fetch profile data
        try {
          const profileResponse = await axios.get(`http://localhost:5000/api/users/profile/${data.uniqueId}`);
          if (profileResponse.data.profileImage) {
            localStorage.setItem('userProfileImage', profileResponse.data.profileImage);
          }
        } catch (profileError) {
          console.error('Error fetching profile image:', profileError);
        }

        navigate(`/dashboard/${data.uniqueId}`);
      } else {
        alert(data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email/password sign in
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const userData = { email, password };
      
      const response = await fetch('http://localhost:5000/api/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
      if (response.ok) {
        storeSession({ ...data, authMethod: 'email' }, rememberMe);

        // Fetch profile data
        try {
          const profileResponse = await axios.get(`http://localhost:5000/api/users/profile/${data.uniqueId}`);
          if (profileResponse.data.profileImage) {
            localStorage.setItem('userProfileImage', profileResponse.data.profileImage);
          } else {
            localStorage.removeItem('userProfileImage');
          }
        } catch (profileError) {
          console.error('Error fetching profile image:', profileError);
          localStorage.removeItem('userProfileImage');
        }

        navigate(`/dashboard/${data.uniqueId}`);
      } else {
        alert(data.message || 'Sign-in failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <div style={styles.icon}>🔐</div>
          </div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your safe journey</p>
        </div>

        {/* Auth Method Toggle */}
        <div style={styles.authToggle}>
          <button 
            type="button" 
            style={{...styles.toggleButton, ...(isPhoneLogin ? {} : styles.activeToggle)}}
            onClick={() => {setIsPhoneLogin(false); setOtpSent(false); setOtp(''); setPhoneNumber('');}}
          >
            Email
          </button>
          <button 
            type="button" 
            style={{...styles.toggleButton, ...(isPhoneLogin ? styles.activeToggle : {})}}
            onClick={() => {setIsPhoneLogin(true); setEmail(''); setPassword('');}}
          >
            Phone
          </button>
        </div>
        
        {/* Email/Password Form */}
        {!isPhoneLogin && (
          <form onSubmit={handleSubmit} style={styles.form}>
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
            
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div style={styles.extraOptions}>
              <label style={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  style={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span style={styles.checkboxText}>Remember me</span>
              </label>
              <a href="#" style={styles.forgotLink}>Forgot password?</a>
            </div>
            
            <button type="submit" style={styles.button} disabled={isLoading}>
              <span style={styles.buttonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </span>
              <span style={styles.buttonIcon}>→</span>
            </button>
          </form>
        )}

        {/* Phone/OTP Form */}
        {isPhoneLogin && (
          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="phone" style={styles.label}>Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={styles.input}
                placeholder="Enter your phone number"
                disabled={otpSent}
                required
              />
            </div>
            
            {!otpSent ? (
              <button 
                type="button" 
                onClick={handleSendOTP} 
                style={styles.button}
                disabled={isLoading}
              >
                <span style={styles.buttonText}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </span>
                <span style={styles.buttonIcon}>📱</span>
              </button>
            ) : (
              <>
                <div style={styles.inputGroup}>
                  <label htmlFor="otp" style={styles.label}>Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={styles.input}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    required
                  />
                </div>
                
                <div style={styles.extraOptions}>
                  <label style={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      style={styles.checkbox}
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span style={styles.checkboxText}>Remember me</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={handleSendOTP}
                    style={styles.resendButton}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                </div>
                
                <button 
                  type="button" 
                  onClick={handleVerifyOTP} 
                  style={styles.button}
                  disabled={isLoading}
                >
                  <span style={styles.buttonText}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </span>
                  <span style={styles.buttonIcon}>✓</span>
                </button>
              </>
            )}
          </div>
        )}
        
        {/* <div style={styles.divider}>
          <span style={styles.dividerText}>or continue with</span>
        </div> */}
        
        {/* <div style={styles.socialButtons}>
          <button 
            type="button" 
            style={styles.socialButton}
            onClick={handleGoogleSignInClick}
            disabled={isLoading}
          >
            <span style={styles.socialIcon}>🔍</span>
            Google
          </button>
          <button 
            type="button" 
            style={{...styles.socialButton, ...(isPhoneLogin ? styles.activeSocialButton : {})}}
            onClick={() => {setIsPhoneLogin(true); setEmail(''); setPassword('');}}
          >
            <span style={styles.socialIcon}>📱</span>
            Phone
          </button>
        </div> */}
        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account? 
            <Link to="/signup" style={styles.link}> Create one here</Link>
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
    maxWidth: '420px',
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
  authToggle: {
    display: 'flex',
    background: '#f7fafc',
    borderRadius: '12px',
    padding: '4px',
    marginBottom: '20px',
  },
  toggleButton: {
    flex: 1,
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'transparent',
    color: '#718096',
  },
  activeToggle: {
    background: 'white',
    color: '#667eea',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
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
  extraOptions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#667eea',
  },
  checkboxText: {
    color: '#4a5568',
  },
  forgotLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  },
  resendButton: {
    color: '#667eea',
    background: 'none',
    border: 'none',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
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
  buttonText: {
    fontSize: '16px',
  },
  buttonIcon: {
    fontSize: '18px',
    transition: 'transform 0.3s ease',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '30px 0 20px',
  },
  dividerText: {
    fontSize: '14px',
    color: '#718096',
    background: 'white',
    padding: '0 15px',
    position: 'relative',
    zIndex: 1,
  },
  socialButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  socialButton: {
    flex: 1,
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4a5568',
    background: 'rgba(255, 255, 255, 0.8)',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  activeSocialButton: {
    borderColor: '#667eea',
    background: 'rgba(102, 126, 234, 0.05)',
    color: '#667eea',
  },
  socialIcon: {
    fontSize: '16px',
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

// Add CSS animations and hover effects
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
  
  button[type="submit"]:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
  }
  
  button[type="submit"]:hover:not(:disabled) span:last-child {
    transform: translateX(4px);
  }
  
  button[type="button"]:hover:not(:disabled) {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
    color: #667eea;
  }
  
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
  }
  
  a:hover {
    color: #764ba2 !important;
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

export default SignIn;
