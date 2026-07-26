const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  messages: [
    {
      role: {
        type: String,
        enum: ['user', 'assistant']
      },
      content: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  tool: {
    type: String,
    enum: ['chat', 'image', 'data', 'code'],
    default: 'chat'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
