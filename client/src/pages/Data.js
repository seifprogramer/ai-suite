import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Data.css';

function Data({ token, user, onLogout }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeData = async (e) => {
    e.preventDefault();
    if (!file || !query.trim()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', query);

    try {
      const { data } = await axios.post('/api/data/analyze', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setResults(data);
    } catch (error) {
      alert('Error analyzing data: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-container">
      <div className="data-header">
        <div>
          <button onClick={() => navigate('/')} className="back-btn">← Back</button>
          <h2>📊 Data Analysis</h2>
        </div>
        <button onClick={onLogout} className="btn btn-secondary">Logout</button>
      </div>

      <div className="data-content">
        <form onSubmit={analyzeData} className="data-form">
          <div className="form-group">
            <label>Upload File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0])}
              disabled={loading}
              accept=".csv,.json,.xlsx"
            />
          </div>

          <div className="form-group">
            <label>Analysis Query</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to know about your data?"
              rows="4"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading || !file} className="btn">
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {results && (
          <div className="results">
            <h3>Analysis Results</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total</div>
                <div className="stat-value">{results.stats.total}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Average</div>
                <div className="stat-value">{results.stats.average}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Maximum</div>
                <div className="stat-value">{results.stats.maximum}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Minimum</div>
                <div className="stat-value">{results.stats.minimum}</div>
              </div>
            </div>
            <p className="summary">{results.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Data;
