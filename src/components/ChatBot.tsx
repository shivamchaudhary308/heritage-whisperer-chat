import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Trash2, Send, Bot, User, Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Language {
  code: string;
  name: string;
  voice: string;
}

interface ChatBotProps {
  className?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I assist you today? If you\'re looking for information about cultural heritage sites or programs, feel free to ask!',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Available languages for TTS
  const languages: Language[] = [
    { code: 'en', name: 'English', voice: 'EXAVITQu4vr4xnSDxMaL' },
    { code: 'es', name: 'Spanish', voice: 'TX3LPaxmHKxFdv7VOQHJ' },
    { code: 'fr', name: 'French', voice: 'N2lVS1w4EtoT3dr4eOWO' },
    { code: 'de', name: 'German', voice: 'CwhRBWXzGAHq8TQ4Fs17' },
    { code: 'it', name: 'Italian', voice: 'JBFqnCBsd6RMkjVDRZzb' },
    { code: 'pt', name: 'Portuguese', voice: 'FGY2WhTYpPnrIDTdsKH5' },
    { code: 'zh', name: 'Chinese', voice: 'SAz9YHcvj6GT2YYXdXww' },
    { code: 'ja', name: 'Japanese', voice: 'XB0fDUnXU5powFXDhCwa' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(async () => {
      const botResponseText = generateBotResponse(inputValue);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Auto-play TTS for bot response if enabled
      if (isTTSEnabled) {
        await playTextToSpeech(botResponseText);
      }
    }, 1500);
  };

  // Text-to-Speech function (placeholder for ElevenLabs integration)
  const playTextToSpeech = async (text: string) => {
    try {
      setIsPlaying(true);
      
      // TODO: Replace with actual ElevenLabs API call
      // For now, this is a placeholder structure
      const selectedLanguage = languages.find(lang => lang.code === currentLanguage);
      
      // Placeholder: Replace this with actual ElevenLabs API call
      console.log('TTS Request:', {
        text,
        voice_id: selectedLanguage?.voice,
        model_id: 'eleven_multilingual_v2',
        language: currentLanguage
      });

      // Simulate audio playback
      setTimeout(() => {
        setIsPlaying(false);
      }, text.length * 50); // Rough estimate of speech duration

      // TODO: Implement actual ElevenLabs API integration here
      /*
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + selectedLanguage?.voice, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': 'YOUR_API_KEY_HERE' // Add your API key here
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
      }
      */
      
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
    }
  };

  const toggleTTS = () => {
    setIsTTSEnabled(!isTTSEnabled);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('heritage') || input.includes('cultural')) {
      return 'Cultural heritage sites are important historical locations that preserve our past. They include ancient monuments, archaeological sites, historic buildings, and landscapes that hold cultural significance. Is there a specific heritage site you\'d like to know more about?';
    }
    
    if (input.includes('visit') || input.includes('tour')) {
      return 'Many cultural heritage sites offer guided tours and visitor programs. These typically include educational materials, interactive exhibits, and expert guides who can share the history and significance of the location. Would you like information about visiting hours or tour bookings?';
    }
    
    if (input.includes('history') || input.includes('historical')) {
      return 'Historical sites often span thousands of years, representing different civilizations and cultures. Each site has unique stories, architectural styles, and cultural practices that provide insights into how people lived in the past. What particular historical period interests you?';
    }
    
    if (input.includes('hello') || input.includes('hi')) {
      return 'Hello there! I\'m here to help you learn about cultural heritage sites and their significance. Feel free to ask about historical monuments, archaeological discoveries, or planning visits to heritage locations.';
    }
    
    return 'That\'s an interesting question about cultural heritage! While I specialize in heritage sites and historical information, I\'d be happy to help you explore topics related to cultural preservation, historical significance, or visiting heritage locations. Could you tell me more about what you\'d like to know?';
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! How can I assist you today? If you\'re looking for information about cultural heritage sites or programs, feel free to ask!',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Chat Icon */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-primary shadow-float hover:shadow-chat transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="bg-chat-background border border-chat-border rounded-lg shadow-chat w-96 h-[32rem] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-primary p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-chat-accent-foreground/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-chat-primary-foreground" />
              </div>
              <div>
                <h3 className="text-chat-primary-foreground font-semibold">Heritage Guide</h3>
                <p className="text-chat-primary-foreground/80 text-xs">Cultural Heritage Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTTS}
                className="text-chat-primary-foreground hover:bg-chat-primary-foreground/20 h-8 w-8"
                title={isTTSEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}
              >
                {isTTSEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              {isPlaying && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={stopAudio}
                  className="text-chat-primary-foreground hover:bg-chat-primary-foreground/20 h-8 w-8"
                  title="Stop Audio"
                >
                  <VolumeX className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                className="text-chat-primary-foreground hover:bg-chat-primary-foreground/20 h-8 w-8"
                title="Clear Chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-chat-primary-foreground hover:bg-chat-primary-foreground/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-2",
                    message.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === 'bot' && (
                    <div className="h-8 w-8 rounded-full bg-chat-accent flex items-center justify-center">
                      <Bot className="h-4 w-4 text-chat-accent-foreground" />
                    </div>
                  )}
                  
                   <div className="flex flex-col space-y-2 max-w-[75%]">
                    <div
                      className={cn(
                        "p-3 rounded-lg text-sm",
                        message.sender === 'user'
                          ? "bg-chat-user-message text-white"
                          : "bg-chat-bot-message text-foreground"
                      )}
                    >
                      {message.text}
                    </div>
                    
                    {/* TTS Button for bot messages */}
                    {message.sender === 'bot' && isTTSEnabled && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => playTextToSpeech(message.text)}
                          disabled={isPlaying}
                          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Volume2 className="h-3 w-3 mr-1" />
                          {isPlaying ? 'Playing...' : 'Listen'}
                        </Button>
                      </div>
                    )}
                  </div>

                  {message.sender === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-chat-user-message flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="h-8 w-8 rounded-full bg-chat-accent flex items-center justify-center">
                    <Bot className="h-4 w-4 text-chat-accent-foreground" />
                  </div>
                  <div className="bg-chat-bot-message p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-chat-text-secondary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-chat-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-chat-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Language & TTS Settings */}
          {isTTSEnabled && (
            <div className="px-4 py-2 border-t border-chat-border bg-chat-surface/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Voice Language:</span>
                <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                  <SelectTrigger className="w-32 h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="text-xs">
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-chat-border bg-chat-surface">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about cultural heritage sites..."
                className="flex-1 border-chat-border focus:ring-chat-accent"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-chat-accent hover:bg-chat-accent/90 text-chat-accent-foreground"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Hidden audio element for TTS playback */}
          <audio ref={audioRef} style={{ display: 'none' }} />
        </div>
      )}
    </div>
  );
};

export default ChatBot;