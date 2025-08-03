import React, { useEffect, useState } from "react";
import { useTheme } from "./ui/theme-provider";

interface Heart {
  id: number;
  emoji: string;
  left: number;
  duration: number;
}

const HEART_EMOJIS = {
  romantic: ['💕', '❤️', '💖', '💗', '💘'],
  vintage: ['🌹', '💐', '🕊️', '✨', '💎'],
  night: ['🌙', '⭐', '✨', '💫', '🌃']
};

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const { theme } = useTheme();
  
  useEffect(() => {
    let heartId = 0;
    
    const createHeart = () => {
      const emojis = HEART_EMOJIS[theme];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const left = Math.random() * 100;
      const duration = Math.random() * 3 + 2; // 2-5 seconds
      
      const newHeart: Heart = {
        id: heartId++,
        emoji,
        left,
        duration,
      };
      
      setHearts(prev => [...prev, newHeart]);
      
      // Remove heart after animation completes
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, duration * 1000);
    };
    
    // Create hearts periodically
    const interval = setInterval(createHeart, 2000);
    
    return () => clearInterval(interval);
  }, [theme]);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute text-2xl animate-float-up"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  );
}

export function createThemeHearts(theme: keyof typeof HEART_EMOJIS) {
  const container = document.getElementById('hearts-container');
  if (!container) return;
  
  const emojis = HEART_EMOJIS[theme];
  
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
      heart.className = 'absolute text-3xl animate-theme-hearts pointer-events-none';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDuration = '2s';
      
      container.appendChild(heart);
      
      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }, 2000);
    }, i * 200);
  }
}
