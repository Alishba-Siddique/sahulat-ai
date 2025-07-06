'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Mic,
  MicOff,
  Languages,
  User,
  Info,
  GraduationCap,
  Briefcase,
  Home,
  Heart,
  BookOpen,
  DollarSign,
  ExternalLink,
  Database,
  Globe,
  Loader2,
} from 'lucide-react';
import { UserInputParser } from '@/lib/user-parser';
import { ParsedUserData, UserProfile } from '@/types/user-profile';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  programs?: any[];
  webResults?: string[];
  suggestions?: string[];
  confidence?: number;
}

interface ChatInterfaceProps {
  onProfileUpdate?: (profile: any) => void;
}

export default function ChatInterface({ onProfileUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Assalam-o-alaikum! I'm Sahulat AI, your government program discovery assistant. I can help you find scholarships, loans, training programs, and employment opportunities in Pakistan. What are you looking for today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userProfile, setUserProfile] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          userProfile,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          isUser: false,
          timestamp: new Date(),
          programs: data.recommendedPrograms || [],
          webResults: data.webResults || [],
          suggestions: data.suggestions || [],
          confidence: data.confidence,
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Update user profile if provided
        if (data.profile) {
          setUserProfile((prev: any) => ({ ...prev, ...data.profile }));
          onProfileUpdate?.(data.profile);
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text:
            data.message || 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please check your internet connection and try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleFilterClick = (filter: string) => {
    const filterMessages = {
      scholarships:
        "I'm looking for scholarships for higher education. Can you help me find available opportunities?",
      loans:
        'I need information about government loan programs for small business or personal use.',
      training:
        "I'm interested in skill development and training programs offered by the government.",
      employment:
        "I'm looking for government job opportunities and employment programs.",
      housing:
        'I need information about government housing schemes and affordable housing programs.',
      healthcare:
        "I'm looking for government healthcare programs and medical assistance schemes.",
    };

    setInputValue(
      filterMessages[filter as keyof typeof filterMessages] || filter
    );
  };

  const renderPrograms = (programs: any[]) => {
    if (!programs || programs.length === 0) return null;

    return (
      <div className="mt-4 space-y-3">
        <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Programs from Database
        </h4>
        {programs.map((program, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{program.title}</CardTitle>
              <CardDescription className="text-xs">
                <Badge variant="outline" className="text-xs">
                  {program.category}
                </Badge>
                {program.funding_amount && (
                  <span className="ml-2 text-green-600 font-medium">
                    Up to {program.funding_amount}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-2">
                {program.description}
              </p>
              {program.eligibility_criteria && (
                <p className="text-xs text-gray-500">
                  <strong>Eligibility:</strong> {program.eligibility_criteria}
                </p>
              )}
              {program.application_deadline && (
                <p className="text-xs text-red-600 mt-1">
                  <strong>Deadline:</strong>{' '}
                  {new Date(program.application_deadline).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderWebResults = (webResults: string[]) => {
    if (!webResults || webResults.length === 0) return null;

    return (
      <div className="mt-4 space-y-3">
        <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Additional Online Opportunities
        </h4>
        {webResults.map((url, index) => (
          <Card key={index} className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {url}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Found through web search
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(url, '_blank')}
                  className="ml-2"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Filter Buttons */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {[
            'scholarships',
            'loans',
            'training',
            'employment',
            'housing',
            'healthcare',
          ].map((filter) => (
            <Button
              key={filter}
              variant="outline"
              size="sm"
              onClick={() => handleFilterClick(filter)}
              className="text-xs capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>

              {/* Render programs from database */}
              {renderPrograms(message.programs || [])}

              {/* Render web search results */}
              {renderWebResults(message.webResults || [])}

              {/* Confidence indicator */}
              {message.confidence && (
                <div className="mt-2 text-xs opacity-70">
                  Confidence: {Math.round(message.confidence * 100)}%
                </div>
              )}

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium mb-2">
                    To improve recommendations:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {message.suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600">
                  Searching for programs...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about government programs, scholarships, loans, training, or jobs..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
