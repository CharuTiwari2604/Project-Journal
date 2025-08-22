import React, { useState, useEffect } from "react";
import '../css/journalpage.css';
import aibg from "../assets/ailogo.png";
import bgimg from "../assets/journalbg2.jpg";
import bgimg2 from "../assets/journalbg3.png";
import { useNavigate } from 'react-router-dom';
import axios from "../api/axios";
import FloatingNavbar from "./floatingnavbar";

const Journal = () => {

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const dayStr = today.toLocaleDateString('en-US', { weekday: 'long' });
  const [title, setTitle] = useState('');
  const [entry, setEntry] = useState('');
  const emojis = ['😊 Happy', '😢 Sad', '😡 Angry', '😴 Tired', '😇 Calm', '🤯 Stressed'];
  const [selectedMood, setSelectedMood] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonState, setButtonState] = useState('see'); // 'see' | 'save'

  const navigate = useNavigate();

  //  Fetch AI Analysis only
  const handleSeeAnalysis = async () => {
    if (!title || !entry || !selectedMood) {
      alert("Please fill out all the fields");
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      const nlpRes = await fetch(`${import.meta.env.VITE_NLP_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: entry }),
      });

      if (nlpRes.ok) {
        const analysis = await nlpRes.json();
        setAiResponse(analysis.feedback || "No insight");
      } else {
        setAiResponse("NLP analysis unavailable");
      }
      // Switch to save mode
      setButtonState('save');
    } catch (err) {
      console.error("NLP request failed:", err);
      setAiResponse("NLP analysis unavailable");
    } finally {
      setLoading(false);
    }
  };
  //  Save Journal + Analysis
  const handleSaveJournal = async () => {
    setLoading(true);
    setErrorMsg('');
    // extra
      let moodObj = {};
  if (selectedMood) {
    const [emoji, ...labelParts] = selectedMood.split(" ");
    moodObj = {
      emoji,
      label: labelParts.join(" ")
    };
  }
  // 

    const journalData = {
      date: dateStr,
      day: dayStr,
      title,
       mood: moodObj,
      entry,
      analysis: aiResponse
    };
    try {
      await axios.post("/journal", journalData, {
        withCredentials: true,
      });

      alert("Journal saved successfully!");
      navigate('/profilepage');
    } catch (error) {
      console.error("Error saving journal:", error);
      setErrorMsg("Failed to save journal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setEntry('');
    setSelectedMood('');
    setAiResponse('');
    setErrorMsg('');
    setButtonState('see');
  };

  return (
    <div className="journal" >
      <div className="journal-container">
        <div className="journhead">
          <h2>Daily Journal</h2>
        </div>
        <div className="image-wrapper">
          <img src={bgimg} alt="Decorative" className="journal-background" />
        </div>

        <p className="date">{dayStr}, {dateStr}</p>
        <form className="journal-form" onSubmit={e => {
          e.preventDefault();
          if (buttonState === 'see') {
            handleSeeAnalysis();
          } else { handleSaveJournal(); }
        }}>
          <label>Journal Title</label>
          <input
            type="text"
            value={title}
            placeholder="Enter title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Mood</label>
          <select value={selectedMood} onChange={(e) => setSelectedMood(e.target.value)}>
            <option value="">🥰Select your mood</option>
            {emojis.map((emoji, idx) => (
              <option key={idx} value={emoji}>{emoji}</option>
            ))}
          </select>

          <label>Journal Entry</label>
          <textarea
            value={entry}
            placeholder="Write your thoughts here..."
            onChange={(e) => setEntry(e.target.value)}
            rows={8}
          ></textarea>
          <div className="button-group">
            <button className="save-btn" type="submit" disabled={loading}>
              {loading ? 'Processing...' : buttonState === 'see' ? 'See Analysis' : 'Save'}
            </button>
             <button className="cancel-btn" type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>

      <div className="journal-right">
        <div className="rightbg">
          <img src={bgimg2} className="rightbgimg" />
        </div>
        {aiResponse && (
          <div className="rightside">
            <img src={aibg} alt="DecorativeAI" className="responsebg" />
            <div className="response">
              <h3>Your Analysis</h3>
              <p>{aiResponse}</p>
            </div>
          </div>
        )}
        {/* Show error if any */}
        {errorMsg && (
          <div style={{ marginTop: 20, color: 'red' }}>
            {errorMsg}
          </div>
        )}
      </div>
      <FloatingNavbar />
    </div>
  );
};

export default Journal;
