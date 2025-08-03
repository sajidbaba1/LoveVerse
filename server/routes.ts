import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { huggingFaceService } from "./services/huggingface";
import { insertMessageSchema, insertUserPreferencesSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Chat messages routes
  app.get('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await storage.getMessages(userId, limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse(req.body);
      
      // Create user message
      const userMessage = await storage.createMessage(userId, messageData);
      
      // Generate AI response if this is a user message
      if (messageData.messageType === 'user') {
        const user = await storage.getUser(userId);
        const preferences = await storage.getUserPreferences(userId);
        
        const aiResponse = await huggingFaceService.generateRomanticResponse({
          userMessage: messageData.content,
          theme: messageData.theme,
          partnerName: preferences?.partnerName || undefined,
          relationshipContext: preferences?.relationshipLength || undefined,
        });

        // Save AI response
        const aiMessage = await storage.createMessage(userId, {
          content: aiResponse,
          messageType: 'ai',
          theme: messageData.theme,
        });

        res.json({ userMessage, aiMessage });
      } else {
        res.json({ userMessage });
      }
    } catch (error) {
      console.error("Error creating message:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create message" });
      }
    }
  });

  // User preferences routes
  app.get('/api/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.put('/api/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferencesData = insertUserPreferencesSchema.parse(req.body);
      const preferences = await storage.updateUserPreferences(userId, preferencesData);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid preferences data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update preferences" });
      }
    }
  });

  // Theme and settings routes
  app.put('/api/user/theme', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { theme } = req.body;
      
      if (!['romantic', 'vintage', 'night'].includes(theme)) {
        return res.status(400).json({ message: "Invalid theme" });
      }

      const user = await storage.updateUserTheme(userId, theme);
      res.json(user);
    } catch (error) {
      console.error("Error updating theme:", error);
      res.status(500).json({ message: "Failed to update theme" });
    }
  });

  app.put('/api/user/music', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { musicEnabled } = req.body;
      const user = await storage.updateMusicSetting(userId, musicEnabled);
      res.json(user);
    } catch (error) {
      console.error("Error updating music setting:", error);
      res.status(500).json({ message: "Failed to update music setting" });
    }
  });

  // Chat sessions routes
  app.get('/api/chat-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getChatSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });

  app.post('/api/chat-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = { title: req.body.title || 'New Chat' };
      const session = await storage.createChatSession(userId, sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating chat session:", error);
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  // Couple connection routes
  app.post('/api/couple/create-code', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connectionCode = await storage.createConnectionCode(userId);
      res.json({ connectionCode });
    } catch (error) {
      console.error("Error creating connection code:", error);
      res.status(500).json({ message: "Failed to create connection code" });
    }
  });

  app.post('/api/couple/connect', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { connectionCode } = req.body;
      
      if (!connectionCode) {
        return res.status(400).json({ message: "Connection code is required" });
      }
      
      const couple = await storage.connectWithPartner(userId, connectionCode);
      res.json(couple);
    } catch (error: any) {
      console.error("Error connecting with partner:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/couple/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const couple = await storage.getUserCouple(userId);
      res.json({ couple, isConnected: !!couple });
    } catch (error) {
      console.error("Error fetching couple status:", error);
      res.status(500).json({ message: "Failed to fetch couple status" });
    }
  });

  app.post('/api/couple/disconnect', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.disconnectCouple(userId);
      res.json({ message: "Successfully disconnected from partner" });
    } catch (error) {
      console.error("Error disconnecting couple:", error);
      res.status(500).json({ message: "Failed to disconnect from partner" });
    }
  });

  // Couple messages routes
  app.get('/api/couple/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const couple = await storage.getUserCouple(userId);
      
      if (!couple) {
        return res.status(404).json({ message: "No partner connection found" });
      }
      
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await storage.getCoupleMessages(couple.id, limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching couple messages:", error);
      res.status(500).json({ message: "Failed to fetch couple messages" });
    }
  });

  app.post('/api/couple/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const couple = await storage.getUserCouple(userId);
      
      if (!couple) {
        return res.status(404).json({ message: "No partner connection found" });
      }
      
      const messageData = insertMessageSchema.parse(req.body);
      
      // Create partner message (not AI message)
      const partnerMessage = await storage.createMessage(userId, {
        ...messageData,
        messageType: 'partner'
      }, couple.id);
      
      res.json({ partnerMessage });
    } catch (error) {
      console.error("Error creating couple message:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create couple message" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
