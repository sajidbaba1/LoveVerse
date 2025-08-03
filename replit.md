# LoveVerse - Romantic AI Chat Companion

## Overview

LoveVerse is a romantic AI-powered chat application that provides personalized, theme-based conversations with an AI companion. The application features multiple romantic themes (romantic, vintage, night), voice interactions, and a beautiful, responsive user interface built with modern web technologies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using React with TypeScript and follows a modern component-based architecture:

- **Framework**: React 18 with TypeScript for type safety and better developer experience
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS custom properties for dynamic theming
- **Build Tool**: Vite for fast development and optimized production builds

The application implements a theme system with three distinct romantic themes (romantic, vintage, night) that dynamically change colors, typography, and visual elements throughout the interface.

### Backend Architecture
The server follows a Node.js/Express architecture with modern ESM modules:

- **Runtime**: Node.js with TypeScript and ESM modules
- **Framework**: Express.js for HTTP server and API routes
- **Authentication**: Replit Auth using OpenID Connect with session-based authentication
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

The backend implements a RESTful API design with authenticated endpoints for user management, chat messages, and user preferences.

### Database Design
The application uses PostgreSQL with the following key tables:

- **users**: Stores user profiles with theme preferences and settings
- **messages**: Chat history with message type (user/ai), content, and theme context
- **chatSessions**: Conversation organization and management
- **userPreferences**: User-specific settings and customizations
- **sessions**: Session storage for authentication (Replit Auth requirement)

The schema uses UUIDs for primary keys and includes proper referential integrity with cascading deletes.

### AI Integration
The application integrates with Hugging Face's inference API for AI-powered responses:

- **Model**: Microsoft DialoGPT-medium for conversational AI
- **Context Awareness**: Prompts are customized based on user themes and conversation context
- **Fallback System**: Graceful degradation with predefined responses when AI service is unavailable
- **Response Processing**: Custom prompt engineering for romantic, vintage, and night themes

### Authentication System
Implements Replit's OpenID Connect authentication:

- **Provider**: Replit OIDC for seamless integration in Replit environment
- **Session Management**: Secure session storage with PostgreSQL backend
- **User Management**: Automatic user creation and profile management
- **Route Protection**: Middleware-based authentication guards for protected endpoints

### Voice Features
The application includes browser-based speech capabilities:

- **Speech Recognition**: Web Speech API for voice input conversion to text
- **Text-to-Speech**: Web Speech API for reading AI responses aloud
- **Browser Compatibility**: Progressive enhancement with fallbacks for unsupported browsers

### Theme System
Dynamic theming system with CSS custom properties:

- **Theme Variants**: Romantic (pink/red), Vintage (gold/brown), Night (purple/dark)
- **Dynamic Switching**: Real-time theme changes without page refresh
- **Persistent Storage**: Theme preferences saved to localStorage and user profile
- **Component Integration**: Theme-aware components with conditional styling

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect for database operations
- **drizzle-kit**: Database migration and schema management tools

### Authentication & Sessions
- **openid-client**: OpenID Connect client implementation for Replit Auth
- **passport**: Authentication middleware framework
- **express-session**: Session management middleware
- **connect-pg-simple**: PostgreSQL session store adapter

### AI Services
- **Hugging Face Inference API**: External AI service for generating conversational responses
- **Microsoft DialoGPT-medium**: Conversational AI model hosted on Hugging Face

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitive components
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router
- **react-hook-form**: Form management with validation

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type checking and enhanced developer experience
- **@replit/vite-plugin-runtime-error-modal**: Replit-specific error handling
- **@replit/vite-plugin-cartographer**: Replit development integration

### Browser APIs
- **Web Speech API**: For voice recognition and text-to-speech functionality
- **LocalStorage API**: For client-side theme and preference persistence