# 🤖 AI Suite - Multi-Tool AI Platform

A full-featured AI application with a beautiful dark mode UI, built with React, Node.js, and custom AI models.

## Features

✨ **4 Powerful AI Tools:**
- 💬 **Chat Assistant** - Conversational AI
- 🎨 **Image Generator** - AI-powered image generation
- 📊 **Data Analysis** - Analyze and visualize data
- 💻 **Code Assistant** - Generate code snippets

🔐 **Authentication:**
- User registration and login
- JWT token-based authentication
- Secure password hashing

💾 **History & Memory:**
- Save chat histories
- Access previous conversations
- Track all interactions

📁 **File Management:**
- Upload and process files
- Support for CSV, JSON, XLSX formats

🌙 **Beautiful Dark Mode UI:**
- Modern gradient design
- Smooth animations
- Responsive layout
- Real-time updates via WebSocket

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.io** - Real-time communication
- **CSS3** - Modern styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - WebSocket support

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/seifprogramer/ai-suite.git
cd ai-suite
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Configure environment**
```bash
cp server/.env.example server/.env
# Edit server/.env with your settings
```

4. **Start the application**
```bash
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Project Structure

```
ai-suite/
├── server/                 # Backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── index.js          # Server entry
│   └── .env              # Environment variables
│
├── client/                # Frontend
│   ├── public/           # Static files
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── App.js        # Main app
│   │   └── index.css     # Global styles
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Chat
- `POST /api/chat/message` - Send message
- `GET /api/chat/history` - Get chat history
- `GET /api/chat/:chatId` - Get specific chat

### Image
- `POST /api/image/generate` - Generate image

### Data
- `POST /api/data/analyze` - Analyze data

### Code
- `POST /api/code/generate` - Generate code

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/ai-suite
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## Features in Development

- [ ] Integration with actual ML models
- [ ] Advanced image generation with Stable Diffusion
- [ ] Real data analysis with pandas/numpy backend
- [ ] Multiple AI model providers (OpenAI, Hugging Face, etc.)
- [ ] User settings and preferences
- [ ] Export functionality
- [ ] Mobile app
- [ ] Dark/Light mode toggle
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Author

**Seif Programmer** - [@seifprogramer](https://github.com/seifprogramer)

## Support

For support, open an issue on GitHub or contact the author.

---

**Built with ❤️ and AI** 🚀
