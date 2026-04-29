"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveLog } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export default function ReflectPage() {
  const router = useRouter();
  const [trigger, setTrigger] = useState<string>('');
  const [reacted, setReacted] = useState<string>('');

  const handleSave = async () => {
    if (!trigger || !reacted) {
      toast({
        title: "Incomplete",
        description: "Please select both a trigger and whether you reacted.",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveLog({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        trigger,
        reacted: reacted === 'yes',
      });
      
      toast({
        title: "Reflection Saved",
        description: "Your log has been stored locally.",
      });
      router.push('/insights');
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not save your reflection.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="px-6 pt-12 pb-10 max-w-lg mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-foreground/90">Self Reflection</h1>
        <p className="text-muted-foreground mt-2">Let's understand what happened.</p>
      </header>

      <Card className="rounded-[24px] border-black/5 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">What triggered this?</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={trigger} onValueChange={setTrigger} className="grid grid-cols-1 gap-3">
            {['Delay', 'Mistake', 'Argument', 'Other'].map((option) => (
              <div key={option} className="flex items-center space-x-3 p-4 rounded-xl border border-black/5 bg-background/50">
                <RadioGroupItem value={option} id={`trigger-${option}`} />
                <Label htmlFor={`trigger-${option}`} className="flex-1 cursor-pointer text-lg">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="rounded-[24px] border-black/5 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Did you react immediately?</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={reacted} onValueChange={setReacted} className="grid grid-cols-2 gap-4">
            {['yes', 'no'].map((val) => (
              <div key={val} className="flex flex-col items-center justify-center p-6 rounded-xl border border-black/5 bg-background/50 transition-all hover:bg-white">
                <RadioGroupItem value={val} id={`reacted-${val}`} className="sr-only" />
                <Label
                  htmlFor={`reacted-${val}`}
                  className={`cursor-pointer text-xl font-bold uppercase transition-colors ${reacted === val ? 'text-primary' : 'text-muted-foreground/50'}`}
                >
                  {val === 'yes' ? 'Yes' : 'No'}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        className="w-full h-14 rounded-[20px] text-lg font-semibold bg-primary shadow-lg"
      >
        Complete Reflection
      </Button>
    </div>
  );
}
