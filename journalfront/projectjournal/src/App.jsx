import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { Homepage } from './pages/homepage';
import Journal from './pages/journal';
import LogIn from './pages/login';
import ProfilePage from './pages/profilepage';
import CalendarPage from './pages/calender';
import MoodTracker from './pages/trends';
import ReflectionPage from './pages/reflections';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/calender" element={<CalendarPage />} />
        <Route path="/trends" element={<MoodTracker />} />
       <Route path="/reflections" element={<ReflectionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;