import React from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Brain, Heart, BookmarkX, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { textToSpeech } from "./VoiceInput";
import type { Message } from "@shared/schema";

interface ChatMessageProps {
  message: Message;
  onReaction?: (messageId: string, reaction: string) => void;
}

export function ChatMessage({ message, onReaction }: ChatMessageProps) {
  const isUser = message.messageType === 'user';
  const isAI = message.messageType === 'ai';
  
  const handleTextToSpeech = () => {
    textToSpeech(message.content);
  };
  
  const handleReaction = (reaction: string) => {
    if (onReaction) {
      onReaction(message.id, reaction);
    }
  };
  
  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isUser) {
    return (
      <div className="flex items-end space-x-3 justify-end chat-message">
        <div className="flex-1 flex justify-end">
          <div className="bg-romantic-accent dark:bg-romantic-primary/20 rounded-2xl rounded-tr-md p-4 shadow-md max-w-xs">
            <p className="text-gray-800 dark:text-gray-200">{message.content}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(message.timestamp)}
              </span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-romantic-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-romantic-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-sm">You</span>
        </div>
      </div>
    );
  }

  if (isAI) {
    return (
      <div className="flex items-start space-x-3 chat-message">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-romantic-primary to-romantic-secondary flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="bg-gradient-to-r from-romantic-primary to-romantic-secondary text-white rounded-2xl rounded-tl-md p-4 shadow-md max-w-xs">
            <p>{message.content}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-white/80">
                {formatTime(message.timestamp)}
              </span>
              <div className="flex space-x-2">
                <Button
                  onClick={handleTextToSpeech}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
                  title="Read aloud"
                >
                  <Volume2 className="w-3 h-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
                  title="AI Response"
                >
                  <Brain className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex space-x-2 mt-2">
            <Button
              onClick={() => handleReaction('❤️')}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-romantic-primary hover:scale-125 transition-transform hover:bg-transparent"
            >
              <span className="text-lg">❤️</span>
            </Button>
            <Button
              onClick={() => handleReaction('😘')}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-romantic-primary hover:scale-125 transition-transform hover:bg-transparent"
            >
              <span className="text-lg">😘</span>
            </Button>
            <Button
              onClick={() => handleReaction('🥰')}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-romantic-primary hover:scale-125 transition-transform hover:bg-transparent"
            >
              <span className="text-lg">🥰</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Partner message (for future feature)
  return (
    <div className="flex items-start space-x-3 chat-message">
      <img 
        src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50" 
        alt="Partner" 
        className="w-10 h-10 rounded-full object-cover border-2 border-romantic-primary flex-shrink-0"
      />
      <div className="flex-1">
        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-md p-4 shadow-md max-w-xs">
          <p className="text-gray-800 dark:text-gray-200">{message.content}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.timestamp)}
            </span>
            <Button
              onClick={handleTextToSpeech}
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-romantic-primary hover:text-romantic-secondary"
              title="Read aloud"
            >
              <Volume2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="flex space-x-2 mt-2">
          <Button
            onClick={() => handleReaction('❤️')}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-romantic-primary hover:scale-125 transition-transform hover:bg-transparent"
          >
            <span className="text-lg">❤️</span>
          </Button>
          <Button
            onClick={() => handleReaction('😘')}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-romantic-primary hover:scale-125 transition-transform hover:bg-transparent"
          >
            <span className="text-lg">😘</span>
          </Button>
          <Button
            onClick={() => handleReaction('🥰')}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-romantic-primary hover:scale-125 transition-transform hover:bg-transparent"
          >
            <span className="text-lg">🥰</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
