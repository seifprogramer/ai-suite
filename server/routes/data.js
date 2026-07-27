const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const supabase = require('../db/supabase');

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
          user_id: req.userId,
          tool: 'data',
          title: `Data Analysis: ${query.substring(0, 20)}`
        }])
        .select()
        .single();
      chat = data;
    }

    await supabase
      .from('chat_messages')
      .insert([
        { chat_id: chat.id, role: 'user', content: `Analyze: ${query}` },
        { chat_id: chat.id, role: 'assistant', content: JSON.stringify(analysis) }
      ]);

    res.json({ ...analysis, chatId: chat.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
