import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInput({ onTranscript, className }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsRecording(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, [onTranscript]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  if (!isSupported) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        className={cn("rounded-full", className)}
        title="Voice input not supported"
      >
        <MicOff className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleRecording}
      size="icon"
      className={cn(
        "rounded-full transition-all duration-300",
        isRecording 
          ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/30" 
          : "bg-romantic-primary hover:bg-romantic-secondary",
        className
      )}
      title={isRecording ? "Stop recording" : "Start voice input"}
    >
      {isRecording ? (
        <Square className="w-4 h-4 text-white" />
      ) : (
        <Mic className="w-4 h-4 text-white" />
      )}
    </Button>
  );
}

export function VoiceRecordingIndicator({ onStop }: { onStop: () => void }) {
  return (
    <div className="mt-3 p-3 bg-romantic-accent rounded-2xl flex items-center justify-center space-x-3 animate-slide-up">
      <div className="w-3 h-3 bg-romantic-primary rounded-full animate-pulse"></div>
      <span className="text-romantic-primary font-medium">Listening... Speak now</span>
      <Button
        onClick={onStop}
        size="icon"
        variant="ghost"
        className="h-6 w-6 text-romantic-primary hover:text-romantic-secondary"
      >
        <Square className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function textToSpeech(text: string) {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    
    // Try to use a more pleasant voice
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('samantha')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    speechSynthesis.speak(utterance);
  }
}
