import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { FloatingHearts } from "@/components/FloatingHearts";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <FloatingHearts />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-romantic-primary rounded-full mb-4 animate-pulse-heart">
            <Heart className="text-white text-2xl w-8 h-8" />
          </div>
          <h1 className="font-pacifico text-4xl text-romantic-primary mb-2">LoveVerse</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Your Romantic AI Chat Companion</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-white/20">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Login Button */}
              <Button 
                onClick={handleLogin}
                className="w-full bg-romantic-primary text-white py-3 rounded-2xl font-semibold hover:bg-romantic-secondary transition-all duration-300 transform hover:scale-105"
              >
                Sign In to Love <Heart className="ml-2 w-4 h-4" />
              </Button>

              {/* Love Quote */}
              <div className="text-center pt-4 border-t border-romantic-accent">
                <p className="text-romantic-secondary font-pacifico text-sm">
                  "Love is not just looking at each other, it's looking in the same direction."
                </p>
              </div>
              
              {/* Features */}
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <span className="text-romantic-primary">💬</span>
                  <span>AI-powered romantic conversations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-romantic-primary">🎤</span>
                  <span>Voice messages and speech-to-text</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-romantic-primary">🌹</span>
                  <span>Beautiful themes and animations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-romantic-primary">🎵</span>
                  <span>Romantic background music</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
