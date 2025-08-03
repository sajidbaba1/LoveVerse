import {
  users,
  messages,
  chatSessions,
  userPreferences,
  couples,
  type User,
  type UpsertUser,
  type Message,
  type InsertMessage,
  type ChatSession,
  type InsertChatSession,
  type UserPreferences,
  type InsertUserPreferences,
  type Couple,
  type InsertCouple,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Message operations
  createMessage(userId: string, message: InsertMessage, coupleId?: string): Promise<Message>;
  getMessages(userId: string, limit?: number): Promise<Message[]>;
  getCoupleMessages(coupleId: string, limit?: number): Promise<Message[]>;
  
  // Chat session operations
  createChatSession(userId: string, session: InsertChatSession): Promise<ChatSession>;
  getChatSessions(userId: string): Promise<ChatSession[]>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  updateUserPreferences(userId: string, preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Couple operations
  createConnectionCode(userId: string): Promise<string>;
  connectWithPartner(userId: string, connectionCode: string): Promise<Couple>;
  getUserCouple(userId: string): Promise<Couple | undefined>;
  disconnectCouple(userId: string): Promise<void>;
  
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

  async createMessage(userId: string, message: InsertMessage, coupleId?: string): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values({
        ...message,
        userId,
        coupleId,
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

  // Generate a unique 6-character connection code
  private generateConnectionCode(): string {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  async createConnectionCode(userId: string): Promise<string> {
    let connectionCode: string;
    let isUnique = false;
    
    // Keep generating codes until we find a unique one
    do {
      connectionCode = this.generateConnectionCode();
      const existing = await db
        .select()
        .from(couples)
        .where(eq(couples.connectionCode, connectionCode));
      isUnique = existing.length === 0;
    } while (!isUnique);

    // Create couple entry with the user as user1
    await db.insert(couples).values({
      user1Id: userId,
      user2Id: '', // Will be filled when partner connects
      connectionCode,
      status: 'pending',
    });

    return connectionCode;
  }

  async connectWithPartner(userId: string, connectionCode: string): Promise<Couple> {
    // Find the existing couple entry
    const [existingCouple] = await db
      .select()
      .from(couples)
      .where(eq(couples.connectionCode, connectionCode));

    if (!existingCouple) {
      throw new Error('Invalid connection code');
    }

    if (existingCouple.user1Id === userId) {
      throw new Error('Cannot connect with yourself');
    }

    if (existingCouple.status === 'connected') {
      throw new Error('Connection code already used');
    }

    // Update the couple entry with user2 and set status to connected
    const [updatedCouple] = await db
      .update(couples)
      .set({
        user2Id: userId,
        status: 'connected',
        connectedAt: new Date(),
      })
      .where(eq(couples.id, existingCouple.id))
      .returning();

    return updatedCouple;
  }

  async getUserCouple(userId: string): Promise<Couple | undefined> {
    const [couple] = await db
      .select()
      .from(couples)
      .where(
        and(
          eq(couples.status, 'connected'),
          // User can be either user1 or user2
          or(eq(couples.user1Id, userId), eq(couples.user2Id, userId))
        )
      );
    return couple;
  }

  async getCoupleMessages(coupleId: string, limit: number = 50): Promise<Message[]> {
    const coupleMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.coupleId, coupleId))
      .orderBy(desc(messages.timestamp))
      .limit(limit);
    
    return coupleMessages.reverse(); // Return in chronological order
  }

  async disconnectCouple(userId: string): Promise<void> {
    await db
      .update(couples)
      .set({
        status: 'disconnected',
      })
      .where(
        and(
          eq(couples.status, 'connected'),
          or(eq(couples.user1Id, userId), eq(couples.user2Id, userId))
        )
      );
  }
}

export const storage = new DatabaseStorage();
