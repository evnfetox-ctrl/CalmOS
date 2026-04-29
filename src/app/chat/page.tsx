"use client";

import { useState, useRef, useEffect } from 'react';
import { aiChatCounselor } from '@/ai/flows/chat-counselor-flow';
import { saveChatMessage, getChatHistory, ChatMessage } from '@/lib/db';
import { Menu, User, Plus, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history from IndexedDB
  useEffect(() => {
    async function initChat() {
      try {
        const history = await getChatHistory();
        if (history.length === 0) {
          const welcomeMsg: ChatMessage = {
            id: 'welcome',
            text: "Good morning. I'm here to support you. How are you feeling right now?",
            sender: 'ai',
            timestamp: Date.now()
          };
          await saveChatMessage(welcomeMsg);
          setMessages([welcomeMsg]);
        } else {
          setMessages(history);
        }
      } catch (err) {
        console.error("Failed to load chat", err);
      } finally {
        setLoading(false);
      }
    }
    initChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isTyping) return;

    const userMsg: ChatMessage = { 
      id: crypto.randomUUID(), 
      text: messageText, 
      sender: 'user', 
      timestamp: Date.now() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      await saveChatMessage(userMsg);
      const response = await aiChatCounselor(messageText);
      const aiMsg: ChatMessage = { 
        id: crypto.randomUUID(), 
        text: response, 
        sender: 'ai', 
        timestamp: Date.now() 
      };
      await saveChatMessage(aiMsg);
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = { 
        id: crypto.randomUUID(), 
        text: "I'm having a little trouble connecting. Let's take a deep breath together.", 
        sender: 'ai', 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 pt-6 pb-2 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-20">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-primary font-bold text-lg tracking-tight">CalmOS</h1>
        <Button variant="ghost" size="icon" className="text-slate-300">
          <User className="w-6 h-6" />
        </Button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 pb-32 no-scrollbar">
        {messages.map((msg, idx) => {
          const showTime = idx === 0 || 
            (msg.timestamp - messages[idx-1].timestamp > 1000 * 60 * 30); // 30 mins gap

          return (
            <div key={msg.id} className="space-y-2">
              {showTime && (
                <div className="flex justify-center my-6">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    {format(msg.timestamp, 'MMM d, h:mm a')}
                  </span>
                </div>
              )}
              <div className={cn("flex w-full", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] px-5 py-4 rounded-[24px] text-[15px] leading-relaxed transition-all duration-300",
                    msg.sender === 'user'
                      ? "bg-primary text-white shadow-lg shadow-primary/20 rounded-tr-none"
                      : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-50 px-4 py-3 rounded-[24px] rounded-tl-none flex gap-1 items-center border border-slate-100">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {/* Dynamic Suggestions */}
        {!isTyping && messages.length < 3 && (
          <div className="flex gap-2 justify-start flex-wrap pt-4">
            <button 
              onClick={() => handleSend("I'm feeling a bit overwhelmed.")}
              className="px-4 py-2 rounded-full bg-slate-50 text-slate-500 text-xs font-bold border border-slate-100 hover:bg-slate-100 transition-colors"
            >
              I'm overwhelmed
            </button>
            <button 
              onClick={() => handleSend("Can you help me relax?")}
              className="px-4 py-2 rounded-full bg-slate-50 text-slate-500 text-xs font-bold border border-slate-100 hover:bg-slate-100 transition-colors"
            >
              Help me relax
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-24 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg z-10">
        <div className="max-w-lg mx-auto flex items-center gap-3 bg-slate-50 rounded-full p-2 pl-4 pr-2 border border-slate-100 shadow-sm">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] text-slate-800 placeholder:text-slate-400 h-10 outline-none"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 shrink-0 transition-all active:scale-95"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
