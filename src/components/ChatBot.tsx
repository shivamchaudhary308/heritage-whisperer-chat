import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Trash2, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
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
        <div className="bg-chat-background border border-chat-border rounded-lg shadow-chat w-80 h-96 flex flex-col overflow-hidden">
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
                  
                  <div
                    className={cn(
                      "max-w-[70%] p-3 rounded-lg text-sm",
                      message.sender === 'user'
                        ? "bg-chat-user-message text-white"
                        : "bg-chat-bot-message text-foreground"
                    )}
                  >
                    {message.text}
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
        </div>
      )}
    </div>
  );
};

export default ChatBot;