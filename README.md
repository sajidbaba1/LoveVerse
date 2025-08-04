# LoveVerse - Romantic AI Chat Companion 💕

A beautiful, modern romantic AI chat application that provides personalized, theme-based conversations with an AI companion AND real partner connections.

![LoveVerse](https://img.shields.io/badge/LoveVerse-Romantic%20AI%20Chat-blue?style=for-the-badge&logo=heart)

## ✨ Features

### 🤖 AI Companion Chat
- **Personalized AI Responses**: Powered by Hugging Face's DialoGPT-medium model
- **Theme-Based Conversations**: Three romantic themes (Romantic, Vintage, Night)
- **Context-Aware**: Remembers conversation history and user preferences
- **Fallback System**: Graceful degradation when AI service is unavailable

### 👫 Couple Connection System
- **Partner Pairing**: Connect with your real partner using unique 6-character codes
- **Dual Chat Modes**: Toggle between AI companion and partner chat
- **Real-time Messaging**: Direct partner-to-partner communication
- **Connection Management**: Create, connect, and disconnect partner relationships

### 🎨 Beautiful UI/UX
- **Modern Design**: Built with React 18, TypeScript, and Tailwind CSS
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Theme System**: Dynamic theming with CSS custom properties
- **Voice Features**: Speech recognition and text-to-speech
- **Floating Hearts**: Animated romantic elements

### 🔧 Technical Features
- **Full-Stack**: Node.js/Express backend with React frontend
- **Database**: PostgreSQL with Drizzle ORM for type-safe operations
- **Authentication**: Replit Auth integration (OpenID Connect)
- **Real-time**: WebSocket support for live features
- **Type Safety**: Full TypeScript implementation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Hugging Face API key (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sajidbaba1/LoveVerse.git
cd LoveVerse
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```bash
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
NODE_ENV=development
HUGGINGFACE_API_KEY=your_huggingface_api_key  # Optional
```

4. **Set up the database**
```bash
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5000`

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking
npm run db:push      # Push database schema changes
```

### Project Structure

```
LoveVerse/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and config
│   └── index.html
├── server/                 # Express backend
│   ├── routes.ts          # API routes
│   ├── db.ts             # Database connection
│   ├── replitAuth.ts     # Authentication
│   └── services/         # Business logic
├── shared/                # Shared types and schema
│   └── schema.ts         # Database schema
└── package.json
```

## 🎨 Themes

LoveVerse features three beautiful romantic themes:

### 💕 Romantic Theme
- Pink and red color palette
- Heart emojis and romantic expressions
- Sweet and affectionate language

### 🕰️ Vintage Theme
- Gold and brown color scheme
- Classic, elegant expressions
- Timeless romantic language

### 🌙 Night Theme
- Purple and dark color palette
- Dreamy, intimate atmosphere
- Soft and gentle expressions

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Login endpoint
- `GET /api/logout` - Logout endpoint

### Chat Messages
- `GET /api/messages` - Get chat history
- `POST /api/messages` - Send message and get AI response

### User Preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update user preferences

### Couple Features
- `POST /api/couple/create` - Create couple connection
- `POST /api/couple/connect` - Connect with partner
- `GET /api/couple/status` - Get couple status
- `GET /api/couple/messages` - Get couple messages
- `POST /api/couple/messages` - Send couple message

## 🗄️ Database Schema

The application uses PostgreSQL with the following key tables:

- **users**: User profiles and preferences
- **messages**: Chat history with message types
- **couples**: Partner connections and status
- **chatSessions**: Conversation organization
- **userPreferences**: Personalized settings
- **sessions**: Authentication sessions

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Session encryption key | Yes |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | No (has fallback) |
| `REPLIT_DOMAINS` | Replit domain for auth | Production only |
| `REPL_ID` | Replit project ID | Production only |

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Replit Deployment
The project is configured for Replit deployment with:
- Automatic environment variable setup
- PostgreSQL database integration
- Replit Auth integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for AI model hosting
- [Neon](https://neon.tech/) for PostgreSQL database
- [Replit](https://replit.com/) for hosting and authentication
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 💖 Made with Love

LoveVerse is built with modern web technologies and a focus on creating meaningful romantic connections through AI and real partner interactions.

---

**LoveVerse** - Where technology meets romance 💕✨ 