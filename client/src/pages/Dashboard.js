import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  const tools = [
    { name: 'Chat', icon: '💬', path: '/chat', desc: 'Conversational AI Assistant' },
    { name: 'Image', icon: '🎨', path: '/image', desc: 'AI Image Generator' },
    { name: 'Data', icon: '📊', path: '/data', desc: 'Data Analysis Tool' },
    { name: 'Code', icon: '💻', path: '/code', desc: 'Code Assistant' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.username}! 👋</h1>
          <p>Choose a tool to get started</p>
        </div>
        <button onClick={onLogout} className="btn btn-secondary">Logout</button>
      </div>

      <div className="tools-grid">
        {tools.map(tool => (
          <div key={tool.name} className="tool-card" onClick={() => navigate(tool.path)}>
            <div className="tool-icon">{tool.icon}</div>
            <h3>{tool.name}</h3>
            <p>{tool.desc}</p>
            <div className="tool-arrow">→</div>
          </div>
        ))}
      </div>

      <div className="dashboard-footer">
        <p>Built with React + Node.js + AI 🚀</p>
      </div>
    </div>
  );
}

export default Dashboard;
