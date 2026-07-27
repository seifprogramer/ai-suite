const express = require('express');
const supabase = require('../db/supabase');

const router = express.Router();

// Generate code - NO AUTH REQUIRED
router.post('/generate', async (req, res) => {
  try {
    const { language, description, chatId } = req.body;

    // Mock code generation
    const codeSnippets = {
      javascript: `function ${description.split(' ')[0] || 'myFunction'}() {\n  // Implementation here\n  return 'Hello, World!';\n}`,
      python: `def ${description.split(' ')[0] || 'my_function'}():\n    \"\"\"${description}\"\"\"\n    return 'Hello, World!'`,
      typescript: `function ${description.split(' ')[0] || 'myFunction'}(): string {\n  return 'Hello, World!';\n}`,
      java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}`
    };

    const code = codeSnippets[language] || codeSnippets.javascript;

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
          tool: 'code',
          title: `Code: ${description.substring(0, 20)}`
        }])
        .select()
        .single();
      chat = data;
    }

    await supabase
      .from('chat_messages')
      .insert([
        { chat_id: chat.id, role: 'user', content: `Generate ${language}: ${description}` },
        { chat_id: chat.id, role: 'assistant', content: code }
      ]);

    res.json({ code, language, chatId: chat.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
