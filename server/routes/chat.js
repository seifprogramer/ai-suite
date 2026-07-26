const express = require('express');
const auth = require('../middleware/auth');
const ChatHistory = require('../models/ChatHistory');

const router = express.Router();

// Simple AI response (can be replaced with actual ML model)
function generateAIResponse(userMessage) {
  const responses = [
    'That\'s an interesting question! Let me think about that...',
    'I appreciate your input. Here\'s what I think...',
    'Based on what you said, here\'s my perspective...',
    'Great point! Consider this perspective...',
    'I understand. Let me provide some insights...'
  ];
  
  return responses[Math.floor(Math.random() * responses.length)] + ` You said: "${userMessage.substring(0, 50)}..."`;
}

// Send message
router.post('/message', auth, async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const io = req.app.get('io');

    const response = generateAIResponse(message);

    let chat = await ChatHistory.findById(chatId);
    if (!chat) {
      chat = new ChatHistory({
        userId: req.userId,
        tool: 'chat',
        title: message.substring(0, 30)
      });
    }

    chat.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    );
    await chat.save();

    io.emit('message', { role: 'assistant', content: response });

    res.json({ message: response, chatId: chat._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history
router.get('/history', auth, async (req, res) => {
  try {\n    const chats = await ChatHistory.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single chat
router.get('/:chatId', auth, async (req, res) => {
  try {
    const chat = await ChatHistory.findById(req.params.chatId);
    if (!chat || chat.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
