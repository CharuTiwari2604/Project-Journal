import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  subWeeks, isWithinInterval, eachDayOfInterval, eachWeekOfInterval
} from 'date-fns';
import "../css/trends.css";
import FloatingNavbar from "./floatingnavbar";

const MoodTracker = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('thisWeek');
  const [chartType, setChartType] = useState('bar');
  const navigate = useNavigate();

  // Fetch journal data with multiple URL attempts
  useEffect(() => {
    const fetchJournalData = async () => {
    try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/journal/profile",
          { withCredentials: true }
        );
        
        if (response.data) {
          let journalsData = [];
          if (Array.isArray(response.data.journals)) {
            journalsData = response.data.journals;
          } else if (Array.isArray(response.data)) {
            journalsData = response.data;
          } else if (
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            journalsData = response.data.data;
          }

          setJournals(journalsData);
        }
             } catch (error) {
        console.error("Failed to fetch journal data:", error.message);
        if (error?.response?.status === 401) {
          alert("Session expired. Redirecting to login.");
          navigate("/login");
        } else {
          alert("Failed to fetch journal data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJournalData();
  }, [navigate]);
      
     
  // Get unique emotion labels
   const emotionLabels = useMemo(() => {
    const labels = new Set();
    journals.forEach(journal => {
      if (journal.mood?.label) {
        labels.add(journal.mood.label);
      } else if (journal.sentiment?.label) {
        labels.add(journal.sentiment.label);
      } else if (journal.emotion) {
        labels.add(journal.emotion);
      }
    });
    return Array.from(labels);
  }, [journals]);

  // Generate colors for emotions
  const emotionColors = useMemo(() => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF6B6B', '#4ECDC4'];
    return emotionLabels.reduce((acc, emotion, i) => {
      acc[emotion] = colors[i % colors.length];
      return acc;
    }, {});
  }, [emotionLabels]);

  // Filter journals by time range
  const filteredJournals = useMemo(() => {
    const now = new Date();
    let startDate, endDate;
    if (timeRange === 'thisWeek') {
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      endDate = endOfWeek(now, { weekStartsOn: 1 });
    } else if (timeRange === 'lastWeek') {
      startDate = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
      endDate = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    } else { // thisMonth
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    }
    return journals.filter(journal => {
      // Try multiple date fields
      let journalDate;
      if (journal.createdAt) {
        journalDate = new Date(journal.createdAt);
      } else if (journal.date) {
        journalDate = new Date(journal.date);
      } else if (journal._id && journal._id.toString().length > 10) {
        // Try to extract date from ObjectId (first 8 hex digits = 4 bytes timestamp)
        const timestamp = parseInt(journal._id.toString().substring(0, 8), 16) * 1000;
        journalDate = new Date(timestamp);
      } else {
        return false;
      }
      
      if (isNaN(journalDate.getTime())) return false;
      
      return isWithinInterval(journalDate, { start: startDate, end: endDate });
    });
  }, [journals, timeRange]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const now = new Date();
    let startDate, endDate;
    
    if (timeRange === 'thisWeek') {
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      endDate = endOfWeek(now, { weekStartsOn: 1 });
    } else if (timeRange === 'lastWeek') {
      startDate = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
      endDate = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    } else { // thisMonth
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    }
    
    // For monthly view, aggregate by week
    if (timeRange === 'thisMonth') {
      const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });
      
      // Initialize data structure for each week
      const data = weeks.map((week, index) => {
        const weekData = { 
          week: `Week ${index + 1}`,
          startDate: format(week, 'MMM dd'),
          endDate: format(endOfWeek(week, { weekStartsOn: 1 }), 'MMM dd')
        };
        emotionLabels.forEach(emotion => {
          weekData[emotion] = 0;
        });
        return weekData;
      });
      
      // Count emotions for each week
      filteredJournals.forEach(journal => {
        let journalDate;
        if (journal.createdAt) {
          journalDate = new Date(journal.createdAt);
        } else if (journal.date) {
          journalDate = new Date(journal.date);
        } else if (journal._id) {
          const timestamp = parseInt(journal._id.toString().substring(0, 8), 16) * 1000;
          journalDate = new Date(timestamp);
        } else {
          return;
        }
        
        // Find which week this journal belongs to
        const weekIndex = weeks.findIndex(week => 
          isWithinInterval(journalDate, { 
            start: week, 
            end: endOfWeek(week, { weekStartsOn: 1 }) 
          })
        );
        
        if (weekIndex !== -1) {
          // Try multiple paths for emotion data
          let emotion = null;
          if (journal.mood?.label) {
            emotion = journal.mood.label;
          } else if (journal.sentiment?.label) {
            emotion = journal.sentiment.label;
          } else if (journal.emotion) {
            emotion = journal.emotion;
          }
          
          if (emotion && emotionLabels.includes(emotion)) {
            data[weekIndex][emotion] += 1;
          }
        }
      });
      
      return data;
    } else {
      // For weekly views, use daily data
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      
      // Initialize data structure for each day
      const data = days.map(day => {
        const dayData = { 
          date: format(day, 'MMM dd'),
          day: format(day, 'EEE'), // Add day of the week
          fullDate: format(day, 'yyyy-MM-dd')
        };
        emotionLabels.forEach(emotion => {
          dayData[emotion] = 0;
        });
        return dayData;
      });
      
      // Count emotions for each day
      filteredJournals.forEach(journal => {
        let journalDate;
        if (journal.createdAt) {
          journalDate = new Date(journal.createdAt);
        } else if (journal.date) {
          journalDate = new Date(journal.date);
        } else if (journal._id) {
          const timestamp = parseInt(journal._id.toString().substring(0, 8), 16) * 1000;
          journalDate = new Date(timestamp);
        } else {
          return;
        }
        
        const dateStr = format(journalDate, 'yyyy-MM-dd');
        
        const dayIndex = data.findIndex(d => d.fullDate === dateStr);
        
        if (dayIndex !== -1) {
          // Try multiple paths for emotion data
          let emotion = null;
          if (journal.mood?.label) {
            emotion = journal.mood.label;
          } else if (journal.sentiment?.label) {
            emotion = journal.sentiment.label;
          } else if (journal.emotion) {
            emotion = journal.emotion;
          }
          
          if (emotion && emotionLabels.includes(emotion)) {
            data[dayIndex][emotion] += 1;
          }
        }
      });
      
      return data;
    }
  }, [filteredJournals, emotionLabels, timeRange]);

  // Helper function to extract sentiment score from journal entry
  const getSentimentScore = (journal) => {
    // First, check if we have a mood label and use it to infer sentiment
    if (journal.mood?.label) {
      const moodLabel = journal.mood.label.toLowerCase();
      console.log(`Using mood label for sentiment: ${moodLabel}`);
      
      // Positive moods
      if (['happy', 'joy', 'excited', 'content', 'pleased', 'delighted'].includes(moodLabel)) {
        return 0.8;
      }
      
      // Negative moods
      if (['angry', 'sad', 'fear', 'anxious', 'frustrated', 'upset', 'disappointed'].includes(moodLabel)) {
        return -0.8;
      }
      
      // Neutral moods
      if (['neutral', 'calm', 'okay', 'fine'].includes(moodLabel)) {
        return 0;
      }
    }
    
    // If no mood label or it's not recognized, try sentiment score
    let sentimentScore = null;
    
    // Try sentiment.score
    if (journal.sentiment?.score !== undefined) {
      sentimentScore = parseFloat(journal.sentiment.score);
      console.log(`Found sentiment.score: ${sentimentScore}`);
      
      // Only use the sentiment score if it's not zero
      if (sentimentScore !== 0 && !isNaN(sentimentScore)) {
        return sentimentScore;
      }
    }
    
    // If sentiment score is 0 or invalid, try sentiment label
    if (journal.sentiment?.label) {
      const label = journal.sentiment.label.toLowerCase();
      console.log(`Using sentiment label for sentiment: ${label}`);
      
      if (label === 'positive') return 0.7;
      if (label === 'negative') return -0.7;
      return 0; // neutral
    }
    
    // If no sentiment data is found, return null
    console.log('No sentiment data found');
    return null;
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const emotionCounts = {};
    let totalSentiment = 0;
    let validSentiments = 0;
    
    filteredJournals.forEach(journal => {
      // Try multiple paths for emotion data
      let emotion = null;
      if (journal.mood?.label) {
        emotion = journal.mood.label;
      } else if (journal.sentiment?.label) {
        emotion = journal.sentiment.label;
      } else if (journal.emotion) {
        emotion = journal.emotion;
      }
      
      emotion = emotion || 'Unknown';
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      
      // Get sentiment score using our helper function
      const sentimentScore = getSentimentScore(journal);
      if (sentimentScore !== null && !isNaN(sentimentScore)) {
        totalSentiment += sentimentScore;
        validSentiments += 1;
        console.log(`Added sentiment score: ${sentimentScore}, total: ${totalSentiment}, count: ${validSentiments}`);
      }
    });
    
    const avgSentiment = validSentiments > 0 ? totalSentiment / validSentiments : 0;
    console.log(`Final average sentiment: ${avgSentiment} from ${validSentiments} entries`);
    
    // Determine sentiment label and color
    let sentimentLabel, sentimentColor;
    if (avgSentiment >= 0.3) {
      sentimentLabel = "Positive";
      sentimentColor = "#4CAF50"; // Green
    } else if (avgSentiment <= -0.3) {
      sentimentLabel = "Negative";
      sentimentColor = "#F44336"; // Red
    } else {
      sentimentLabel = "Neutral";
      sentimentColor = "#9E9E9E"; // Gray
    }
    
    const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) => 
      emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b
    , ['Unknown', 0])[0];
    
    return {
      totalEntries: filteredJournals.length,
      avgSentiment: avgSentiment.toFixed(2),
      sentimentLabel,
      sentimentColor,
      dominantEmotion,
      emotionCounts,
      validSentiments // For debugging
    };
  }, [filteredJournals]);

  // Prepare pie chart data
  const pieData = useMemo(() => {
    return emotionLabels.map(emotion => ({
      name: emotion,
      value: summaryStats.emotionCounts[emotion] || 0
    })).filter(item => item.value > 0);
  }, [emotionLabels, summaryStats.emotionCounts]);

  // Custom tooltip to show day of the week
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render chart based on selected type
  const renderChart = () => {
    if (chartData.length === 0 || filteredJournals.length === 0) {
      return <div className="no-data">No journal entries for this period</div>;
    }
    
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={timeRange === 'thisMonth' ? "week" : "date"} 
                tickFormatter={(value) => {
                  if (timeRange === 'thisMonth') {
                    return value;
                  }
                  // For daily view, append day of week
                  const dayData = chartData.find(d => d.date === value);
                  return dayData ? `${value} (${dayData.day})` : value;
                }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {emotionLabels.map(emotion => (
                <Line 
                  key={emotion} 
                  type="monotone" 
                  dataKey={emotion} 
                  stroke={emotionColors[emotion]} 
                  activeDot={{ r: 8 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={emotionColors[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default: // bar chart
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={timeRange === 'thisMonth' ? "week" : "date"} 
                tickFormatter={(value) => {
                  if (timeRange === 'thisMonth') {
                    return value;
                  }
                  // For daily view, append day of week
                  const dayData = chartData.find(d => d.date === value);
                  return dayData ? `${value} (${dayData.day})` : value;
                }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {emotionLabels.map(emotion => (
                <Bar key={emotion} dataKey={emotion} fill={emotionColors[emotion]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  if (loading) return <div className="loading">Loading Charts...</div>;

  return (
    <div className="chart-page">
      <div className="chart-header">
        <h1>Emotion Analysis Dashboard</h1>
        <p>Visualize your emotional patterns based on journal entries</p>
      </div>
      
      <div className="chart-controls">
        <div className="time-range-selector">
          <button 
            className={timeRange === 'thisWeek' ? 'active' : ''} 
            onClick={() => setTimeRange('thisWeek')}
          >
            This Week
          </button>
          <button 
            className={timeRange === 'lastWeek' ? 'active' : ''} 
            onClick={() => setTimeRange('lastWeek')}
          >
            Last Week
          </button>
          <button 
            className={timeRange === 'thisMonth' ? 'active' : ''} 
            onClick={() => setTimeRange('thisMonth')}
          >
            This Month
          </button>
        </div>
        
        <div className="chart-type-selector">
          <button 
            className={chartType === 'bar' ? 'active' : ''} 
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </button>
          <button 
            className={chartType === 'line' ? 'active' : ''} 
            onClick={() => setChartType('line')}
          >
            Line Chart
          </button>
          <button 
            className={chartType === 'pie' ? 'active' : ''} 
            onClick={() => setChartType('pie')}
          >
            Pie Chart
          </button>
        </div>
      </div>
      
      <div className="summary-stats">
        <div className="stat-card">
          <h3>Total Entries</h3>
          <p>{summaryStats.totalEntries}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Sentiment</h3>
          <p style={{ color: summaryStats.sentimentColor }}>
            {summaryStats.avgSentiment} ({summaryStats.sentimentLabel})
          </p>
          {/* Debug info - remove in production */}
          <small style={{ fontSize: '0.7em', color: '#666' }}>
            Based on {summaryStats.validSentiments} entries
          </small>
        </div>
        <div className="stat-card">
          <h3>Dominant Mood</h3>
          <p style={{ color: emotionColors[summaryStats.dominantEmotion] || '#000000' }}>
            {summaryStats.dominantEmotion}
          </p>
        </div>
      </div>
      
      <div className="chart-container">
        {renderChart()}
      </div>
      
      {/* Fixed emotion legend section */}
      <div className="emotion-legend">
        <h3>Emotion Legend</h3>
        <div className="legend-items">
          {emotionLabels.map((emotion) => (
            <div key={emotion} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: emotionColors[emotion] }}
              ></div>
              <span>{emotion}</span>
            </div>
          ))}
        </div>
      </div>
      <FloatingNavbar />
    </div>
  );
};

export default MoodTracker;