import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Code.css';

function Code({ token, user, onLogout }) {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('javascript');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateCode = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      const { data } = await axios.post(
        '/api/code/generate',
        { language, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCode(data.code);
    } catch (error) {
      alert('Error generating code: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="code-container">
      <div className="code-header">
        <div>
          <button onClick={() => navigate('/')} className="back-btn">← Back</button>
          <h2>💻 Code Assistant</h2>
        </div>
        <button onClick={onLogout} className="btn btn-secondary">Logout</button>
      </div>

      <div className="code-content">
        <form onSubmit={generateCode} className="code-form">
          <div className="form-group">
            <label>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={loading}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what code you want to generate..."
              rows="4"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Generating...' : 'Generate Code'}
          </button>
        </form>

        {code && (
          <div className="code-result">
            <h3>Generated Code</h3>
            <pre><code>{code}</code></pre>
            <button onClick={() => navigator.clipboard.writeText(code)} className="btn btn-secondary">
              📋 Copy Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Code;
