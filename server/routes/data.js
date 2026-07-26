const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const ChatHistory = require('../models/ChatHistory');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Analyze data
router.post('/analyze', auth, upload.single('file'), async (req, res) => {
  try {
    const { query, chatId } = req.body;
    const file = req.file;

    // Mock data analysis
    const analysis = {
      success: true,
      summary: `Analysis of your data: ${query}`,
      stats: {
        total: Math.floor(Math.random() * 1000),
        average: (Math.random() * 100).toFixed(2),
        maximum: (Math.random() * 100).toFixed(2),
        minimum: (Math.random() * 100).toFixed(2)
      }
    };

    let chat = await ChatHistory.findById(chatId);
    if (!chat) {
      chat = new ChatHistory({
        userId: req.userId,
        tool: 'data',
        title: `Data Analysis: ${query.substring(0, 20)}`
      });
    }

    chat.messages.push(
      { role: 'user', content: `Analyze: ${query}` },
      { role: 'assistant', content: JSON.stringify(analysis) }
    );
    await chat.save();

    res.json({ ...analysis, chatId: chat._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
