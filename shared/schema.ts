import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  currentTheme: varchar("current_theme", { length: 20 }).default('romantic'),
  musicEnabled: boolean("music_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table for chat history
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  coupleId: varchar("couple_id").references(() => couples.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  messageType: varchar("message_type", { length: 10 }).notNull(), // 'user', 'ai', 'partner'
  timestamp: timestamp("timestamp").defaultNow(),
  theme: varchar("theme", { length: 20 }).notNull(),
});

// Chat sessions for organizing conversations
export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 255 }).notNull().default('New Chat'),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Couples table for connecting partners
export const couples = pgTable("couples", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user1Id: varchar("user1_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  user2Id: varchar("user2_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  connectionCode: varchar("connection_code", { length: 10 }).unique().notNull(),
  status: varchar("status", { length: 20 }).default('pending'), // 'pending', 'connected', 'disconnected'
  connectedAt: timestamp("connected_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User preferences for personalized AI responses
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  partnerName: varchar("partner_name", { length: 100 }).default('My Love'),
  relationshipLength: varchar("relationship_length", { length: 50 }),
  favoriteActivities: text("favorite_activities"),
  loveLanguage: varchar("love_language", { length: 50 }),
  personalityType: varchar("personality_type", { length: 50 }),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  messageType: true,
  theme: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  title: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  partnerName: true,
  relationshipLength: true,
  favoriteActivities: true,
  loveLanguage: true,
  personalityType: true,
});

export const insertCoupleSchema = createInsertSchema(couples).pick({
  connectionCode: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertCouple = z.infer<typeof insertCoupleSchema>;
export type Couple = typeof couples.$inferSelect;
