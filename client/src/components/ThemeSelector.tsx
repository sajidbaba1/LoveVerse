import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Camera, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ui/theme-provider";
import { createThemeHearts } from "./FloatingHearts";

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange?: (theme: 'romantic' | 'vintage' | 'night') => void;
}

export function ThemeSelector({ isOpen, onClose, onThemeChange }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  const handleThemeSelect = (newTheme: 'romantic' | 'vintage' | 'night') => {
    setTheme(newTheme);
    createThemeHearts(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-20 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-romantic-accent z-30 animate-slide-up">
      <div className="space-y-2">
        <Button
          onClick={() => handleThemeSelect('romantic')}
          variant="ghost"
          className={cn(
            "w-full flex items-center space-x-3 p-3 rounded-xl transition-all justify-start",
            theme === 'romantic' 
              ? "bg-romantic-accent text-romantic-primary" 
              : "hover:bg-romantic-accent/50"
          )}
        >
          <div className="w-4 h-4 bg-romantic-primary rounded-full"></div>
          <span className="font-medium">Romantic</span>
          <Heart className="w-4 h-4 text-romantic-primary ml-auto" />
        </Button>
        
        <Button
          onClick={() => handleThemeSelect('vintage')}
          variant="ghost"
          className={cn(
            "w-full flex items-center space-x-3 p-3 rounded-xl transition-all justify-start",
            theme === 'vintage' 
              ? "bg-vintage-accent text-vintage-primary" 
              : "hover:bg-vintage-accent/50"
          )}
        >
          <div className="w-4 h-4 bg-vintage-primary rounded-full"></div>
          <span className="font-medium">Vintage</span>
          <Camera className="w-4 h-4 text-vintage-primary ml-auto" />
        </Button>
        
        <Button
          onClick={() => handleThemeSelect('night')}
          variant="ghost"
          className={cn(
            "w-full flex items-center space-x-3 p-3 rounded-xl transition-all justify-start",
            theme === 'night' 
              ? "bg-night-accent text-night-primary" 
              : "hover:bg-night-accent/50"
          )}
        >
          <div className="w-4 h-4 bg-night-primary rounded-full"></div>
          <span className="font-medium">Night</span>
          <Moon className="w-4 h-4 text-night-primary ml-auto" />
        </Button>
      </div>
    </div>
  );
}
