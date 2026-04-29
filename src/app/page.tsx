"use client";

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleEmotion = (emotion: string) => {
    if (emotion === 'Angry') {
      router.push('/calm');
    } else {
      // Normal flow for other emotions if needed
      router.push('/chat');
    }
  };

  return (
    <div className="px-6 pt-20 pb-10 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <header className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground/90">CalmOS</h1>
        <p className="text-2xl font-medium text-muted-foreground/80 leading-relaxed">
          How are you feeling<br />right now?
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 w-full">
        <button
          onClick={() => handleEmotion('Angry')}
          className="group relative flex flex-col items-center justify-center p-8 bg-white rounded-[24px] shadow-sm hover:shadow-md transition-all active:scale-95 border border-black/5"
        >
          <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">😡</span>
          <span className="text-xl font-semibold text-foreground/80">Angry</span>
        </button>

        <button
          onClick={() => handleEmotion('Neutral')}
          className="group relative flex flex-col items-center justify-center p-8 bg-white rounded-[24px] shadow-sm hover:shadow-md transition-all active:scale-95 border border-black/5"
        >
          <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">😐</span>
          <span className="text-xl font-semibold text-foreground/80">Neutral</span>
        </button>

        <button
          onClick={() => handleEmotion('Calm')}
          className="group relative flex flex-col items-center justify-center p-8 bg-white rounded-[24px] shadow-sm hover:shadow-md transition-all active:scale-95 border border-black/5"
        >
          <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">🙂</span>
          <span className="text-xl font-semibold text-foreground/80">Calm</span>
        </button>
      </div>
    </div>
  );
}
