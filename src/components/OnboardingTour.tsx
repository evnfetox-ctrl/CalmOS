"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { markTourAsSeen } from '@/lib/db';
import { Wind, ClipboardList, Brain, Lock, ArrowRight, Check } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to CalmOS",
    description: "Your empathetic space for emotional wellness. Let's take a quick look at how we can support you.",
    icon: <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Brain className="w-6 h-6" /></div>
  },
  {
    title: "Breathe & Center",
    description: "When emotions feel intense, our breathing guide helps you return to center with rhythmic, visual guidance.",
    icon: <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><Wind className="w-6 h-6" /></div>
  },
  {
    title: "Reflect & Grow",
    description: "Log your triggers and reactions. Over time, we'll help you spot patterns and build emotional resilience.",
    icon: <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500"><ClipboardList className="w-6 h-6" /></div>
  },
  {
    title: "Privacy First",
    description: "Your data is yours. All logs and chats stay right here in your browser's local storage. Private by design.",
    icon: <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500"><Lock className="w-6 h-6" /></div>
  }
];

export function OnboardingTour({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [open, setOpen] = useState(true);

  const handleNext = async () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await markTourAsSeen();
      setOpen(false);
      onComplete();
    }
  };

  const step = TOUR_STEPS[currentStep];

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) {
        markTourAsSeen().then(() => onComplete());
      }
      setOpen(val);
    }}>
      <DialogContent className="sm:max-w-[400px] rounded-[32px] p-8 border-none shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-6 py-4">
          {step.icon}
          
          <div className="space-y-2">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-800">{step.title}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-slate-500 leading-relaxed">
              {step.description}
            </DialogDescription>
          </div>

          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-primary' : 'w-2 bg-slate-200'}`} 
              />
            ))}
          </div>

          <Button 
            onClick={handleNext}
            className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-base shadow-lg shadow-primary/20"
          >
            {currentStep === TOUR_STEPS.length - 1 ? (
              <>Start Journey <Check className="ml-2 w-4 h-4" /></>
            ) : (
              <>Continue <ArrowRight className="ml-2 w-4 h-4" /></>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
