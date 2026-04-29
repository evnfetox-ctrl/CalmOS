
"use client";

import { useRouter } from 'next/navigation';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  const handleEmotion = (emotion: string) => {
    if (emotion === 'Angry') {
      router.push('/calm');
    } else {
      router.push('/chat');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 pt-6 pb-2 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-primary font-bold text-lg tracking-tight">CalmOS</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-primary"
          onClick={() => router.push('/profile')}
        >
          <User className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 px-6 flex flex-col justify-center items-center text-center space-y-12">
        <h2 className="text-3xl font-bold text-slate-800 leading-tight">
          How are you feeling<br />right now?
        </h2>

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => handleEmotion('Angry')}
            className="w-full py-6 rounded-[24px] bg-[#FFE4E1] hover:bg-[#FFD1CC] transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-sm border border-black/5"
          >
            <span className="text-3xl">😡</span>
            <span className="text-xl font-semibold text-[#8B0000]">Angry</span>
          </button>

          <button
            onClick={() => handleEmotion('Neutral')}
            className="w-full py-6 rounded-[24px] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-sm border border-black/5"
          >
            <span className="text-3xl">😐</span>
            <span className="text-xl font-semibold text-slate-600">Neutral</span>
          </button>

          <button
            onClick={() => handleEmotion('Calm')}
            className="w-full py-6 rounded-[24px] bg-[#E0F2FE] hover:bg-[#BAE6FD] transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-sm border border-black/5"
          >
            <span className="text-3xl">🙂</span>
            <span className="text-xl font-semibold text-[#0369A1]">Calm</span>
          </button>
        </div>
      </main>
    </div>
  );
}
