import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
 startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  subWeeks, isWithinInterval 
} from 'date-fns';
import "../css/reflection.css";
import FloatingNavbar from './floatingnavbar';

const ReflectionPage = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('thisWeek');
  const [analysis, setAnalysis] = useState({});
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
    } else { 
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    }

       return journals.filter((journal) => {
      let journalDate = journal.createdAt
        ? new Date(journal.createdAt)
        : journal.date
        ? new Date(journal.date)
        : null;

      if (!journalDate && journal._id && journal._id.toString().length > 10) {
        const timestamp =
          parseInt(journal._id.toString().substring(0, 8), 16) * 1000;
        journalDate = new Date(timestamp);
      }

      if (!journalDate || isNaN(journalDate.getTime())) return false;

      return isWithinInterval(journalDate, { start: startDate, end: endDate });
    });
  }, [journals, timeRange]);

  // Analyze journal entries for personality insights
  useEffect(() => {
    if (filteredJournals.length === 0) {
      setAnalysis({
        emotionalInRelationships: { level: 'Unknown', score: 0, details: 'Not enough data to analyze' },
        workDedication: { level: 'Unknown', score: 0, details: 'Not enough data to analyze' },
        mentalHealth: { level: 'Unknown', score: 0, details: 'Not enough data to analyze' },
        recommendations: []
      });
      return;
    }

    // Initialize scores
    let relationshipScore = 0;
    let workScore = 0;
    let mentalHealthScore = 0;
    
    // Keywords for analysis
    const relationshipKeywords = {
      positive: ['love', 'happy', 'support', 'care', 'understanding', 'together', 'appreciate', 'connection'],
      negative: ['fight', 'argue', 'misunderstanding', 'alone', 'breakup', 'hurt', 'disappointed', 'neglected']
    };
    
    const workKeywords = {
      positive: ['achieve', 'success', 'productive', 'focused', 'goal', 'accomplish', 'motivated', 'dedicated'],
      negative: ['stress', 'overwhelm', 'burnout', 'deadline', 'pressure', 'exhausted', 'frustrated', 'failure']
    };
    
    const mentalHealthKeywords = {
      positive: ['calm', 'peace', 'relax', 'joy', 'content', 'hopeful', 'optimistic', 'grateful'],
      negative: ['anxious', 'depressed', 'sad', 'worried', 'fear', 'panic', 'lonely', 'hopeless']
    };

    // Analyze each journal entry
    filteredJournals.forEach(journal => {
      const content = (journal.content || '').toLowerCase();
      const analysis = (journal.analysis || '').toLowerCase();
      const mood = (journal.mood?.label || '').toLowerCase();
      const sentiment = (journal.sentiment?.label || '').toLowerCase();
      
      // Relationship analysis
      relationshipKeywords.positive.forEach(keyword => {
        if (content.includes(keyword) || analysis.includes(keyword)) {
          relationshipScore += 1;
        }
      });
      
      relationshipKeywords.negative.forEach(keyword => {
        if (content.includes(keyword) || analysis.includes(keyword)) {
          relationshipScore -= 1;
        }
      });
      
      // Work dedication analysis
      workKeywords.positive.forEach(keyword => {
        if (content.includes(keyword) || analysis.includes(keyword)) {
          workScore += 1;
        }
      });
      
      workKeywords.negative.forEach(keyword => {
        if (content.includes(keyword) || analysis.includes(keyword)) {
          workScore -= 1;
        }
      });
      
      // Mental health analysis
      mentalHealthKeywords.positive.forEach(keyword => {
        if (content.includes(keyword) || analysis.includes(keyword)) {
          mentalHealthScore += 1;
        }
      });
      
      mentalHealthKeywords.negative.forEach(keyword => {
        if (content.includes(keyword) || analysis.includes(keyword)) {
          mentalHealthScore -= 1;
        }
      });
      
      // Factor in mood and sentiment
      if (['happy', 'joy', 'excited', 'content'].includes(mood) || sentiment === 'positive') {
        relationshipScore += 0.5;
        workScore += 0.5;
        mentalHealthScore += 1;
      } else if (['sad', 'angry', 'anxious', 'fear'].includes(mood) || sentiment === 'negative') {
        relationshipScore -= 0.5;
        workScore -= 0.5;
        mentalHealthScore -= 1;
      }
    });

    // Normalize scores
    const maxScore = filteredJournals.length * 2;
    relationshipScore = (relationshipScore / maxScore) * 100;
    workScore = (workScore / maxScore) * 100;
    mentalHealthScore = (mentalHealthScore / maxScore) * 100;

    // Determine levels and details
    const getLevelAndDetails = (score, type) => {
      if (score >= 60) {
        if (type === 'relationship') {
          return {
            level: 'Very Emotional',
            score: score.toFixed(1),
            details: 'You show strong emotional investment in your relationships. You deeply value connections and express your feelings openly.',
            recommendations: [
              'Continue to nurture your relationships with open communication',
              'Remember to maintain healthy boundaries',
              'Consider expressing appreciation to loved ones regularly'
            ]
          };
        } else if (type === 'work') {
          return {
            level: 'Highly Dedicated',
            score: score.toFixed(1),
            details: 'You demonstrate strong commitment to your work and goals. You are motivated and focused on achieving success.',
            recommendations: [
              'Maintain your work-life balance to prevent burnout',
              'Set realistic goals and celebrate your achievements',
              'Consider sharing your knowledge with colleagues'
            ]
          };
        } else {
          return {
            level: 'Positive Mental State',
            score: score.toFixed(1),
            details: 'You generally maintain a positive outlook and good mental health. You have effective coping mechanisms.',
            recommendations: [
              'Continue practices that support your mental well-being',
              'Consider helping others who might be struggling',
              'Maintain your self-care routine'
            ]
          };
        }
      } else if (score >= 20) {
        if (type === 'relationship') {
          return {
            level: 'Moderately Emotional',
            score: score.toFixed(1),
            details: 'You have a balanced approach to relationships. You care about others but also maintain your independence.',
            recommendations: [
              'Continue to invest time in meaningful relationships',
              'Practice active listening to strengthen connections',
              'Consider sharing your feelings more openly'
            ]
          };
        } else if (type === 'work') {
          return {
            level: 'Moderately Dedicated',
            score: score.toFixed(1),
            details: 'You have a healthy approach to work with a good balance between dedication and personal life.',
            recommendations: [
              'Continue to set clear boundaries between work and personal time',
              'Focus on tasks that align with your values and goals',
              'Take regular breaks to maintain productivity'
            ]
          };
        } else {
          return {
            level: 'Stable Mental State',
            score: score.toFixed(1),
            details: 'You have a generally stable mental state with occasional fluctuations that are normal.',
            recommendations: [
              'Continue with your current self-care practices',
              'Be mindful of stress levels and take action when needed',
              'Consider journaling regularly to track your mood patterns'
            ]
          };
        }
      } else {
        if (type === 'relationship') {
          return {
            level: 'Reserved in Relationships',
            score: score.toFixed(1),
            details: 'You tend to be more reserved in your relationships. You may struggle with emotional expression or vulnerability.',
            recommendations: [
              'Try to open up more to trusted friends or family',
              'Consider relationship counseling or communication workshops',
              'Practice expressing your feelings in safe environments'
            ]
          };
        } else if (type === 'work') {
          return {
            level: 'Low Work Engagement',
            score: score.toFixed(1),
            details: 'You may be experiencing low motivation or disengagement from your work. This could indicate burnout or misalignment with your goals.',
            recommendations: [
              'Reflect on whether your current work aligns with your values',
              'Consider taking a break to recharge and reassess',
              'Speak with a mentor or supervisor about your concerns'
            ]
          };
        } else {
          return {
            level: 'Potential Mental Health Concerns',
            score: score.toFixed(1),
            details: 'Your entries suggest possible mental health challenges. You may be experiencing stress, anxiety, or low mood.',
            recommendations: [
              'Consider speaking with a mental health professional',
              'Reach out to trusted friends or family for support',
              'Practice self-care activities like exercise, meditation, or hobbies',
              'If experiencing severe symptoms, seek immediate professional help'
            ]
          };
        }
      }
    };

    const relationshipAnalysis = getLevelAndDetails(relationshipScore, 'relationship');
    const workAnalysis = getLevelAndDetails(workScore, 'work');
    const mentalHealthAnalysis = getLevelAndDetails(mentalHealthScore, 'mental');

    // Combine all recommendations
    const allRecommendations = [
      ...relationshipAnalysis.recommendations,
      ...workAnalysis.recommendations,
      ...mentalHealthAnalysis.recommendations
    ];

    // Remove duplicates
    const uniqueRecommendations = [...new Set(allRecommendations)];

    setAnalysis({
      emotionalInRelationships: relationshipAnalysis,
      workDedication: workAnalysis,
      mentalHealth: mentalHealthAnalysis,
      recommendations: uniqueRecommendations
    });
  }, [filteredJournals]);

  if (loading) return <div className="loading">Loading Reflection Analysis...</div>;

  return (
    <div className="reflection-page">
      <div className="reflection-header">
        <h1>Personal Reflection Analysis</h1>
        <p>Insights based on your journal entries</p>
      </div>
      
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
      
      {filteredJournals.length === 0 ? (
        <div className="no-data">
          <h3>No journal entries for this period</h3>
          <p>Write some journal entries to get personalized insights and recommendations.</p>
        </div>
      ) : (
        <>
          <div className="analysis-container">
            <div className="analysis-card">
              <h3>Emotional Investment in Relationships</h3>
              <div className="score-container">
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${analysis.emotionalInRelationships.score}%` }}
                  ></div>
                </div>
                <span className="score-value">{analysis.emotionalInRelationships.score}/100</span>
              </div>
              <div className="analysis-level">{analysis.emotionalInRelationships.level}</div>
              <p className="analysis-details">{analysis.emotionalInRelationships.details}</p>
            </div>
            
            <div className="analysis-card">
              <h3>Work Dedication & Engagement</h3>
              <div className="score-container">
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${analysis.workDedication.score}%` }}
                  ></div>
                </div>
                <span className="score-value">{analysis.workDedication.score}/100</span>
              </div>
              <div className="analysis-level">{analysis.workDedication.level}</div>
              <p className="analysis-details">{analysis.workDedication.details}</p>
            </div>
            
            <div className="analysis-card">
              <h3>Mental Health & Well-being</h3>
              <div className="score-container">
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${analysis.mentalHealth.score}%` }}
                  ></div>
                </div>
                <span className="score-value">{analysis.mentalHealth.score}/100</span>
              </div>
              <div className="analysis-level">{analysis.mentalHealth.level}</div>
              <p className="analysis-details">{analysis.mentalHealth.details}</p>
            </div>
          </div>
          
          <div className="recommendations-container">
            <h2>Personalized Recommendations</h2>
            <div className="recommendations-list">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="recommendation-item">
                  <div className="recommendation-number">{index + 1}</div>
                  <p>{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="insights-summary">
            <h2>Summary Insights</h2>
            <div className="insights-content">
              <p>
                Based on your journal entries from {timeRange === 'thisWeek' ? 'this week' : timeRange === 'lastWeek' ? 'last week' : 'this month'}, 
                you show {analysis.emotionalInRelationships.level.toLowerCase()} in relationships, 
                {analysis.workDedication.level.toLowerCase()} in your work, and 
                {analysis.mentalHealth.level.toLowerCase()} in your mental health.
              </p>
              <p>
                {analysis.mentalHealth.score < 30 ? 
                  'Your entries suggest you may be going through a challenging time. Consider implementing the recommendations above and seeking support if needed.' :
                  analysis.mentalHealth.score < 60 ?
                  'You appear to have a balanced emotional state with room for improvement in some areas.' :
                  'You demonstrate good emotional health and coping mechanisms. Continue with your current practices.'
                }
              </p>
            </div>
          </div>
        </>
      )}
      <FloatingNavbar />
    </div>
  );
};

export default ReflectionPage;
