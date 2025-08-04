import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Mock API responses for Vercel deployment
app.get('/api/auth/user', (req, res) => {
    res.json({
        id: 'vercel-user',
        email: 'user@loveverse.vercel.app',
        firstName: 'Vercel',
        lastName: 'User',
        currentTheme: 'romantic',
        musicEnabled: true
    });
});

app.get('/api/messages', (req, res) => {
    res.json([]);
});

app.post('/api/messages', (req, res) => {
    const { content, messageType, theme } = req.body;

    res.json({
        userMessage: {
            id: 'vercel-msg-1',
            content,
            messageType,
            theme,
            timestamp: new Date()
        },
        aiMessage: {
            id: 'vercel-ai-1',
            content: 'This is a Vercel deployment response! 💕',
            messageType: 'ai',
            theme,
            timestamp: new Date()
        }
    });
});

app.get('/api/preferences', (req, res) => {
    res.json({
        partnerName: 'Vercel Partner',
        relationshipLength: 'Deployment',
        favoriteActivities: 'Deploying together',
        loveLanguage: 'Quality Time',
        personalityType: 'Developer'
    });
});

app.put('/api/preferences', (req, res) => {
    res.json({ ...req.body, id: 'vercel-prefs-1' });
});

// Export for Vercel
export default app; 