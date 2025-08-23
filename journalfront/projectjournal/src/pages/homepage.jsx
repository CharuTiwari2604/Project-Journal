// import React, { useState, useEffect } from "react";
// import axios from "../api/axios";
// import { Link, useNavigate } from "react-router-dom";
// import '../css/homepage.css';
// import logo from '../assets/logo.png';
// import bg9 from '../assets/bgimg.jpg';
// import journalIcon from '../assets/journal-icon.png';
// import moodIcon from '../assets/mood-icon.png';
// import calendarIcon from '../assets/calendar-icon.png';
// import reflectionIcon from '../assets/reflection-icon.png';
// import LogIn from './login';
// import SignIn from "./signin";

// export function Homepage() {
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [isSigninOpen, setIsSigninOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [authError, setAuthError] = useState(null);
//   const navigate = useNavigate();

//   const checkLoginStatus = async () => {
//     try {
//       setIsLoading(true);
//       setAuthError(null);

//       const res = await axios.get("/journal/profile");
//       if (res.status === 200 && res.data) {
//         setIsLoggedIn(true);
//       } else {
//         setIsLoggedIn(false);
//       }
//     } catch (err) {
//       console.log("Login check failed:", err.response?.status || err.message);
//       setIsLoggedIn(false);
//       setAuthError("Not logged in");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkLoginStatus();
//   }, []);

//   const handleLoginSuccess = () => {
//     setIsLoginOpen(false);
//     checkLoginStatus();
//   };

//   const handleLogout = async () => {
//     if (window.confirm("Are you sure you want to log out?")) {
//       try {
//         await axios.get("/logout"); 
//         setIsLoggedIn(false);
//         navigate("/");
//          alert("Logged out Successfully!");
//       } catch (err) {
//         console.error("Logout failed:", err);
//         alert("Logout failed");
//       }
//     }
//   };
// const handleSigninClick = () => {
//   setIsSigninOpen(true);
//   setIsLoginOpen(false);
// };

// const handleSigninClose = () => {
//   setIsSigninOpen(false);
// };

// const handleSigninSuccess = () => {
//   setIsSigninOpen(false);
//   setIsLoginOpen(true);
// };

//   const handleLoginClose = () => {
//     setIsLoginOpen(false);
//   };

//   return (
//     <div className="homepage">
//       <div className="header">
//         <img className="logo" src={logo} alt="logo" />
//         <div className="textcontainer">
//           <div className="tagline">Whispers WithIn</div>
//           <div className="sideline">Writing from the soul</div>
//         </div>
//         <div className="login">
//           {isLoading ? (
//             <p>Checking login status...</p>
//           ) : isLoggedIn ? (
            
//             <>
//               <button className="signup" onClick={handleLogout}>Logout</button>
//             </>
//           ) : (
//             <>
//               <button className="signup" onClick={() => setIsLoginOpen(true)}>Login</button>
//               <button className="signup" onClick={() => setIsSigninOpen(true)}>Sign Up</button>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="main">
//         <div className="homenavlinks">
//           <Link to="/">Home</Link>
//           <Link to="/journal">Journal</Link>
//           <Link to="/trends">Mood Trends</Link>
//           <Link to="/calender">Calendar</Link>
//           <Link to="/reflections">Reflections</Link>
//           <Link to="/profilepage">My Profile</Link>
//         </div>
//         <div className="text">
//           <div className="head">Discover Yourself Through Words</div>
//           <div className="msg">Your thoughts are powerful.
//             Whispers WithIn gives you a safe space to reflect, write, and understand your emotions better.
//             Track your moods, express your feelings, and build a deeper connection with yourself—one entry at a time.</div>
//         </div>
//         <img className="bgimghome" src={bg9} alt="background image" />
//       </div>

//       {/* Features Section */}
//       <div className="features-section">
//         <div className="section-header">
//           <h2>Powerful Features for Self-Discovery</h2>
//           <p>Everything you need to understand your emotional journey</p>
//         </div>
//         <div className="features-grid">
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src={journalIcon} alt="Journal Icon" />
//             </div>
//             <h3>Digital Journal</h3>
//             <p>Write freely in your personal digital journal. Capture thoughts, feelings, and memories in a secure, private space.</p>
//           </div>
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src={moodIcon} alt="Mood Icon" />
//             </div>
//             <h3>Mood Tracking</h3>
//             <p>Track your emotional patterns over time. Visualize your mood trends and gain insights into your emotional well-being.</p>
//           </div>
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src={calendarIcon} alt="Calendar Icon" />
//             </div>
//             <h3>Reflection Calendar</h3>
//             <p>View your journaling journey at a glance. See patterns in your writing habits and emotional states.</p>
//           </div>
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src={reflectionIcon} alt="Reflection Icon" />
//             </div>
//             <h3>Guided Reflections</h3>
//             <p>Receive personalized insights and reflections based on your journal entries to deepen your self-understanding.</p>
//           </div>
//         </div>
//       </div>

//       {/* How It Works Section */}
//       <div className="how-it-works">
//         <div className="section-header">
//           <h2>How Whispers WithIn Works</h2>
//           <p>Start your journey of self-discovery in three simple steps</p>
//         </div>
//         <div className="steps-container">
//           <div className="step">
//             <div className="step-number">1</div>
//             <h3>Write Freely</h3>
//             <p>Express your thoughts and feelings without judgment in your private journal. Write as much or as little as you want, whenever you feel inspired.</p>
//           </div>
//           <div className="step">
//             <div className="step-number">2</div>
//             <h3>Track & Analyze</h3>
//             <p>Our AI analyzes your entries to identify emotions and patterns. Visualize your mood trends over time and gain valuable insights.</p>
//           </div>
//           <div className="step">
//             <div className="step-number">3</div>
//             <h3>Reflect & Grow</h3>
//             <p>Receive personalized reflections and guidance based on your entries. Develop a deeper understanding of yourself and continue your growth journey.</p>
//           </div>
//         </div>
//       </div>

//       {/* Testimonials Section */}
//       <div className="testimonials">
//         <div className="section-header">
//           <h2>What Our Users Say</h2>
//           <p>Join thousands who have transformed their lives through mindful journaling</p>
//         </div>
//         <div className="testimonials-grid">
//           <div className="testimonial-card">
//             <div className="testimonial-content">
//               <p>"Whispers WithIn has completely transformed how I process my emotions. The mood tracking helped me identify patterns I never noticed before."</p>
//             </div>
//             <div className="testimonial-author">
//               <div className="author-name">Sarah J.</div>
//               <div className="author-title">Teacher</div>
//             </div>
//           </div>
//           <div className="testimonial-card">
//             <div className="testimonial-content">
//               <p>"The guided reflections are incredibly insightful. It's like having a personal therapist available 24/7. I've grown so much in just a few months."</p>
//             </div>
//             <div className="testimonial-author">
//               <div className="author-name">Michael T.</div>
//               <div className="author-title">Software Engineer</div>
//             </div>
//           </div>
//           <div className="testimonial-card">
//             <div className="testimonial-content">
//               <p>"I've tried many journaling apps, but this is the first one that truly understands emotional well-being. The calendar view is my favorite feature!"</p>
//             </div>
//             <div className="testimonial-author">
//               <div className="author-name">Emma R.</div>
//               <div className="author-title">Graphic Designer</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Call to Action Section */}
//       <div className="cta-section">
//         <div className="cta-content">
//           <h2>Start Your Journey of Self-Discovery Today</h2>
//           <p>Join thousands who have found clarity and peace through mindful journaling</p>
//           {isLoggedIn ? (
//             <Link to="/journal" className="cta-button">Continue Journaling</Link>
//           ) : (
//             <button className="cta-button" onClick={handleSigninClick}>Sign Up for Free</button>
//           )}
//         </div>

//         <div className="footer-bottom">
//           <p>&copy; {new Date().getFullYear()} Whispers WithIn. All rights reserved.</p>
//         </div>
//       </div>

      
//       {/* login */}
//       {isLoginOpen && (
//         <LogIn
//           isOpen={isLoginOpen}
//           onClose={handleLoginClose}
//           onLoginSuccess={handleLoginSuccess}
//         />
//       )}
//       {/* signup */}
//       {isSigninOpen && (
//         <SignIn
//           isOpen={isSigninOpen}
//           onClose={handleSigninClose}
//           onSigninSuccess={handleSigninSuccess}
//         />
//       )}
//     </div>
//   )
// }










// import React, { useState, useEffect } from "react";
// import axios from "../api/axios"; 
// import { Link, useNavigate } from "react-router-dom";
// import '../css/homepage.css';
// import logo from '../assets/logo.png';
// import bg9 from '../assets/bgimg.jpg';
// import journalIcon from '../assets/journal-icon.png';
// import moodIcon from '../assets/mood-icon.png';
// import calendarIcon from '../assets/calendar-icon.png';
// import reflectionIcon from '../assets/reflection-icon.png';
// import LogIn from './login';
// import SignIn from "./signin";

// export function Homepage() {
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [isSigninOpen, setIsSigninOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [authError, setAuthError] = useState(null);
//   const [showBanner, setShowBanner] = useState(false);
//   const navigate = useNavigate();

//   const checkLoginStatus = async () => {
//     try {
//       setIsLoading(true);
//       setAuthError(null);

//       const res = await axios.get("/journal/profile", { withCredentials: true });
//       if (res.status === 200 && res.data) {
//         setIsLoggedIn(true);
//       } else {
//         setIsLoggedIn(false);
//       }
//     } catch (err) {
//       console.log("Login check failed:", err.response?.status || err.message);
//       setIsLoggedIn(false);
//       setAuthError("Not logged in");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkLoginStatus();
//   }, []);
  
//   // Show banner after half a second
//   useEffect(() => {
//   const timer = setTimeout(() => {
//     setShowBanner(true);
//   }, 500);

//   return () => clearTimeout(timer);
// }, []);

// const handleCloseBanner = () => {
//   setShowBanner(false);
// }

//   const handleLoginSuccess = () => {
//     setIsLoginOpen(false);
//     checkLoginStatus();
//   };

//   const handleLogout = async () => {
//     if (window.confirm("Are you sure you want to log out?")) {
//       try {
//         await axios.get("/logout", { withCredentials: true }); 
//         setIsLoggedIn(false);
//         navigate("/");
//          alert("Logged out Successfully!");
//       } catch (err) {
//         console.error("Logout failed:", err);
//         alert("Logout failed");
//       }
//     }
//   };
// const handleSigninClick = () => {
//   setIsSigninOpen(true);
//   setIsLoginOpen(false);
// };

// const handleSigninClose = () => {
//   setIsSigninOpen(false);
// };

// const handleSigninSuccess = () => {
//   setIsSigninOpen(false);
//   setIsLoginOpen(true);
// };

//   const handleLoginClose = () => {
//     setIsLoginOpen(false);
//   };

//   return (
//     <div className="homepage">
//       <div className="header">
//         <img className="logo" src={logo} alt="logo" />
//         <div className="textcontainer">
//           <div className="tagline">Whispers WithIn</div>
//           <div className="sideline">Writing from the soul</div>
//         </div>
//         <div className="login">
//           {isLoading ? (
//             <p>Checking login status...</p>
//           ) : isLoggedIn ? (
            
//             <>
//               <button className="signup" onClick={handleLogout}>Logout</button>
//             </>
//           ) : (
//             <>
//               <button className="signup" onClick={() => setIsLoginOpen(true)}>Login</button>
//               <button className="signup" onClick={() => setIsSigninOpen(true)}>Sign Up</button>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="main">
//         <div className="homenavlinks">
//           <Link to="/">Home</Link>
//           <Link to="/journal">Journal</Link>
//           <Link to="/trends">Mood Trends</Link>
//           <Link to="/calender">Calendar</Link>
//           <Link to="/reflections">Reflections</Link>
//           <Link to="/profilepage">My Profile</Link>
//         </div>
//         <div className="text">
//           <div className="head">Discover Yourself Through Words</div>
//           <div className="msg">Your thoughts are powerful.
//             Whispers WithIn gives you a safe space to reflect, write, and understand your emotions better.
//             Track your moods, express your feelings, and build a deeper connection with yourself—one entry at a time.</div>
//         </div>
//         <img className="bgimghome" src={bg9} alt="background image" />
//       </div>

//       {/* Features Section */}
//       <div className="features-section">
//         <div className="section-header">
//           <h2>Powerful Features for Self-Discovery</h2>
//           <p>Everything you need to understand your emotional journey</p>
//         </div>
//         <div className="features-grid">
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src={journalIcon} alt="Journal Icon" />
//             </div>
//             <h3>Digital Journal</h3>
//             <p>Write freely in your personal digital journal. Capture thoughts, feelings, and memories in a secure, private space.</p>
//           </div>
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src={moodIcon} alt="Mood Icon" />
//             </div>
//             <h3>Mood Tracking</h3>
//             <p>Track your emotional patterns over time. Visualize your mood trends and gain insights into your emotional well-being.</p>
//           </div>
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src={calendarIcon} alt="Calendar Icon" />
//             </div>
//             <h3>Reflection Calendar</h3>
//             <p>View your journaling journey at a glance. See patterns in your writing habits and emotional states.</p>
//           </div>
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src={reflectionIcon} alt="Reflection Icon" />
//             </div>
//             <h3>Guided Reflections</h3>
//             <p>Receive personalized insights and reflections based on your journal entries to deepen your self-understanding.</p>
//           </div>
//         </div>
//       </div>

//       {/* How It Works Section */}
//       <div className="how-it-works">
//         <div className="section-header">
//           <h2>How Whispers WithIn Works</h2>
//           <p>Start your journey of self-discovery in three simple steps</p>
//         </div>
//         <div className="steps-container">
//           <div className="step">
//             <div className="step-number">1</div>
//             <h3>Write Freely</h3>
//             <p>Express your thoughts and feelings without judgment in your private journal. Write as much or as little as you want, whenever you feel inspired.</p>
//           </div>
//           <div className="step">
//             <div className="step-number">2</div>
//             <h3>Track & Analyze</h3>
//             <p>Our AI analyzes your entries to identify emotions and patterns. Visualize your mood trends over time and gain valuable insights.</p>
//           </div>
//           <div className="step">
//             <div className="step-number">3</div>
//             <h3>Reflect & Grow</h3>
//             <p>Receive personalized reflections and guidance based on your entries. Develop a deeper understanding of yourself and continue your growth journey.</p>
//           </div>
//         </div>
//       </div>

//       {/* Testimonials Section */}
//       <div className="testimonials">
//         <div className="section-header">
//           <h2>What Our Users Say</h2>
//           <p>Join thousands who have transformed their lives through mindful journaling</p>
//         </div>
//         <div className="testimonials-grid">
//           <div className="testimonial-card">
//             <div className="testimonial-content">
//               <p>"Whispers WithIn has completely transformed how I process my emotions. The mood tracking helped me identify patterns I never noticed before."</p>
//             </div>
//             <div className="testimonial-author">
//               <div className="author-name">Sarah J.</div>
//               <div className="author-title">Teacher</div>
//             </div>
//           </div>
//           <div className="testimonial-card">
//             <div className="testimonial-content">
//               <p>"The guided reflections are incredibly insightful. It's like having a personal therapist available 24/7. I've grown so much in just a few months."</p>
//             </div>
//             <div className="testimonial-author">
//               <div className="author-name">Michael T.</div>
//               <div className="author-title">Software Engineer</div>
//             </div>
//           </div>
//           <div className="testimonial-card">
//             <div className="testimonial-content">
//               <p>"I've tried many journaling apps, but this is the first one that truly understands emotional well-being. The calendar view is my favorite feature!"</p>
//             </div>
//             <div className="testimonial-author">
//               <div className="author-name">Emma R.</div>
//               <div className="author-title">Graphic Designer</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Call to Action Section */}
//       <div className="cta-section">
//         <div className="cta-content">
//           <h2>Start Your Journey of Self-Discovery Today</h2>
//           <p>Join thousands who have found clarity and peace through mindful journaling</p>
//           {isLoggedIn ? (
//             <Link to="/journal" className="cta-button">Continue Journaling</Link>
//           ) : (
//             <button className="cta-button" onClick={handleSigninClick}>Sign Up for Free</button>
//           )}
//         </div>

//         <div className="footer-bottom">
//           <p>&copy; {new Date().getFullYear()} Whispers WithIn. All rights reserved.</p>
//         </div>
//       </div>

      
//       {/* login */}
//       {isLoginOpen && (
//         <LogIn
//           isOpen={isLoginOpen}
//           onClose={handleLoginClose}
//           onLoginSuccess={handleLoginSuccess}
//         />
//       )}
//       {/* signup */}
//       {isSigninOpen && (
//         <SignIn
//           isOpen={isSigninOpen}
//           onClose={handleSigninClose}
//           onSigninSuccess={handleSigninSuccess}
//         />
//       )}
//       {/* banner */}
//       {showBanner && (
//   <div className="fixed bottom-0 left-0 w-full bg-black/70 text-white border-t border-gray-300 shadow-md px-4 py-6 text-center z-[9999]">
//     <span>
//       ⚠️ This is a demo project for educational use only. Please do not submit sensitive information.
//     </span>
//     <button
//       className="absolute top-2 right-4 text-white hover:text-gray-400 text-lg"
//       onClick={handleCloseBanner}
//       aria-label="Close Disclaimer"
//     >
//       &times;
//     </button>
//   </div>
// )}

//     </div>
//   )
// }











import React, { useState, useEffect } from "react";
import axios from "../api/axios"; 
import { Link, useNavigate } from "react-router-dom";
import '../css/homepage.css';
import logo from '../assets/logo.png';
import bg9 from '../assets/bgimg.jpg';
import journalIcon from '../assets/journal-icon.png';
import moodIcon from '../assets/mood-icon.png';
import calendarIcon from '../assets/calendar-icon.png';
import reflectionIcon from '../assets/reflection-icon.png';
import LogIn from './login';
import SignIn from "./signin";

export function Homepage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();
  
  // Set the API URL based on environment
  const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api'  // Local development URL
    : 'https://project-journal-nrgb.onrender.com/api';  // Production URL
  
  const checkLoginStatus = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      // Use the full URL with the correct endpoint
      const res = await axios.get(`${API_BASE_URL}/journal/profile`, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (res.status === 200 && res.data) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.log("Login check failed:", err.response?.status || err.message);
      setIsLoggedIn(false);
      
      // Only set auth error if it's not a 401 (which is expected for non-logged users)
      if (err.response?.status !== 401) {
        setAuthError("Authentication check failed");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkLoginStatus();
  }, []);
  
  // Show banner after half a second
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleCloseBanner = () => {
    setShowBanner(false);
  };
  
  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    checkLoginStatus();
  };
  
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        // Use the full URL with the correct endpoint
        await axios.get(`${API_BASE_URL}/logout`, { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }); 
        setIsLoggedIn(false);
        navigate("/");
        alert("Logged out Successfully!");
      } catch (err) {
        console.error("Logout failed:", err);
        alert("Logout failed");
      }
    }
  };
  
  const handleSigninClick = () => {
    setIsSigninOpen(true);
    setIsLoginOpen(false);
  };
  
  const handleSigninClose = () => {
    setIsSigninOpen(false);
  };
  
  const handleSigninSuccess = () => {
    setIsSigninOpen(false);
    setIsLoginOpen(true);
  };
  
  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  return (
    <div className="homepage">
      <div className="header">
        <img className="logo" src={logo} alt="logo" />
        <div className="textcontainer">
          <div className="tagline">Whispers WithIn</div>
          <div className="sideline">Writing from the soul</div>
        </div>
        <div className="login">
          {isLoading ? (
            <p>Checking login status...</p>
          ) : isLoggedIn ? (
            
            <>
              <button className="signup" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="signup" onClick={() => setIsLoginOpen(true)}>Login</button>
              <button className="signup" onClick={() => setIsSigninOpen(true)}>Sign Up</button>
            </>
          )}
        </div>
      </div>
      <div className="main">
        <div className="homenavlinks">
          <Link to="/">Home</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/trends">Mood Trends</Link>
          <Link to="/calender">Calendar</Link>
          <Link to="/reflections">Reflections</Link>
          <Link to="/profilepage">My Profile</Link>
        </div>
        <div className="text">
          <div className="head">Discover Yourself Through Words</div>
          <div className="msg">Your thoughts are powerful.
            Whispers WithIn gives you a safe space to reflect, write, and understand your emotions better.
            Track your moods, express your feelings, and build a deeper connection with yourself—one entry at a time.</div>
        </div>
        <img className="bgimghome" src={bg9} alt="background image" />
      </div>
      {/* Features Section */}
      <div className="features-section">
        <div className="section-header">
          <h2>Powerful Features for Self-Discovery</h2>
          <p>Everything you need to understand your emotional journey</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <img src={journalIcon} alt="Journal Icon" />
            </div>
            <h3>Digital Journal</h3>
            <p>Write freely in your personal digital journal. Capture thoughts, feelings, and memories in a secure, private space.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src={moodIcon} alt="Mood Icon" />
            </div>
            <h3>Mood Tracking</h3>
            <p>Track your emotional patterns over time. Visualize your mood trends and gain insights into your emotional well-being.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src={calendarIcon} alt="Calendar Icon" />
            </div>
            <h3>Reflection Calendar</h3>
            <p>View your journaling journey at a glance. See patterns in your writing habits and emotional states.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src={reflectionIcon} alt="Reflection Icon" />
            </div>
            <h3>Guided Reflections</h3>
            <p>Receive personalized insights and reflections based on your journal entries to deepen your self-understanding.</p>
          </div>
        </div>
      </div>
      {/* How It Works Section */}
      <div className="how-it-works">
        <div className="section-header">
          <h2>How Whispers WithIn Works</h2>
          <p>Start your journey of self-discovery in three simple steps</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Write Freely</h3>
            <p>Express your thoughts and feelings without judgment in your private journal. Write as much or as little as you want, whenever you feel inspired.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Track & Analyze</h3>
            <p>Our AI analyzes your entries to identify emotions and patterns. Visualize your mood trends over time and gain valuable insights.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Reflect & Grow</h3>
            <p>Receive personalized reflections and guidance based on your entries. Develop a deeper understanding of yourself and continue your growth journey.</p>
          </div>
        </div>
      </div>
      {/* Testimonials Section */}
      <div className="testimonials">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p>Join thousands who have transformed their lives through mindful journaling</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Whispers WithIn has completely transformed how I process my emotions. The mood tracking helped me identify patterns I never noticed before."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-name">Sarah J.</div>
              <div className="author-title">Teacher</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"The guided reflections are incredibly insightful. It's like having a personal therapist available 24/7. I've grown so much in just a few months."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-name">Michael T.</div>
              <div className="author-title">Software Engineer</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"I've tried many journaling apps, but this is the first one that truly understands emotional well-being. The calendar view is my favorite feature!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-name">Emma R.</div>
              <div className="author-title">Graphic Designer</div>
            </div>
          </div>
        </div>
      </div>
      {/* Call to Action Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Start Your Journey of Self-Discovery Today</h2>
          <p>Join thousands who have found clarity and peace through mindful journaling</p>
          {isLoggedIn ? (
            <Link to="/journal" className="cta-button">Continue Journaling</Link>
          ) : (
            <button className="cta-button" onClick={handleSigninClick}>Sign Up for Free</button>
          )}
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Whispers WithIn. All rights reserved.</p>
        </div>
      </div>
      
      {/* login */}
      {isLoginOpen && (
        <LogIn
          isOpen={isLoginOpen}
          onClose={handleLoginClose}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {/* signup */}
      {isSigninOpen && (
        <SignIn
          isOpen={isSigninOpen}
          onClose={handleSigninClose}
          onSigninSuccess={handleSigninSuccess}
        />
      )}
      {/* banner */}
      {showBanner && (
  <div className="fixed bottom-0 left-0 w-full bg-black/70 text-white border-t border-gray-300 shadow-md px-4 py-6 text-center z-[9999]">
    <span>
      ⚠️ This is a demo project for educational use only. Please do not submit sensitive information.
    </span>
    <button
      className="absolute top-2 right-4 text-white hover:text-gray-400 text-lg"
      onClick={handleCloseBanner}
      aria-label="Close Disclaimer"
    >
      &times;
    </button>
  </div>
)}
    </div>
  )
}