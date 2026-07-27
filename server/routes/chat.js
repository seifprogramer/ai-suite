const express = require('express');
const supabase = require('../db/supabase');

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

// Send message - NO AUTH REQUIRED
router.post('/message', async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const io = req.app.get('io');

    const response = generateAIResponse(message);

    let chat;
    if (chatId) {
      const { data } = await supabase
        .from('chat_history')
        .select('*')
        .eq('id', chatId)
        .single();
      chat = data;
    } else {
      const { data } = await supabase
        .from('chat_history')
        .insert([{
          user_id: '00000000-0000-0000-0000-000000000000', // Anonymous user
          tool: 'chat',
          title: message.substring(0, 30)
        }])
        .select()
        .single();
      chat = data;
    }

    // Insert messages
    await supabase
      .from('chat_messages')
      .insert([
        { chat_id: chat.id, role: 'user', content: message },
        { chat_id: chat.id, role: 'assistant', content: response }
      ]);

    io.emit('message', { role: 'assistant', content: response });

    res.json({ message: response, chatId: chat.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history - NO AUTH REQUIRED
router.get('/history', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single chat - NO AUTH REQUIRED
router.get('/:chatId', async (req, res) => {
  try {
    const { data: chat, error: chatError } = await supabase
      .from('chat_history')
      .select('*')
      .eq('id', req.params.chatId)
      .single();

    if (chatError || !chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chat.id)
      .order('timestamp', { ascending: true });

    res.json({ ...chat, messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
