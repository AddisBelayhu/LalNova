import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, AlertCircle } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello, Welcome to LalNova Technologies! What can I help you with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [spellingSuggestions, setSpellingSuggestions] = useState([]);
  const [showSpellCheck, setShowSpellCheck] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-open chatbot on website load
  useEffect(() => {
    // Check if chatbot has already auto-opened in this session
    const hasOpened = sessionStorage.getItem('chatbotAutoOpened') || localStorage.getItem('chatbotAutoOpened');
    
    if (hasOpened) {
      setHasAutoOpened(true);
      return;
    }

    // Use multiple methods to ensure cross-browser compatibility
    const autoOpenChatbot = () => {
      if (!hasAutoOpened && !document.hidden) {
        setIsOpen(true);
        setHasAutoOpened(true);
        
        // Use both sessionStorage and localStorage for better compatibility
        try {
          sessionStorage.setItem('chatbotAutoOpened', 'true');
          localStorage.setItem('chatbotAutoOpened', 'true');
        } catch (e) {
          // Fallback for browsers with storage restrictions
          console.log('Storage not available, using memory only');
        }
      }
    };

    // Multiple timing approaches for different browsers
    const timer1 = setTimeout(autoOpenChatbot, 1000);
    const timer2 = requestAnimationFrame(() => {
      setTimeout(autoOpenChatbot, 100);
    });

    // Also try on page visibility change (for browsers that delay timers)
    const handleVisibilityChange = () => {
      if (!document.hidden && !hasAutoOpened) {
        setTimeout(autoOpenChatbot, 200);
      }
    };

    // Add event listeners for better browser support
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', () => {
      if (!hasAutoOpened) {
        setTimeout(autoOpenChatbot, 100);
      }
    });

    // Cleanup function
    return () => {
      clearTimeout(timer1);
      cancelAnimationFrame(timer2);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasAutoOpened]);

  // Reset auto-open flag when user manually closes chatbot
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      // User manually closed, don't auto-open again in this session
      setHasAutoOpened(true);
    }
  };

  // Common words dictionary for spell checking
  const dictionary = [
    // Tech terms
    'software', 'development', 'consulting', 'cloud', 'integration', 'system', 'technology',
    'programming', 'database', 'website', 'application', 'mobile', 'web', 'api', 'server',
    'security', 'analytics', 'dashboard', 'platform', 'solution', 'digital', 'transformation',
    
    // Business terms
    'services', 'pricing', 'quote', 'estimate', 'project', 'portfolio', 'company', 'team',
    'contact', 'phone', 'email', 'address', 'consultation', 'meeting', 'schedule', 'time',
    
    // Common words
    'hello', 'hi', 'help', 'about', 'what', 'how', 'when', 'where', 'why', 'who',
    'can', 'could', 'would', 'should', 'will', 'need', 'want', 'like', 'know',
    'information', 'details', 'more', 'please', 'thank', 'thanks', 'good', 'great',
    'excellent', 'amazing', 'awesome', 'perfect', 'wonderful', 'fantastic'
  ];

  // Calculate Levenshtein distance for spell checking
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Find spelling suggestions
  const findSpellingSuggestions = (word) => {
    const suggestions = [];
    const lowerWord = word.toLowerCase();
    
    // Skip if word is too short or already correct
    if (word.length < 3 || dictionary.includes(lowerWord)) {
      return [];
    }
    
    dictionary.forEach(dictWord => {
      const distance = levenshteinDistance(lowerWord, dictWord);
      // Suggest words with distance of 1-2 for reasonable suggestions
      if (distance <= 2 && distance > 0) {
        suggestions.push({
          word: dictWord,
          distance: distance,
          original: word
        });
      }
    });
    
    // Sort by distance and return top 3 suggestions
    return suggestions
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  };

  // Check spelling of entire message
  const checkSpelling = (message) => {
    const words = message.split(/\s+/);
    const suggestions = [];
    
    words.forEach(word => {
      // Remove punctuation for checking
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 0) {
        const wordSuggestions = findSpellingSuggestions(cleanWord);
        if (wordSuggestions.length > 0) {
          suggestions.push(...wordSuggestions);
        }
      }
    });
    
    return suggestions;
  };

  // Auto-correct message
  const autoCorrectMessage = (message, suggestions) => {
    let correctedMessage = message;
    
    suggestions.forEach(suggestion => {
      if (suggestion.distance === 1) { // Only auto-correct very close matches
        const regex = new RegExp(`\\b${suggestion.original}\\b`, 'gi');
        correctedMessage = correctedMessage.replace(regex, suggestion.word);
      }
    });
    
    return correctedMessage;
  };

  // Handle input change with spell checking
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputMessage(value);
    
    // Check spelling as user types (debounced)
    if (value.trim().length > 0) {
      const suggestions = checkSpelling(value);
      setSpellingSuggestions(suggestions);
      setShowSpellCheck(suggestions.length > 0);
    } else {
      setSpellingSuggestions([]);
      setShowSpellCheck(false);
    }
  };

  // Apply spelling suggestion
  const applySuggestion = (suggestion) => {
    const regex = new RegExp(`\\b${suggestion.original}\\b`, 'gi');
    const correctedMessage = inputMessage.replace(regex, suggestion.word);
    setInputMessage(correctedMessage);
    setSpellingSuggestions([]);
    setShowSpellCheck(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    greeting: [
      'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'
    ],
    services: [
      'services', 'what do you do', 'what services', 'offerings', 'solutions', 'development time'
    ],
    contact: [
      'contact', 'phone', 'email', 'address', 'reach', 'get in touch'
    ],
    pricing: [
      'price', 'cost', 'pricing', 'quote', 'estimate', 'budget'
    ],
    about: [
      'about', 'company', 'who are you', 'team', 'history'
    ],
    projects: [
      'projects', 'portfolio', 'work', 'examples', 'case studies'
    ],
    development_time: [
      'bellow three months', 'between 3 to 6 months', 'more than 6 months', 'more than a year', 'it nees further discussion'
    ]

  };

  const responses = {
    greeting: "Hello! Welcome to LalNova Technologies. We're here to help you with your technology needs. What would you like to know about our services?",
    services: "We offer comprehensive technology solutions including:\n• Custom Software Development\n• IT Consulting\n• Cloud Solutions\n• System Integration\n• Digital Transformation\n\nWould you like to know more about any specific service?",
    contact: "You can reach us at:\n📧 Email: info@lalnova.com\n📞 Phone: +1 (555) 123-4567\n📍 Address: 123 Tech Street, Innovation City\n\nOr you can fill out our contact form and we'll get back to you within 24 hours!",
    pricing: "Our pricing varies based on project scope and requirements. We offer competitive rates and flexible packages. Would you like to schedule a free consultation to discuss your specific needs and get a custom quote?",
    about: "LalNova Technologies is a forward-thinking tech company founded in 2025. We specialize in building modern solutions for businesses. Our team of experts is dedicated to delivering innovative technology solutions that drive growth and digital transformation.",
    projects: "We've successfully completed 50+ projects across various industries. Our portfolio includes e-commerce platforms, healthcare management systems, and financial analytics dashboards. Visit our Projects page to see our latest work!",
    development_time: "complicated systems take morethan 6 monthes, medium ones take 3 to 6 monthes and siple website take up to 4 weeks",
    default: "I understand you're asking about that topic. For detailed information, I'd recommend:\n• Browsing our website sections\n• Contacting our team directly\n• Scheduling a consultation\n\nIs there anything specific about our services I can help you with?"
  };

  const quickReplies = [
    "Our Services",
    "Contact Info",
    "Get Quote",
    "View Projects"
  ];

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    for (const [category, keywords] of Object.entries(predefinedResponses)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return responses[category];
      }
    }
    
    return responses.default;
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleToggleChat}
          className="bg-primary hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl z-40 flex flex-col">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-xl flex items-center">
            <Bot className="mr-2" size={20} />
            <div>
              <h3 className="font-semibold">LalBot</h3>
              <p className="text-xs opacity-90">Online • Typically replies instantly</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                    {message.sender === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
                    <div>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot size={16} />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            {/* Spelling Suggestions */}
            {showSpellCheck && spellingSuggestions.length > 0 && (
              <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle size={14} className="text-yellow-600 mr-1" />
                  <span className="text-xs text-yellow-700 font-medium">Spelling suggestions:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {spellingSuggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => applySuggestion(suggestion)}
                      className="px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs rounded transition-colors"
                      title={`Replace "${suggestion.original}" with "${suggestion.word}"`}
                    >
                      {suggestion.original} → {suggestion.word}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // Auto-correct before sending if there are close matches
                      const suggestions = checkSpelling(inputMessage);
                      const correctedMessage = autoCorrectMessage(inputMessage, suggestions);
                      handleSendMessage(correctedMessage);
                      setSpellingSuggestions([]);
                      setShowSpellCheck(false);
                    }
                  }}
                  placeholder="Type your message..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
                    showSpellCheck ? 'border-yellow-300' : 'border-gray-300'
                  }`}
                />
                {showSpellCheck && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <AlertCircle size={16} className="text-yellow-500" />
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  // Auto-correct before sending if there are close matches
                  const suggestions = checkSpelling(inputMessage);
                  const correctedMessage = autoCorrectMessage(inputMessage, suggestions);
                  handleSendMessage(correctedMessage);
                  setSpellingSuggestions([]);
                  setShowSpellCheck(false);
                }}
                disabled={!inputMessage.trim()}
                className="bg-primary hover:bg-teal-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;