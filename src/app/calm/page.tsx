"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { realtimeCalmingResponse } from '@/ai/flows/realtime-calming-response-flow';
import { Button } from '@/components/ui/button';

export default function CalmPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [aiMessage, setAiMessage] = useState<string>('Finding a moment of peace...');
  const [showReflect, setShowReflect] = useState(false);

  useEffect(() => {
    // Breathing cycle
    const phases: ('Inhale' | 'Hold' | 'Exhale')[] = ['Inhale', 'Hold', 'Exhale'];
    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % phases.length;
      setPhase(phases[current]);
    }, 4000);

    // Initial AI response
    async function loadAi() {
      try {
        const { response } = await realtimeCalmingResponse({ trigger: 'Sudden feeling of intense anger' });
        setAiMessage(response);
      } catch (err) {
        setAiMessage("Take a deep breath. You are safe, and this feeling will pass.");
      }
    }
    loadAi();

    // Show reflect button after 10s
    const timer = setTimeout(() => {
      setShowReflect(true);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="px-6 pt-16 h-[100dvh] bg-[#F5F5F7] flex flex-col items-center text-center overflow-hidden">
      <div className="mt-12 space-y-12 flex flex-col items-center w-full max-w-md">
        <h2 className="text-4xl font-bold text-foreground/80 animate-pulse">{phase}...</h2>
        
        <div className="relative flex items-center justify-center w-64 h-64">
          <div className="absolute w-full h-full bg-primary/20 rounded-full animate-breathe" />
          <div className="absolute w-3/4 h-3/4 bg-primary/40 rounded-full animate-breathe [animation-delay:0.2s]" />
          <div className="absolute w-1/2 h-1/2 bg-primary rounded-full shadow-xl animate-breathe [animation-delay:0.4s]" />
        </div>

        <div className="px-4 py-8 bg-white/50 backdrop-blur-sm rounded-[24px] shadow-sm border border-black/5 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <p className="text-lg font-medium text-foreground/70 leading-relaxed italic">
            "{aiMessage}"
          </p>
        </div>

        {showReflect && (
          <div className="mt-auto pb-12 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Button
              onClick={() => router.push('/reflect')}
              className="w-full h-14 rounded-[20px] text-lg font-semibold bg-primary hover:bg-primary/90 transition-all shadow-lg"
            >
              Reflect on this
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
