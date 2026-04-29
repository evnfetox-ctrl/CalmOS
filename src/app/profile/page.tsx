"use client";

import { useEffect, useState, useRef } from 'react';
import { Menu, User, Download, Upload, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
    goals: '',
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
        window.location.reload(); // Refresh to reload all state
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
      <header className="px-6 pt-6 pb-2 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-slate-800 font-bold text-lg tracking-tight">CalmOS</h1>
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
          <img src="https://picsum.photos/seed/user123/100/100" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </header>

      <main className="flex-1 px-6 pt-6 space-y-8 max-w-lg mx-auto w-full">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-slate-800">Settings</h2>
          <p className="text-slate-500 text-sm">Personalize your AI wellness experience.</p>
        </div>

        {/* Profile Info */}
        <section className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold uppercase text-slate-400 tracking-widest">Display Name</Label>
            <Input 
              id="name"
              placeholder="How should I address you?"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="rounded-[16px] border-slate-100 bg-slate-50/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals" className="text-xs font-bold uppercase text-slate-400 tracking-widest">Wellness Goals</Label>
            <Textarea 
              id="goals"
              placeholder="e.g., Build resilience, manage stress at work..."
              value={profile.goals}
              onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
              className="rounded-[16px] border-slate-100 bg-slate-50/50 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prefs" className="text-xs font-bold uppercase text-slate-400 tracking-widest">Communication Preference</Label>
            <Textarea 
              id="prefs"
              placeholder="e.g., Be direct, focus on breathing techniques, use gentle tone..."
              value={profile.preferences}
              onChange={(e) => setProfile({ ...profile, preferences: e.target.value })}
              className="rounded-[16px] border-slate-100 bg-slate-50/50 min-h-[100px]"
            />
          </div>

          <Button 
            onClick={handleSave}
            className="w-full py-6 rounded-[20px] bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </section>

        {/* Data Management */}
        <section className="pt-8 space-y-4">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Data & Privacy</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="rounded-[20px] py-6 border-slate-100 hover:bg-slate-50 text-slate-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="rounded-[20px] py-6 border-slate-100 hover:bg-slate-50 text-slate-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={handleImport} 
            />
          </div>

          <Button 
            variant="ghost" 
            onClick={handleClear}
            className="w-full py-6 rounded-[20px] text-red-500 hover:text-red-600 hover:bg-red-50 font-bold"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Local Data
          </Button>
        </section>

        <p className="text-center text-[10px] text-slate-400 leading-relaxed px-4">
          Your data is stored securely in your browser's IndexedDB. 
          CalmOS does not store your private logs on its servers.
        </p>
      </main>
    </div>
  );
}
