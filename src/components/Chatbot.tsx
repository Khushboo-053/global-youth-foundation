import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Heart, 
  Phone, 
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { FAQS, ORG_INFO } from '../data/mockData';
import { ChatMessage } from '../types';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: 'Hello! I am GYF Assistant. How can I help you today? You can ask about our programs, submitting an anonymous grievance, tracking a complaint, donating, or becoming a member.',
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'Submit Grievance', action: 'grievance', path: '/grievance' },
        { label: 'Track Complaint', action: 'track', path: '/track-complaint' },
        { label: 'Bank Details / Donate', action: 'donate', path: '/donate' },
        { label: 'Become a Member', action: 'member', path: '/membership' },
        { label: 'Contact Phone & Email', action: 'contact', path: '/contact' }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Dynamic simulated response matcher
    setTimeout(() => {
      const reply = generateBotResponse(query);
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 500);
  };

  const generateBotResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (q.includes('donate') || q.includes('bank') || q.includes('money') || q.includes('contribute') || q.includes('ifsc') || q.includes('account')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `You can support Global Youth Foundation directly via bank transfer:\n• Bank: J&K Bank (Bemina, Srinagar)\n• Account Name: Global Youth Foundation\n• Account Number: 0372040100022589\n• IFSC: JAKA0BEMINA\n\nVisit our dedicated Donation page for one-click copy options and details.`,
        timestamp: time,
        suggestedActions: [
          { label: 'Go to Donation Page', action: 'nav_donate', path: '/donate' }
        ]
      };
    }

    if (q.includes('grievance') || q.includes('complain') || q.includes('report') || q.includes('issue')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `You can submit a grievance safely and 100% anonymously. You do not need to provide personal details unless you want to. Upon submission, you will receive a unique tracking ID (e.g., GYF-2026-847291).`,
        timestamp: time,
        suggestedActions: [
          { label: 'Submit Grievance Now', action: 'nav_grievance', path: '/grievance' },
          { label: 'Track Existing Complaint', action: 'nav_track', path: '/track-complaint' }
        ]
      };
    }

    if (q.includes('track') || q.includes('status') || q.includes('gyf-2026') || q.includes('docket')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `To track an ongoing grievance, please enter your unique Complaint ID on our dedicated tracking page. You can follow the 6-stage resolution timeline in real-time.`,
        timestamp: time,
        suggestedActions: [
          { label: 'Open Complaint Tracker', action: 'nav_track', path: '/track-complaint' }
        ]
      };
    }

    if (q.includes('member') || q.includes('join') || q.includes('volunteer') || q.includes('apply')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Global Youth Foundation welcomes young changemakers from all backgrounds! Basic volunteer membership is completely free. Fill out our simple online membership application to get involved in our leadership, environmental, and civic programs.`,
        timestamp: time,
        suggestedActions: [
          { label: 'Become a Member', action: 'nav_membership', path: '/membership' }
        ]
      };
    }

    if (q.includes('program') || q.includes('activity') || q.includes('work') || q.includes('what do you do')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `GYF runs 6 key initiatives:\n1. Youth Empowerment\n2. Human Rights Advocacy\n3. Peace & Justice\n4. Environmental Sustainability\n5. Community Development\n6. Education & Awareness`,
        timestamp: time,
        suggestedActions: [
          { label: 'Explore Programs', action: 'nav_programs', path: '/programs' }
        ]
      };
    }

    if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('address') || q.includes('office') || q.includes('location')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Official GYF Contact Information:\n• Helpline: 9103599292\n• Email: contact.gyfoffice@gmail.com\n• Regional Hub: Bemina, Srinagar, J&K`,
        timestamp: time,
        suggestedActions: [
          { label: 'Visit Contact Page', action: 'nav_contact', path: '/contact' }
        ]
      };
    }

    if (q.includes('event') || q.includes('workshop') || q.includes('campaign')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `We frequently organize Youth Leadership Seminars, Environmental Cleanups, and Human Rights Awareness Campaigns. Check our Events calendar to register or see past highlights.`,
        timestamp: time,
        suggestedActions: [
          { label: 'View Events', action: 'nav_events', path: '/events' }
        ]
      };
    }

    // Check against FAQ list
    const matchedFaq = FAQS.find(f => 
      f.question.toLowerCase().includes(q) || 
      q.split(' ').some(w => w.length > 4 && f.question.toLowerCase().includes(w))
    );

    if (matchedFaq) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `${matchedFaq.answer}`,
        timestamp: time
      };
    }

    // Default polite response
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Thank you for your question. At Global Youth Foundation, our mission is empowering youth and building a better tomorrow. You can explore our website or contact our team directly at ${ORG_INFO.phone} or ${ORG_INFO.email}.`,
      timestamp: time,
      suggestedActions: [
        { label: 'Contact Us', action: 'contact', path: '/contact' },
        { label: 'About GYF', action: 'about', path: '/about' }
      ]
    };
  };

  const handleActionClick = (action: { label: string; path?: string }) => {
    if (action.path) {
      navigate(action.path);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    } else {
      handleSendMessage(action.label);
    }
  };

  return (
    <div id="gyf-chatbot-container" className="fixed bottom-6 right-6 z-50">
      {/* Floating Launch Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          id="open-chatbot-btn"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-teal-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white shadow-xl shadow-teal-700/25 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-500/30"
          aria-label="Open GYF Assistant Chatbot"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
          </div>
          <span className="text-sm font-bold tracking-tight pr-1">
            GYF Assistant
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`w-[90vw] sm:w-[380px] bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
            isMinimized ? 'h-14' : 'h-[540px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold flex items-center gap-1.5">
                  GYF Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div className="text-[10px] text-teal-200/70">Global Youth Foundation Helpdesk</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={isMinimized ? "Maximize chatbot" : "Minimize chatbot"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                id="close-chatbot-btn"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close chatbot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-50/70 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-xs whitespace-pre-line leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-teal-600 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>

                    {/* Quick Suggestion Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {msg.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleActionClick(action)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 text-[11px] font-semibold transition-all hover:scale-102"
                          >
                            <span>{action.label}</span>
                            {action.path && <ExternalLink className="w-2.5 h-2.5 text-teal-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200 w-16 text-teal-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Disclaimer Notice */}
              <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 leading-tight text-center">
                “GYF Assistant provides basic information and guidance. For official assistance, please contact Global Youth Foundation directly.”
              </div>

              {/* Input Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about GYF..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition-all focus:outline-none"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
