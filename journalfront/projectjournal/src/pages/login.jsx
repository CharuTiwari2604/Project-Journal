import React, { useState } from 'react';
import api from "../api/axios";
import '../css/signin.css';
import { useNavigate } from "react-router-dom";


  const LogIn = ({onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
const navigate = useNavigate();

  const resetFields = () => {
    setEmail('');
    setPassword('');
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Email and password are required');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post(
        '/login',
        { email, password },
        { withCredentials: true }
      );

      alert('Login Successful');

      if (onLoginSuccess) onLoginSuccess();
      onClose();
     resetFields();
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
   const handleClose = () => {
       if (onClose) onClose();       
    navigate('/homepage'); 
  };

  return (
    <div className="logmodal-overlay">
      <div className="logmodal-content">
       <button className="logclose-btn" onClick={handleClose}>X</button>
       <h2>Log In</h2>
        <form onSubmit={handleLogin} className="loglogin-form">
          <input 
            type="email" 
            placeholder="Email Id" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
             <input 
            type="password" 
            placeholder="Enter Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button className='logloginbtn' type="submit">Log In</button>
        </form>
      </div>
    </div>
     );
}

export default LogIn;
