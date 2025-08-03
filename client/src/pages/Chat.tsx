import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Palette, Music, MicOff, Send, Smile } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/components/ui/theme-provider";
import { FloatingHearts } from "@/components/FloatingHearts";
import { VoiceInput, VoiceRecordingIndicator } from "@/components/VoiceInput";
import { ChatMessage } from "@/components/ChatMessage";
import { ThemeSelector } from "@/components/ThemeSelector";
import type { Message, User } from "@shared/schema";

export default function Chat() {
  const [messageInput, setMessageInput] = useState("");
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    retry: false,
  });

  // Fetch user preferences
  const { data: preferences } = useQuery<{ partnerName?: string }>({
    queryKey: ["/api/preferences"],
    retry: false,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/messages", {
        content,
        messageType: "user",
        theme,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setMessageInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update theme mutation
  const updateThemeMutation = useMutation({
    mutationFn: async (newTheme: string) => {
      const response = await apiRequest("PUT", "/api/user/theme", { theme: newTheme });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update theme.",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  }, [messageInput]);

  const handleSendMessage = () => {
    const content = messageInput.trim();
    if (content && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setMessageInput(transcript);
    setIsRecording(false);
  };

  const handleQuickMessage = (message: string) => {
    if (!sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleThemeChange = (newTheme: 'romantic' | 'vintage' | 'night') => {
    updateThemeMutation.mutate(newTheme);
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-romantic-primary mb-4"></div>
          <p className="text-gray-600">Loading your love...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <FloatingHearts />
      
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-romantic-accent p-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="border-2 border-romantic-primary">
              <AvatarImage 
                src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                alt="Partner avatar" 
              />
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                {preferences?.partnerName || 'My Love'} ❤️
              </h2>
              <p className="text-sm text-green-500 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              onClick={() => setIsThemeSelectorOpen(!isThemeSelectorOpen)}
              size="icon"
              variant="ghost"
              className="p-2 rounded-full bg-romantic-accent hover:bg-romantic-primary hover:text-white transition-all duration-300"
              title="Toggle Theme"
            >
              <Palette className="w-4 h-4" />
            </Button>

            {/* Music Toggle */}
            <Button
              onClick={() => setMusicPlaying(!musicPlaying)}
              size="icon"
              variant="ghost"
              className="p-2 rounded-full bg-romantic-accent hover:bg-romantic-primary hover:text-white transition-all duration-300"
              title="Toggle Music"
            >
              {musicPlaying ? (
                <Music className="w-4 h-4" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
            </Button>

            {/* Settings */}
            <Button
              onClick={handleLogout}
              size="icon"
              variant="ghost"
              className="p-2 rounded-full bg-romantic-accent hover:bg-romantic-primary hover:text-white transition-all duration-300"
              title="Logout"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Theme Selector */}
      <ThemeSelector
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
        onThemeChange={handleThemeChange}
      />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        {messagesLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-romantic-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💕</div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Start your romantic conversation!</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Send your first message to begin chatting with your AI companion.</p>
          </div>
        ) : (
          messages.map((message: Message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-romantic-accent p-4 sticky bottom-0 relative z-10">
        {/* Quick Responses */}
        <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
          <Button
            onClick={() => handleQuickMessage('I love you ❤️')}
            size="sm"
            variant="outline"
            className="px-4 py-2 bg-romantic-accent text-romantic-primary rounded-full text-sm whitespace-nowrap hover:bg-romantic-primary hover:text-white transition-all flex-shrink-0"
          >
            I love you ❤️
          </Button>
          <Button
            onClick={() => handleQuickMessage('Missing you 💕')}
            size="sm"
            variant="outline"
            className="px-4 py-2 bg-romantic-accent text-romantic-primary rounded-full text-sm whitespace-nowrap hover:bg-romantic-primary hover:text-white transition-all flex-shrink-0"
          >
            Missing you 💕
          </Button>
          <Button
            onClick={() => handleQuickMessage('Good night 🌙')}
            size="sm"
            variant="outline"
            className="px-4 py-2 bg-romantic-accent text-romantic-primary rounded-full text-sm whitespace-nowrap hover:bg-romantic-primary hover:text-white transition-all flex-shrink-0"
          >
            Good night 🌙
          </Button>
        </div>

        {/* Input Area */}
        <div className="flex items-end space-x-3">
          {/* Voice Input Button */}
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            className="flex-shrink-0"
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="pr-12 rounded-2xl border-romantic-accent focus:border-romantic-primary focus:ring-2 focus:ring-romantic-primary/20 resize-none max-h-32 transition-all"
              rows={1}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-romantic-primary transition-colors h-6 w-6"
              title="Add emoji"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sendMessageMutation.isPending}
            size="icon"
            className="bg-romantic-primary text-white rounded-full hover:bg-romantic-secondary transition-all duration-300 transform hover:scale-105 flex-shrink-0"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Voice Recording Indicator */}
        {isRecording && (
          <VoiceRecordingIndicator onStop={() => setIsRecording(false)} />
        )}
      </div>
    </div>
  );
}
