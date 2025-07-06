'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'lucide-react';
import { UserInputParser } from '@/lib/user-parser';
import { ParsedUserData, UserProfile } from '@/types/user-profile';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  language: 'en' | 'ur';
  parsedData?: ParsedUserData;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setMessages([
        {
          id: '1',
          text: "Hello! I'm your AI assistant for government programs. I can help you discover scholarships, grants, loans, and skill training opportunities. Please tell me about yourself (age, education, location, goals).",
          sender: 'ai',
          timestamp: new Date(),
          language: 'en',
        },
      ]);
      setIsInitialized(true);
    }
  }, [isInitialized]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [isListening, setIsListening] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      language,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Send message to AI chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          userProfile: userProfile || {},
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      // Update user profile with enhanced data
      if (data.profile) {
        const updatedProfile: UserProfile = {
          id: userProfile?.id || Date.now().toString(),
          ...data.profile,
          createdAt: userProfile?.createdAt || new Date(),
          updatedAt: new Date(),
        };
        setUserProfile(updatedProfile);
      }

      // Create AI response message
      let responseText = data.message;

      // Add program recommendations if available
      if (data.programs && data.programs.length > 0) {
        responseText += '\n\n**Recommended Programs:**\n';
        data.programs.forEach((program: any, index: number) => {
          responseText += `\n${index + 1}. **${program.title}**\n`;
          responseText += `   Category: ${program.category}\n`;
          responseText += `   Description: ${program.description}\n`;
          if (program.funding_amount) {
            responseText += `   Funding: ${program.funding_amount.min.toLocaleString()} - ${program.funding_amount.max.toLocaleString()} ${
              program.funding_amount.currency
            }\n`;
          }
          if (program.application_deadline) {
            responseText += `   Deadline: ${new Date(
              program.application_deadline
            ).toLocaleDateString()}\n`;
          }
          responseText += `   [Apply Here](${program.application_url})\n`;
        });
      }

      // Add suggestions if available
      if (data.suggestions && data.suggestions.length > 0) {
        responseText += '\n\n**To help you better, please provide:**\n';
        data.suggestions.forEach((suggestion: string) => {
          responseText += `• ${suggestion}\n`;
        });
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
        language,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing message:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          language === 'en'
            ? 'I apologize, but I encountered an error processing your message. Please try again.'
            : 'معذرت، لیکن آپ کے پیغام کو پروسیس کرنے میں ایک خرابی آئی۔ براہ کرم دوبارہ کوشش کریں۔',
        sender: 'ai',
        timestamp: new Date(),
        language,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterClick = (category: string) => {
    const filterMessages = {
      scholarships: {
        en: "I'm looking for scholarships and educational opportunities. I'm a student seeking financial support for my studies.",
        ur: 'میں وظائف اور تعلیمی مواقع تلاش کر رہا ہوں۔ میں ایک طالب علم ہوں جو اپنی تعلیم کے لیے مالی مدد چاہتا ہوں۔',
      },
      loans: {
        en: 'I need business loans or financial assistance for starting or expanding my business.',
        ur: 'مجھے کاروبار شروع کرنے یا بڑھانے کے لیے کاروباری قرضے یا مالی امداد کی ضرورت ہے۔',
      },
      training: {
        en: "I'm interested in skill training programs and vocational courses to improve my employability.",
        ur: 'میں اپنی ملازمت کی صلاحیت کو بہتر بنانے کے لیے ہنر کی تربیت کے پروگرام اور پیشہ ورانہ کورسز میں دلچسپی رکھتا ہوں۔',
      },
      employment: {
        en: "I'm looking for employment opportunities and job placement programs.",
        ur: 'میں ملازمت کے مواقع اور نوکری کی ترتیب کے پروگرام تلاش کر رہا ہوں۔',
      },
      housing: {
        en: 'I need housing assistance and affordable housing programs.',
        ur: 'مجھے رہائشی امداد اور سستی رہائش کے پروگراموں کی ضرورت ہے۔',
      },
      healthcare: {
        en: "I'm looking for healthcare support and medical assistance programs.",
        ur: 'میں صحت کی دیکھ بھال کی مدد اور طبی امداد کے پروگرام تلاش کر رہا ہوں۔',
      },
    };

    const message =
      filterMessages[category as keyof typeof filterMessages]?.[language] ||
      filterMessages.scholarships[language];
    setInputText(message);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = language === 'en' ? 'en-US' : 'ur-PK';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const showUserProfile = () => {
    if (!userProfile) return null;

    return (
      <Card className="mb-4 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              {language === 'en' ? 'Your Profile' : 'آپ کا پروفائل'}
            </span>
          </div>
          <div className="text-xs text-blue-700 space-y-1">
            {userProfile.age && (
              <div>
                {language === 'en' ? 'Age' : 'عمر'}: {userProfile.age}
              </div>
            )}
            {userProfile.education && (
              <div>
                {language === 'en' ? 'Education' : 'تعلیم'}:{' '}
                {userProfile.education.replace('_', ' ')}
              </div>
            )}
            {userProfile.location && (
              <div>
                {language === 'en' ? 'Location' : 'مقام'}:{' '}
                {typeof userProfile.location === 'string'
                  ? userProfile.location
                  : `${userProfile.location.city || ''}${
                      userProfile.location.city && userProfile.location.country
                        ? ', '
                        : ''
                    }${userProfile.location.country || ''}`}
              </div>
            )}
            {userProfile.goals && (
              <div>
                {language === 'en' ? 'Goals' : 'اہداف'}:{' '}
                {typeof userProfile.goals === 'string'
                  ? userProfile.goals
                  : Array.isArray(userProfile.goals)
                  ? userProfile.goals.join(', ')
                  : userProfile.goals}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {language === 'en' ? 'Sahulat AI Assistant' : 'سہولت AI اسسٹنٹ'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-1"
              >
                <Languages className="h-4 w-4" />
                {language === 'en' ? 'اردو' : 'English'}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {language === 'en'
              ? 'Discover government programs, scholarships, and opportunities'
              : 'حکومتی پروگرام، وظائف اور مواقع دریافت کریں'}
          </p>
        </CardHeader>
      </Card>

      {/* User Profile Display */}
      {showUserProfile()}

      {/* Filter Buttons */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              {language === 'en' ? 'Quick Filters' : 'فوری فلٹرز'}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterClick('scholarships')}
              className="flex items-center gap-1 text-xs h-8"
            >
              <GraduationCap className="h-3 w-3" />
              {language === 'en' ? 'Scholarships' : 'وظائف'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterClick('loans')}
              className="flex items-center gap-1 text-xs h-8"
            >
              <DollarSign className="h-3 w-3" />
              {language === 'en' ? 'Loans' : 'قرضے'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterClick('training')}
              className="flex items-center gap-1 text-xs h-8"
            >
              <BookOpen className="h-3 w-3" />
              {language === 'en' ? 'Training' : 'تربیت'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterClick('employment')}
              className="flex items-center gap-1 text-xs h-8"
            >
              <Briefcase className="h-3 w-3" />
              {language === 'en' ? 'Jobs' : 'ملازمتیں'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterClick('housing')}
              className="flex items-center gap-1 text-xs h-8"
            >
              <Home className="h-3 w-3" />
              {language === 'en' ? 'Housing' : 'رہائش'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterClick('healthcare')}
              className="flex items-center gap-1 text-xs h-8"
            >
              <Heart className="h-3 w-3" />
              {language === 'en' ? 'Healthcare' : 'صحت'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p
                    className="text-sm whitespace-pre-line"
                    dir={message.language === 'ur' ? 'rtl' : 'ltr'}
                  >
                    {message.text}
                  </p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">
                      {language === 'en'
                        ? 'Analyzing your information...'
                        : 'آپ کی معلومات کا تجزیہ کر رہا ہے...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                language === 'en'
                  ? 'Tell me about yourself (age, education, location, goals)...'
                  : 'اپنے بارے میں بتائیں (عمر، تعلیم، مقام، اہداف)...'
              }
              className="flex-1"
              dir={language === 'ur' ? 'rtl' : 'ltr'}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={startVoiceInput}
              disabled={isListening}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
