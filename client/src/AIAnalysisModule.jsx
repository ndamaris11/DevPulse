import React, { useState } from 'react';
import axios from 'axios';

const AIAnalysisModule = ({ project, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAIAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token'); 
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      // 🚨 FIXED: Explicitly maps to port 5000 so axios doesn't throw a local cross-origin crash
      const response = await axios.post(`http://localhost:5000/api/projects/${project._id}/analyze`, {}, config);
      
      onUpdate(response.data); 
    } catch (err) {
      console.error("Analysis request failed:", err);
      setError('Failed to process AI analysis metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h3 style={styles.title}>🤖 DevPulse AI Viability Engine</h3>
          <p style={styles.subtitle}>Analyze tech stack efficiency and real-world market trends</p>
        </div>
        
        <button
          onClick={handleAIAnalysis}
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? '#b19ffb' : '#0866ff',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <div style={styles.spinnerRow}>
              <div style={styles.spinner}></div>
              <span>Analyzing Stack...</span>
            </div>
          ) : 'Run AI Market Analysis'}
        </button>
      </div>

      {error && <p style={styles.errorText}>{error}</p>}

      {project.aiAnalysis ? (
        <div style={styles.resultsWrapper}>
          <div style={styles.scoreBanner}>
            <div style={styles.scoreBadge}>
              {project.aiAnalysis.score}%
            </div>
            <div>
              <h4 style={styles.scoreTitle}>Project Viability Score</h4>
              <p style={styles.scoreDesc}>
                {project.aiAnalysis.score > 85 
                  ? 'Exceptional production readiness and highly disruptive tech footprint.' 
                  : 'Strong foundational stack alignment with realistic deployment utility.'}
              </p>
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.gridCard}>
              <span style={styles.cardLabel}>📈 Current Market Trends</span>
              <p style={styles.cardText}>{project.aiAnalysis.marketTrends}</p>
            </div>
            <div style={styles.gridCard}>
              <span style={styles.cardLabel}>🎯 Target Demographics</span>
              <p style={styles.cardText}>{project.aiAnalysis.targetAudience}</p>
            </div>
            <div style={styles.gridCard}>
              <span style={styles.cardLabel}>⚠️ Strategic Obstacles</span>
              <p style={styles.cardText}>{project.aiAnalysis.roadblocks}</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p style={styles.emptyStateText}>No market data compiled yet. Trigger the AI engine above for a full tech stack analysis report.</p>
        </div>
      )}
    </div>
  );
};

// 🎨 FIXED: Re-aligned all broken styles, layout structures, and spelling typos
const styles = {
  container: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e4e6eb', marginTop: '15px', fontFamily: 'Segoe UI, sans-serif' },
  headerRow: { display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between', flexWrap: 'wrap' },
  title: { margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1c1e21' },
  subtitle: { margin: '4px 0 0 0', fontSize: '12px', color: '#65676b' },
  button: { border: 'none', color: '#ffffff', fontSize: '13px', fontWeight: '600', padding: '8px 14px', borderRadius: '6px', transition: 'background-color 0.2s' },
  spinnerRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  spinner: { width: '14px', height: '14px', border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' },
  errorText: { color: '#e41e3f', fontSize: '13px', marginTop: '12px', fontWeight: '500' },
  resultsWrapper: { marginTop: '15px' },
  scoreBanner: { display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#e7f3ff', padding: '14px', borderRadius: '8px', border: '1px solid #bce0ff' },
  scoreBadge: { width: '48px', height: '48px', backgroundColor: '#0866ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '800', fontSize: '16px' },
  scoreTitle: { margin: 0, fontWeight: 'bold', color: '#0044b3', fontSize: '13px' },
  scoreDesc: { margin: '2px 0 0 0', fontSize: '12px', color: '#052d6e', lineHeight: '1.4' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' },
  gridCard: { padding: '12px', borderRadius: '8px', border: '1px solid #f0f2f5', backgroundColor: '#f9fafb' },
  cardLabel: { fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', color: '#8c939d', letterSpacing: '0.05em' },
  cardText: { fontSize: '12px', fontWeight: '500', color: '#4b5563', marginTop: '6px', lineHeight: '1.5', margin: '6px 0 0 0' },
  emptyState: { textAlign: 'center', padding: '20px 10px', border: '1px dashed #ced4da', borderRadius: '8px', backgroundColor: '#fafafa', marginTop: '12px' },
  emptyStateText: { margin: 0, fontSize: '12px', color: '#65676b', fontWeight: '500' }
};

// Injection for runtime spinning loader animation
try {
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule('@keyframes spin { to { transform: rotate(360deg); } }', styleSheet.cssRules.length);
} catch (e) {}

export default AIAnalysisModule;