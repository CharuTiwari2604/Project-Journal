import React, { useState } from 'react';
import axios from "../api/axios";
import '../css/signin.css';

  const SignIn = ({ isOpen, onClose, onSigninSuccess }) => {
    const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
  }

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('All fields are required');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        '/register',
        { name, email, password },
        { withCredentials: true }
      );

      alert('Signed Up Successfully');

      if (onSigninSuccess) onSigninSuccess();
     onClose(); 
     resetFields();
    } catch (err) {
      alert('SignUp failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logmodal-overlay">
      <div className="logmodal-content logsignupbox">
       <button className="logclose-btn" onClick={onClose}>X</button>
       <h2>Sign Up</h2>
       <form onSubmit={handleSignin} className="loglogin-form">
          <input type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)}  required/>
          <input type="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)}  required/>
             <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          <button className='logloginbtn logsigninbtn' type="submit">Sign In
          </button>
        </form>
      </div>
    </div>
    );
}

export default SignIn;
