import {
  users,
  messages,
  chatSessions,
  userPreferences,
  type User,
  type UpsertUser,
  type Message,
  type InsertMessage,
  type ChatSession,
  type InsertChatSession,
  type UserPreferences,
  type InsertUserPreferences,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Message operations
  createMessage(userId: string, message: InsertMessage): Promise<Message>;
  getMessages(userId: string, limit?: number): Promise<Message[]>;
  
  // Chat session operations
  createChatSession(userId: string, session: InsertChatSession): Promise<ChatSession>;
  getChatSessions(userId: string): Promise<ChatSession[]>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  updateUserPreferences(userId: string, preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Theme and settings
  updateUserTheme(userId: string, theme: string): Promise<User>;
  updateMusicSetting(userId: string, musicEnabled: boolean): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createMessage(userId: string, message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values({
        ...message,
        userId,
      })
      .returning();
    return newMessage;
  }

  async getMessages(userId: string, limit: number = 50): Promise<Message[]> {
    const userMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.userId, userId))
      .orderBy(desc(messages.timestamp))
      .limit(limit);
    
    return userMessages.reverse(); // Return in chronological order
  }

  async createChatSession(userId: string, session: InsertChatSession): Promise<ChatSession> {
    const [newSession] = await db
      .insert(chatSessions)
      .values({
        ...session,
        userId,
      })
      .returning();
    return newSession;
  }

  async getChatSessions(userId: string): Promise<ChatSession[]> {
    return await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.lastMessageAt));
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async updateUserPreferences(userId: string, preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [updated] = await db
      .insert(userPreferences)
      .values({
        ...preferences,
        userId,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: preferences,
      })
      .returning();
    return updated;
  }

  async updateUserTheme(userId: string, theme: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        currentTheme: theme,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateMusicSetting(userId: string, musicEnabled: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        musicEnabled,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
