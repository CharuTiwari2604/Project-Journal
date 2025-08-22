import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "../css/calendarPage.css";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import FloatingNavbar from "./floatingnavbar";

export default function CalendarPage() {
  const [journals, setJournals] = useState([]);
  const [journalMap, setJournalMap] = useState(new Map());
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [streakData, setStreakData] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [authFailed, setAuthFailed] = useState(false);

  const navigate = useNavigate();

  // Fetch profile and journals
  useEffect(() => {
    let ignore = false;
    setLoading(true);

    axios
      .get("/journal/profile", { withCredentials: true })
      .then((res) => {
        if (ignore) return;
        const items = res.data?.journals || [];
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
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          setAuthFailed(true); // not logged in
        }
      })
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, []);

  // Compute streak only if logged in
  useEffect(() => {
    if (loading || authFailed) return;

    const today = new Date();
    const streakDays = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateKey = format(date, "yyyy-MM-dd");
      const hasJournal = journalMap.has(dateKey);
      streakDays.push({
        date: dateKey,
        journaled: hasJournal,
      });
    }

    let tempStreak = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateKey = format(date, "yyyy-MM-dd");
      if (journalMap.has(dateKey)) {
        tempStreak++;
      } else {
        break;
      }
    }

    setStreakData(streakDays);
    setCurrentStreak(tempStreak);
  }, [journalMap, loading, authFailed]);

  const handleDateClick = (day) => {
    if (authFailed) return; // disabled for logged out users

    if (!(day instanceof Date) || isNaN(day.getTime())) return;
    const key = format(day, "yyyy-MM-dd");
    const entries = journalMap.get(key);
    setSelectedDate(day);

    if (entries && entries.length > 0) {
      setSelectedJournal(entries[0]);
    } else {
      setSelectedJournal({ message: "No journals for this day" });
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayIndex = firstDay.getDay();
    const endDayIndex = lastDay.getDay();

    const days = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      days.push(
        <div key={`prev-${day}`} className="calendar-day other-month">
          {day}
        </div>
      );
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateKey = format(date, "yyyy-MM-dd");
      const entry = journalMap.get(dateKey)?.[0];

      days.push(
        <div
          key={`day-${day}`}
          className={`calendar-day ${entry && !authFailed ? "has-entry" : ""}`}
          onClick={() => handleDateClick(date)}
        >
          {!authFailed && entry && (
            <div className="mood-emoji-background">
              {typeof entry.mood === "string"
                ? entry.mood.split(" ")[0]
                : entry.mood?.emoji || "📝"}
            </div>
          )}
          <span className="day-number">{day}</span>
        </div>
      );
    }

    for (let i = 1; i <= 6 - endDayIndex; i++) {
      days.push(
        <div key={`next-${i}`} className="calendar-day other-month">
          {i}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (loading) return <div className="cal__loading">Loading Calendar...</div>;

  return (
    <div className="cal__wrap">
      <header className="cal__header">
        <h2>Mood Calendar</h2>
        <p className="cal__subtitle">
          {authFailed
            ? "Log in to track your moods and journals. For now, you can still explore the calendar."
            : "Your mood emoji shows on dates you journaled. Click a date to view your entry."}
        </p>
      </header>

      {/* Calendar Section */}
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={goToPreviousMonth} className="nav-button">
            &lt;
          </button>
          <h2>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button onClick={goToNextMonth} className="nav-button">
            &gt;
          </button>
        </div>

        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>

      {/* Streak Section */}
      <div className="cal__header" style={{ marginTop: "3rem" }}>
        <h2>Streak</h2>
      </div>

      <div className="streak-container">
        <div className="streak-header">
          <h2>Your Journaling Streak</h2>
          <div className="current-streak">
            <span className="streak-number">
              {authFailed ? 0 : currentStreak}
            </span>
            <span> day{currentStreak !== 1 ? "s" : ""} 🔥</span>
          </div>
        </div>

        <div className="streak-days">
          {streakData.length > 0 && !authFailed ? (
            streakData.map((day, index) => (
              <div
                key={index}
                className={`day-item ${day.journaled ? "active" : "inactive"}`}
              >
                <div className="emoji">{day.journaled ? "🔥" : "❄️"}</div>
                <div className="date-label">
                  {format(new Date(day.date), "EEE")}
                </div>
              </div>
            ))
          ) : (
            <p className="nologin-msg">
              Log in to start your streak and see your progress 🔥
            </p>
          )}
        </div>
      </div>

      {/* Journal modal (only logged in) */}
      {!authFailed && selectedJournal && (
        <div
          className="calmodal-overlay"
          onClick={() => setSelectedJournal(null)}
        >
          <div
            className="calmodal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="caljournal-details">
              <button
                className="calclose-btn"
                onClick={() => setSelectedJournal(null)}
              >
                X
              </button>

              {selectedJournal.message ? (
                <p>{selectedJournal.message}</p>
              ) : (
                <>
                  <div className="caltitle">
                    <h2>{selectedJournal.title || "Untitled"}</h2>
                    {selectedJournal.mood && (
                      <span className="mood-emoji">
                        {typeof selectedJournal.mood === "string"
                          ? selectedJournal.mood.split(" ")[0]
                          : selectedJournal.mood?.emoji || "📝"}
                      </span>
                    )}
                  </div>

                  <p className="date">
                    {new Date(
                      selectedJournal.date || selectedJournal.createdAt
                    ).toLocaleString()}
                  </p>

                  <div className="calentry-content">
                    <p>
                      {selectedJournal.content ??
                        selectedJournal.text ??
                        selectedJournal.entry}
                    </p>
                  </div>

                  {selectedJournal.analysis && (
                    <div className="ai-response">
                      <h3>Your Analysis</h3>
                      <p>{selectedJournal.analysis}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <FloatingNavbar />
    </div>
  );
}
