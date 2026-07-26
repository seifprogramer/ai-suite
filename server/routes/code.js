const express = require('express');
const auth = require('../middleware/auth');
const ChatHistory = require('../models/ChatHistory');

const router = express.Router();

// Generate code
router.post('/generate', auth, async (req, res) => {
  try {
    const { language, description, chatId } = req.body;

    // Mock code generation
    const codeSnippets = {
      javascript: `function ${description.split(' ')[0] || 'myFunction'}() {\n  // Implementation here\n  return 'Hello, World!';\n}`,
      python: `def ${description.split(' ')[0] || 'my_function'}():\n    """${description}"""\n    return 'Hello, World!'`,
      typescript: `function ${description.split(' ')[0] || 'myFunction'}(): string {\n  return 'Hello, World!';\n}`,
      java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}`
    };

    const code = codeSnippets[language] || codeSnippets.javascript;

    let chat = await ChatHistory.findById(chatId);
    if (!chat) {
      chat = new ChatHistory({
        userId: req.userId,
        tool: 'code',
        title: `Code: ${description.substring(0, 20)}`
      });
    }

    chat.messages.push(
      { role: 'user', content: `Generate ${language}: ${description}` },
      { role: 'assistant', content: code }
    );
    await chat.save();

    res.json({ code, language, chatId: chat._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
