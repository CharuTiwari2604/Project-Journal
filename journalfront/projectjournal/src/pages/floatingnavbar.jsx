import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../css/FloatingNavbar.css';

const FloatingNavbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navbarRef = useRef(null);
  const isMouseInside = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const nearLeftEdge = e.clientX < 50;
      if (nearLeftEdge || isMouseInside.current) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleMouseEnter = () => {
    isMouseInside.current = true;
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    isMouseInside.current = false;
    setIsVisible(false);
  };

  return (
    <div
      ref={navbarRef}
      className={`floating-navbar ${isVisible ? 'visible' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="navlinks">
        <Link to="/">Home</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/trends">Mood Trends</Link>
        <Link to="/calender">Calendar</Link>
        <Link to="/reflections">Reflections</Link>
        <Link to="/profilepage">My Profile</Link>
      </div>
    </div>
  );
};

export default FloatingNavbar;
