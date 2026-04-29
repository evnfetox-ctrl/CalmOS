"use client";

import { useEffect, useState } from 'react';
import { getLogs, AngerLog } from '@/lib/db';
import { Menu, User, TrendingUp, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function InsightsPage() {
  const [logs, setLogs] = useState<AngerLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getLogs();
        setLogs(data);
      } catch (err) {
        console.error("Failed to load insights", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = {
    controlRate: logs.length > 0 ? (logs.filter(l => !l.reacted).length / logs.length) * 100 : 0,
    topTrigger: logs.reduce((acc, log) => {
      acc[log.trigger] = (acc[log.trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const topTriggerName = Object.entries(stats.topTrigger).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const chartData = [
    { day: 'M', value: 4 },
    { day: 'T', value: 2 },
    { day: 'W', value: 5 },
    { day: 'T', value: 3 },
    { day: 'F', value: 4 },
    { day: 'S', value: 1 },
    { day: 'S', value: 6 },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      <header className="px-6 pt-6 pb-2 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-slate-800 font-bold text-lg tracking-tight">CalmOS</h1>
        <Button variant="ghost" size="icon" className="text-slate-400">
          <User className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 px-6 pt-6 space-y-8 max-w-lg mx-auto w-full">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-slate-800">Insights</h2>
          <p className="text-slate-500 text-sm">A quiet look at your recent emotional patterns.</p>
        </div>

        {/* Circular Progress Section */}
        <Card className="rounded-[32px] border-none bg-slate-50/50 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Control Rate</span>
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * stats.controlRate) / 100} className="text-primary" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-slate-800">{stats.controlRate.toFixed(0)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary">+ 4% increase</span>
          </div>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="rounded-[24px] border-none bg-slate-50 p-5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <Target className="w-4 h-4 text-red-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Most common trigger</p>
              <p className="text-lg font-bold text-slate-800 leading-tight">Work Stress</p>
            </div>
          </Card>
          <Card className="rounded-[24px] border-none bg-slate-50 p-5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <Clock className="w-4 h-4 text-slate-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Most frequent time</p>
              <p className="text-lg font-bold text-slate-800 leading-tight">2:00 PM <span className="text-xs font-normal text-slate-400 block">Afternoons</span></p>
            </div>
          </Card>
        </div>

        {/* Weekly Intensity Chart */}
        <Card className="rounded-[24px] border-none bg-slate-50 p-6 space-y-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weekly Intensity</span>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Bar dataKey="value" fill="#E2E8F0" radius={[4, 4, 4, 4]} />
                {/* Active bar mock */}
                <Bar dataKey="value" data={chartData.slice(-1)} fill="#007AFF" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </main>
    </div>
  );
}