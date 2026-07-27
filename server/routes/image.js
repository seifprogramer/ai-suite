const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const supabase = require('../db/supabase');

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
          tool: 'image',
          title: prompt.substring(0, 30)
        }])
        .select()
        .single();
      chat = data;
    }

    await supabase
      .from('chat_messages')
      .insert([
        { chat_id: chat.id, role: 'user', content: `Image: ${prompt}` },
        { chat_id: chat.id, role: 'assistant', content: `Generated image for: ${prompt}` }
      ]);

    res.json({ ...result, chatId: chat.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
