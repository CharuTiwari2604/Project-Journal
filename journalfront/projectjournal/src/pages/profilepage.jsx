import React, { useEffect, useState } from 'react';
import axios from "../api/axios";
import '../css/profilepage.css';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/progilebg.jpg';
import dlt from '../assets/dlticon.png';
import { format } from "date-fns";
import FloatingNavbar from './floatingnavbar';
import logoimg from '../assets/avatar.png';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [journalMap, setJournalMap] = useState(new Map());
  const [totalJournalDays, setTotalJournalDays] = useState(0);
  const [authFailed, setAuthFailed] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const getEmoji = (mood) => {
    if (!mood) return "";
    if (typeof mood === "string") return mood.split(" ")[0];
    if (typeof mood === "object" && mood.emoji) return mood.emoji;
    return "";
  };

  const getMoodName = (mood) => {
    if (!mood) return "";
    if (typeof mood === "string") return mood.split(" ").slice(1).join(" ");
    if (typeof mood === "object" && mood.label) return mood.label;
    return "";
  };

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    axios
      .get("/journal/profile", { withCredentials: true })
      .then((res) => {
        if (ignore) return;

        const { user, journals } = res.data || {};
        if (!user) {
          setAuthFailed(true);
          return;
        }

        setUser(user);
        setNewUsername(user.name || ""); 

        const items = Array.isArray(journals) ? journals : [];

        // build journal map
        const map = new Map();
        items.forEach((it) => {
          const raw = it.date ?? it.createdAt ?? it._id;
          const d = raw ? new Date(raw) : null;

          if (d && !isNaN(d.getTime())) {
            const key = format(d, "yyyy-MM-dd");
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(it);
          }
        });

        setJournals(items);
        setJournalMap(map);
        setTotalJournalDays(map.size);

        // Calculate streak
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const dateKey = format(date, "yyyy-MM-dd");
          if (map.has(dateKey)) {
            streak++;
          } else {
            break;
          }
        }
        setCurrentStreak(streak);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        if (err?.response?.status === 401) {
          setAuthFailed(true);
        }
      })
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, []);

  const deleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.delete(`/journal/${id}`, { withCredentials: true });
      setJournals(journals.filter((j) => j._id !== id));
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  //  Save username change
  const handleSaveUsername = async () => {
    try {
      const res = await axios.put(
        "/journal/update",
        { username: newUsername },
        { withCredentials: true }
      );
      setUser(res.data.user);
      setIsEditing(false);
      alert("Username updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating username:", err);
      alert("❌ Failed to update username");
    }
  };

  if (loading) {
    return <div className="loading">Loading Profile... </div>;
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (authFailed || !user?._id) {
    return (
      <div>
        <img className="bgimg" src={bg} alt="Background" />
        <div
          style={{ textAlign: "center", marginTop: "20rem", fontSize: "1.7rem" }}
        >
          <h2>You need to be logged in to access this page</h2>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#b74a4a73",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "25px",
            }}
          >
            Go to Login
          </button>
        </div>
        <FloatingNavbar />
      </div>
    );
  }

  return (
    <div className="parent">
      <img className="bgimg" src={bg} alt="Background" />
      <div className="profile-page">
        <div className="profile-header">
          <img className="avatar" alt="User Avatar" src={logoimg} />
          <div className="user-info">
            {isEditing ? (
            <>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="username-input"
                />
                
    <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
                <button className="save-btn" onClick={handleSaveUsername}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                </div>
              </>
            ) : (
              <>
                <h2>{user.name || "Unnamed User"}</h2>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                {user.createdAt && (
                  <p>
                    <strong>Joined On: </strong>{joinedDate}
                  </p>
                )}
              </>
            )}
          </div>

          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit User Name
            </button>
          )}
        </div>

        {message && <p className="status-message">{message}</p>}

        <div className="dashboard">
          <h3 className="wlcmmsg">
            Welcome back, {user.name?.split(" ")[0] || "Friend"}!
          </h3>
          <div className="stats">
            <p>
              📝 You’ve journaled <strong>{journals.length}</strong> Times
            </p>
            <p>
              📅 You have journaled for <strong>{totalJournalDays}</strong> days
            </p>
            <p>
              😊 This week’s overall mood: <strong>Positive</strong>
            </p>
            <p>
              🔥 Mood streak: <strong>{currentStreak}</strong>
            </p>
            <p className="quote">
              "You are your best friend. Treat yourself with love."
            </p>
            <button
              className="start-writing-btn"
              onClick={() => navigate("/journal")}
            >
              Start Writing
            </button>
          </div>
        </div>

        <div className="journal-section">
          <h3>Your Journal Entries</h3>
          {journals.length > 0 ? (
            journals.map((journal) => (
              <div
                key={journal._id}
                className="journal-entry"
                onClick={() => setSelectedJournal(journal)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <img
                  src={dlt}
                  alt="Delete"
                  className="dlticon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEntry(journal._id);
                  }}
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    cursor: "pointer",
                  }}
                />
                <div className="journal-header">
                  <h4 className="journal-title">{journal.title}</h4>
                </div>
                <p className="prodate">
                  {journal.date
                    ? new Date(journal.date).toLocaleDateString()
                    : journal.createdAt
                    ? new Date(journal.createdAt).toLocaleDateString()
                    : "No date"}
                </p>
              </div>
            ))
          ) : (
            <p className="nojournal">No journal entries found.</p>
          )}
        </div>

        {selectedJournal && (
          <div
            className="profilemodal-overlay"
            onClick={() => setSelectedJournal(null)}
          >
            <div
              className="profilemodal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="journal-details" style={{ position: "relative" }}>
                <button
                  className="close-btn"
                  onClick={() => setSelectedJournal(null)}
                >
                  X
                </button>
                <div className="title">
                  <h2>{selectedJournal.title} </h2>
                  {selectedJournal.mood && (
                    <span
                      className="mood-emoji"
                      title={getMoodName(selectedJournal.mood)}
                      style={{
                        fontSize: "2.4rem",
                        cursor: "default",
                        userSelect: "none",
                        lineHeight: 1,
                      }}
                    >
                      {getEmoji(selectedJournal.mood)}
                    </span>
                  )}
                </div>
                <p className="date">
                  {new Date(selectedJournal.createdAt).toLocaleString()}
                </p>
                <div className="entry-content">
                  <p>{selectedJournal.content}</p>
                </div>
                <div className="ai-response">
                  <h3 style={{ color: "black" }}>Your Analysis</h3>
                  <p>{selectedJournal.analysis}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <FloatingNavbar />
    </div>
  );
};

export default ProfilePage;
