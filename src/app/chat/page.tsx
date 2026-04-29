"use client";

import { useState, useRef, useEffect } from 'react';
import { aiChatCounselor } from '@/ai/flows/chat-counselor-flow';
import { Menu, User, Plus, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  time?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: "Good morning. I noticed your heart rate was a bit elevated earlier. How are you feeling right now?", 
      sender: 'ai',
      time: 'Today, 9:41 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiChatCounselor(input);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), text: response, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = { id: (Date.now() + 1).toString(), text: "I'm here to listen. Let's take a deep breath together.", sender: 'ai' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

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

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
        {messages.map((msg, idx) => (
          <div key={msg.id} className="space-y-2">
            {msg.time && (
              <div className="flex justify-center my-4">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{msg.time}</span>
              </div>
            )}
            <div className={cn("flex w-full", msg.sender === 'user' ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] px-5 py-4 rounded-[24px] text-[15px] leading-relaxed",
                  msg.sender === 'user'
                    ? "bg-primary text-white shadow-lg shadow-primary/20 rounded-tr-none"
                    : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100"
                )}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-50 px-4 py-3 rounded-[24px] rounded-tl-none flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {/* Message Suggestions */}
        {!isTyping && messages.length === 1 && (
          <div className="flex gap-2 justify-start flex-wrap pt-4">
            <button className="px-4 py-2 rounded-full bg-slate-50 text-slate-500 text-xs font-bold border border-slate-100 hover:bg-slate-100 transition-colors">
              Yes, let's breathe
            </button>
            <button className="px-4 py-2 rounded-full bg-slate-50 text-slate-500 text-xs font-bold border border-slate-100 hover:bg-slate-100 transition-colors">
              Not right now
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-24 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg">
        <div className="max-w-lg mx-auto flex items-center gap-3 bg-slate-50 rounded-full p-2 pl-4 pr-2 border border-slate-100 shadow-sm">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] text-slate-800 placeholder:text-slate-400 h-10"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 shrink-0"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}