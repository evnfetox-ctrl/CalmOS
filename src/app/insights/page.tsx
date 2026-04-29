"use client";

import { useEffect, useState } from 'react';
import { getLogs, AngerLog } from '@/lib/db';
import { generatePersonalizedInsights, PersonalizedInsightsOutput } from '@/ai/flows/personalized-insights-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, TrendingUp, ShieldCheck } from 'lucide-react';

export default function InsightsPage() {
  const [logs, setLogs] = useState<AngerLog[]>([]);
  const [aiInsights, setAiInsights] = useState<PersonalizedInsightsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getLogs();
        setLogs(data);
        if (data.length > 0) {
          const insights = await generatePersonalizedInsights({
            jsonData: JSON.stringify(data.slice(-10)), // Send last 10 logs for performance
          });
          setAiInsights(insights);
        }
      } catch (err) {
        console.error("Failed to load insights", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = {
    mostCommonTrigger: logs.reduce((acc, log) => {
      acc[log.trigger] = (acc[log.trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    controlRate: logs.length > 0 ? (logs.filter(l => !l.reacted).length / logs.length) * 100 : 0,
  };

  const topTrigger = Object.entries(stats.mostCommonTrigger)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  if (loading) {
    return (
      <div className="px-6 pt-12 space-y-6">
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-64 w-full rounded-[24px]" />
        <Skeleton className="h-64 w-full rounded-[24px]" />
      </div>
    );
  }

  return (
    <div className="px-6 pt-12 pb-10 max-w-lg mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-foreground/90">Your Insights</h1>
        <p className="text-muted-foreground mt-2">Patterns detected in your journey.</p>
      </header>

      {logs.length === 0 ? (
        <Card className="p-12 text-center rounded-[24px] bg-white border-black/5 shadow-sm">
          <p className="text-lg text-muted-foreground">Log your first reflection to see patterns here.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-[24px] border-none shadow-sm bg-primary/5 p-4 flex flex-col items-center text-center">
              <TrendingUp className="text-primary w-6 h-6 mb-2" />
              <span className="text-xs text-muted-foreground uppercase font-semibold">Common Trigger</span>
              <span className="text-lg font-bold text-foreground/80">{topTrigger}</span>
            </Card>
            <Card className="rounded-[24px] border-none shadow-sm bg-secondary/10 p-4 flex flex-col items-center text-center">
              <ShieldCheck className="text-secondary-foreground w-6 h-6 mb-2" />
              <span className="text-xs text-muted-foreground uppercase font-semibold">Control Rate</span>
              <span className="text-lg font-bold text-foreground/80">{stats.controlRate.toFixed(0)}%</span>
            </Card>
          </div>

          <Card className="rounded-[32px] overflow-hidden border-none shadow-xl bg-white">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-semibold text-primary">AI Pattern Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {aiInsights ? (
                <>
                  <div className="space-y-4">
                    {aiInsights.insights.map((insight, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-primary text-xs font-bold">{idx + 1}</span>
                        </div>
                        <p className="text-foreground/70 leading-relaxed font-medium">{insight}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-[20px] bg-secondary/5 border border-secondary/20">
                    <h4 className="text-sm font-bold text-secondary-foreground/70 uppercase mb-2">Suggestion</h4>
                    <p className="text-foreground/80 leading-relaxed italic">{aiInsights.suggestion}</p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground italic text-center py-4">Generating personalized analysis...</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
