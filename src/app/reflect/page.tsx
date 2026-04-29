"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, User } from 'lucide-react';
import { saveLog } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const TRIGGERS = ['Delay', 'Mistake', 'Argument', 'Overwhelm', 'Expectation'];

export default function ReflectPage() {
  const router = useRouter();
  const [trigger, setTrigger] = useState<string>('');
  const [reacted, setReacted] = useState<boolean | null>(null);

  const handleSave = async () => {
    if (!trigger || reacted === null) {
      toast({
        title: "Incomplete",
        description: "Please complete the reflection.",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveLog({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        trigger,
        reacted,
      });
      router.push('/insights');
    } catch (err) {
      toast({ title: "Error", description: "Could not save.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 pt-6 pb-2 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-primary font-bold text-lg tracking-tight">CalmOS</h1>
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          <img src="https://picsum.photos/seed/user123/100/100" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </header>

      <main className="flex-1 px-6 pt-8 pb-10 max-w-lg mx-auto w-full space-y-10">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Evening Reflection</span>
          <h2 className="text-3xl font-bold text-slate-800">Let's unpack that moment.</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Taking time to process helps build emotional resilience.
          </p>
        </div>

        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">What triggered this?</h3>
          <div className="flex flex-wrap gap-2">
            {TRIGGERS.map((t) => (
              <button
                key={t}
                onClick={() => setTrigger(t)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium border transition-all",
                  trigger === t
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Did you react immediately?</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setReacted(true)}
              className={cn(
                "py-5 rounded-[20px] text-lg font-bold transition-all border",
                reacted === true
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-white text-slate-500 border-slate-200"
              )}
            >
              Yes
            </button>
            <button
              onClick={() => setReacted(false)}
              className={cn(
                "py-5 rounded-[20px] text-lg font-bold transition-all border",
                reacted === false
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-white text-slate-500 border-slate-200"
              )}
            >
              No
            </button>
          </div>
        </section>

        <Button
          onClick={handleSave}
          className="w-full py-7 rounded-[20px] bg-primary hover:bg-primary/90 text-lg font-semibold shadow-xl shadow-primary/20"
        >
          Save reflection
        </Button>
      </main>
    </div>
  );
}