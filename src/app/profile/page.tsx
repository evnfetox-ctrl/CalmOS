"use client";

import { useEffect, useState, useRef } from 'react';
import { Menu, User, Download, Upload, Trash2, Save, Info, Sparkles, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  getProfile, 
  saveProfile, 
  exportAllData, 
  importData, 
  clearAllData, 
  UserProfile 
} from '@/lib/db';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    ageGroup: '',
    goals: '',
    triggers: '',
    copingMethods: '',
    preferences: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      const data = await getProfile();
      if (data) setProfile(data);
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await saveProfile(profile);
      toast({
        title: "Profile Updated",
        description: "Your settings have been saved locally.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save profile.",
      });
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calmOS-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast({ variant: "destructive", title: "Export Failed" });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        await importData(content);
        window.location.reload(); 
      } catch (err) {
        toast({ variant: "destructive", title: "Import Failed", description: "Invalid data format." });
      }
    };
    reader.readAsText(file);
  };

  const handleClear = async () => {
    if (confirm("Are you sure? This will delete all local data, logs, and chats forever.")) {
      await clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-32">
      <header className="px-6 pt-6 pb-2 flex justify-between items-center bg-white sticky top-0 z-20">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-slate-800 font-bold text-lg tracking-tight">CalmOS</h1>
        <Button variant="ghost" size="icon" className="text-primary">
          <User className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 px-6 pt-6 space-y-8 max-w-lg mx-auto w-full">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-slate-800">Your Profile</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            The more context you provide, the more empathetic and accurate my support becomes.
          </p>
        </div>

        {/* AI Personalization Guide */}
        <Card className="rounded-[28px] border-none bg-blue-50/50 p-6 space-y-4 border border-blue-100/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Personalization Guide</span>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[13px] text-blue-700 leading-relaxed">
                <span className="font-bold italic">Why fill this out?</span> Your counselor uses this data to tailor its advice. Mentioning "work stress" specifically helps it avoid generic wellness tips.
              </p>
            </div>
            <div className="flex gap-3">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[13px] text-blue-700 leading-relaxed">
                <span className="font-bold italic">Tone matters.</span> If you prefer direct feedback over gentle validation, specify "Direct and Clinical" in Communication Tone.
              </p>
            </div>
          </div>
        </Card>

        {/* Profile Info */}
        <section className="space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Name</Label>
                <Input 
                  id="name"
                  placeholder="e.g. Alex"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="rounded-[16px] border-slate-100 bg-slate-50/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Age Group</Label>
                <Select 
                  value={profile.ageGroup} 
                  onValueChange={(val) => setProfile({...profile, ageGroup: val})}
                >
                  <SelectTrigger className="rounded-[16px] border-slate-100 bg-slate-50/50 h-12">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teen">Teen (13-19)</SelectItem>
                    <SelectItem value="young-adult">Young Adult (20-29)</SelectItem>
                    <SelectItem value="adult">Adult (30-59)</SelectItem>
                    <SelectItem value="senior">Senior (60+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <Label htmlFor="goals" className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Wellness Goals</Label>
                <span className="text-[9px] text-slate-400 italic">Example: "React less to work emails"</span>
              </div>
              <Textarea 
                id="goals"
                placeholder="What are you hoping to achieve? This helps the AI set meaningful intentions with you."
                value={profile.goals}
                onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
                className="rounded-[20px] border-slate-100 bg-slate-50/50 min-h-[100px] resize-none p-4"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <Label htmlFor="triggers" className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Typical Triggers</Label>
                <span className="text-[9px] text-slate-400 italic">Example: "Loud noises, feeling ignored"</span>
              </div>
              <Textarea 
                id="triggers"
                placeholder="What usually causes intense emotions for you? Knowing this allows the AI to provide specific preemptive advice."
                value={profile.triggers}
                onChange={(e) => setProfile({ ...profile, triggers: e.target.value })}
                className="rounded-[20px] border-slate-100 bg-slate-50/50 min-h-[100px] resize-none p-4"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <Label htmlFor="coping" className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Current Coping Methods</Label>
                <span className="text-[9px] text-slate-400 italic">Example: "I walk for 5 minutes"</span>
              </div>
              <Textarea 
                id="coping"
                placeholder="What do you already do that helps? The AI will suggest these back to you when you're overwhelmed."
                value={profile.copingMethods}
                onChange={(e) => setProfile({ ...profile, copingMethods: e.target.value })}
                className="rounded-[20px] border-slate-100 bg-slate-50/50 min-h-[100px] resize-none p-4"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <Label htmlFor="prefs" className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Communication Tone</Label>
                <span className="text-[9px] text-slate-400 italic">Example: "Supportive and gentle"</span>
              </div>
              <Textarea 
                id="prefs"
                placeholder="How should I talk to you? (e.g., direct, friendly, clinical, or like a wise mentor)"
                value={profile.preferences}
                onChange={(e) => setProfile({ ...profile, preferences: e.target.value })}
                className="rounded-[20px] border-slate-100 bg-slate-50/50 min-h-[100px] resize-none p-4"
              />
            </div>
          </div>

          <Button 
            onClick={handleSave}
            className="w-full py-7 rounded-[24px] bg-primary hover:bg-primary/90 font-bold shadow-xl shadow-primary/20 text-lg transition-all active:scale-95"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Profile
          </Button>
        </section>

        {/* Data Management */}
        <section className="pt-8 space-y-6">
          <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Security & Privacy</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 border-slate-100 bg-slate-50/30 flex flex-col items-center justify-center space-y-3 rounded-[24px]">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-500" />
              </div>
              <Button 
                variant="ghost" 
                onClick={handleExport}
                className="text-xs font-bold text-slate-600 p-0 h-auto"
              >
                Export JSON
              </Button>
            </Card>
            
            <Card className="p-4 border-slate-100 bg-slate-50/30 flex flex-col items-center justify-center space-y-3 rounded-[24px]">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Upload className="w-5 h-5 text-emerald-500" />
              </div>
              <Button 
                variant="ghost" 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-slate-600 p-0 h-auto"
              >
                Import Data
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json" 
                onChange={handleImport} 
              />
            </Card>
          </div>

          <Button 
            variant="ghost" 
            onClick={handleClear}
            className="w-full py-6 rounded-[24px] text-red-500 hover:text-red-600 hover:bg-red-50 font-bold border border-transparent hover:border-red-100"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All Data
          </Button>
        </section>

        <p className="text-center text-[10px] text-slate-400 leading-relaxed px-8 pb-10">
          Your data is yours. It's stored locally in your browser and never leaves this device unless you export it.
        </p>
      </main>
    </div>
  );
}