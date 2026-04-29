"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CalmPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  useEffect(() => {
    const phases: ('Inhale' | 'Hold' | 'Exhale')[] = ['Inhale', 'Hold', 'Exhale'];
    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % phases.length;
      setPhase(phases[current]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 pt-6 pb-2 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-slate-800 font-bold text-lg tracking-tight">CalmOS</h1>
        <Button variant="ghost" size="icon" className="text-primary">
          <User className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative flex items-center justify-center w-80 h-80 mb-12">
          {/* Breathing Rings */}
          <div className="absolute w-full h-full bg-primary/5 rounded-full animate-breathe-ring" />
          <div className="absolute w-4/5 h-4/5 bg-primary/10 rounded-full animate-breathe-ring [animation-delay:1s]" />
          <div className="absolute w-3/5 h-3/5 bg-primary/20 rounded-full animate-breathe-ring [animation-delay:2s]" />
          
          {/* Core Circle */}
          <div className="w-1/3 h-1/3 bg-primary rounded-full shadow-2xl z-10 animate-breathe-core" />
        </div>

        <h2 className="text-4xl font-bold text-primary mb-16 transition-all duration-1000">
          {phase}...
        </h2>

        <div className="w-full max-w-sm space-y-6">
          <Card className="p-6 rounded-[24px] bg-slate-50 border-none flex gap-4 items-start shadow-sm">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-100">
              <span className="text-xl">🌿</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              It's completely normal to feel this way. Let's take a few deep breaths together to reset.
            </p>
          </Card>

          <Button
            onClick={() => router.push('/reflect')}
            className="w-full py-7 rounded-[20px] bg-primary hover:bg-primary/90 text-lg font-semibold shadow-xl shadow-primary/20"
          >
            Take a moment to reflect
          </Button>
        </div>
      </main>
    </div>
  );
}