import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Image.css';

function Image({ token, user, onLogout }) {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);

      const { data } = await axios.post('/api/image/generate', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setImage(data.imageUrl);
    } catch (error) {
      alert('Error generating image: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-container">
      <div className="image-header">
        <div>
          <button onClick={() => navigate('/')} className="back-btn">← Back</button>
          <h2>🎨 Image Generator</h2>
        </div>
        <button onClick={onLogout} className="btn btn-secondary">Logout</button>
      </div>

      <div className="image-content">
        <form onSubmit={generateImage} className="image-form">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            rows="4"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </form>

        {image && (
          <div className="image-result">
            <img src={image} alt="Generated" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Image;
