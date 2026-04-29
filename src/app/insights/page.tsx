
"use client";

import { useEffect, useState, useMemo } from 'react';
import { getLogs, AngerLog } from '@/lib/db';
import { generatePersonalizedInsights, type PersonalizedInsightsOutput } from '@/ai/flows/personalized-insights-flow';
import { Menu, User, TrendingUp, Clock, Target, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { useRouter } from 'next/navigation';

export default function InsightsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AngerLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<PersonalizedInsightsOutput | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getLogs();
        setLogs(data.sort((a, b) => a.timestamp - b.timestamp));
        
        // Trigger AI insights if we have enough data
        if (data.length >= 2) {
          setGeneratingAi(true);
          const insights = await generatePersonalizedInsights({ 
            jsonData: JSON.stringify(data.slice(-10)) // Send last 10 logs for context
          });
          setAiInsights(insights);
        }
      } catch (err) {
        console.error("Failed to load insights", err);
      } finally {
        setLoading(false);
        setGeneratingAi(false);
      }
    }
    loadData();
  }, []);

  // Process Stats
  const stats = useMemo(() => {
    if (logs.length === 0) return { controlRate: 0, topTrigger: 'None', freqTime: 'N/A' };

    const controlled = logs.filter(l => !l.reacted).length;
    const rate = (controlled / logs.length) * 100;

    const triggers: Record<string, number> = {};
    const hours: Record<number, number> = {};

    logs.forEach(log => {
      triggers[log.trigger] = (triggers[log.trigger] || 0) + 1;
      const hour = new Date(log.timestamp).getHours();
      hours[hour] = (hours[hour] || 0) + 1;
    });

    const topT = Object.entries(triggers).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    const topH = Object.entries(hours).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    const hourNum = parseInt(topH as string);
    const timeDisplay = isNaN(hourNum) ? 'N/A' : 
      `${hourNum % 12 === 0 ? 12 : hourNum % 12}:00 ${hourNum >= 12 ? 'PM' : 'AM'}`;

    return { controlRate: rate, topTrigger: topT, freqTime: timeDisplay };
  }, [logs]);

  // Weekly Chart Data (Last 7 Days)
  const chartData = useMemo(() => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const now = new Date();
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      return {
        day: days[d.getDay()],
        dateStr: d.toDateString(),
        count: 0
      };
    });

    logs.forEach(log => {
      const logDate = new Date(log.timestamp).toDateString();
      const match = last7.find(d => d.dateStr === logDate);
      if (match) match.count++;
    });

    return last7;
  }, [logs]);

  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-white min-h-screen">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-32 w-full rounded-[32px]" />
        <Skeleton className="h-64 w-full rounded-[32px]" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full rounded-[24px]" />
          <Skeleton className="h-32 w-full rounded-[24px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-32">
      <header className="px-6 pt-6 pb-2 flex justify-between items-center bg-white sticky top-0 z-20">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-slate-800 font-bold text-lg tracking-tight">CalmOS</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-primary"
          onClick={() => router.push('/profile')}
        >
          <User className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 px-6 pt-6 space-y-8 max-w-lg mx-auto w-full">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-slate-800">Insights</h2>
          <p className="text-slate-500 text-sm">Real-time analysis of your emotional journey.</p>
        </div>

        {/* AI Insight Section */}
        {logs.length > 0 && (
          <Card className="rounded-[32px] border-none bg-primary/5 p-6 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">AI Wellness Guide</span>
            </div>
            
            <div className="space-y-3">
              {generatingAi ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-primary/10" />
                  <Skeleton className="h-4 w-3/4 bg-primary/10" />
                </div>
              ) : aiInsights ? (
                <>
                  <div className="space-y-2">
                    {aiInsights.insights.map((insight, i) => (
                      <p key={i} className="text-slate-700 text-sm leading-relaxed font-medium">
                        • {insight}
                      </p>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase mb-1">Recommendation</p>
                    <p className="text-slate-600 text-sm italic">{aiInsights.suggestion}</p>
                  </div>
                </>
              ) : (
                <p className="text-slate-500 text-sm">Add a few more reflections to unlock personalized AI insights.</p>
              )}
            </div>
          </Card>
        )}

        {/* Circular Progress Section */}
        <Card className="rounded-[32px] border-none bg-slate-50/50 p-8 flex flex-col items-center justify-center text-center space-y-4 border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control Success Rate</span>
          <div className="relative w-44 h-44">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r="76" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-100" />
              <circle cx="88" cy="88" r="76" stroke="currentColor" strokeWidth="14" fill="transparent" strokeDasharray={477} strokeDashoffset={477 - (477 * stats.controlRate) / 100} className="text-primary transition-all duration-1000 ease-out" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-slate-800 tracking-tighter">{stats.controlRate.toFixed(0)}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Controlled</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 rounded-full">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary">Based on {logs.length} events</span>
          </div>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="rounded-[28px] border-none bg-slate-50 p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-red-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Top Trigger</p>
              <p className="text-lg font-bold text-slate-800 leading-tight">{stats.topTrigger}</p>
            </div>
          </Card>
          <Card className="rounded-[28px] border-none bg-slate-50 p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-200 flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Peak Time</p>
              <p className="text-lg font-bold text-slate-800 leading-tight">{stats.freqTime}</p>
            </div>
          </Card>
        </div>

        {/* Weekly Intensity Chart */}
        <Card className="rounded-[32px] border-none bg-slate-50 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weekly Frequency</span>
            <span className="text-xs font-bold text-slate-400">Past 7 Days</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} 
                  dy={10}
                />
                <Bar dataKey="count" radius={[6, 6, 6, 6]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.count > 0 ? '#007AFF' : '#E2E8F0'} 
                      opacity={index === chartData.length - 1 ? 1 : 0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </main>
    </div>
  );
}
