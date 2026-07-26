const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const ChatHistory = require('../models/ChatHistory');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Simple image generation mock (replace with actual ML model)
function generateImage(prompt) {
  return {
    success: true,
    imageUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Crect fill='%23333' width='512' height='512'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23fff' font-size='24'%3EGenerated: ${prompt.substring(0, 30)}%3C/text%3E%3C/svg%3E`,
    prompt: prompt
  };
}

// Generate image from prompt
router.post('/generate', auth, upload.single('file'), async (req, res) => {
  try {
    const { prompt, chatId } = req.body;

    const result = generateImage(prompt);

    let chat = await ChatHistory.findById(chatId);
    if (!chat) {
      chat = new ChatHistory({
        userId: req.userId,
        tool: 'image',
        title: prompt.substring(0, 30)
      });
    }

    chat.messages.push(
      { role: 'user', content: `Image: ${prompt}` },
      { role: 'assistant', content: `Generated image for: ${prompt}` }
    );
    await chat.save();

    res.json({ ...result, chatId: chat._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
