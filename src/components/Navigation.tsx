"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, BarChart2, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Reflect', icon: ClipboardList, href: '/reflect' },
    { label: 'Insights', icon: BarChart2, href: '/insights' },
    { label: 'Chat', icon: MessageCircle, href: '/chat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 safe-bottom z-50">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1.5 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-slate-300 hover:text-slate-400"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              <span className={cn("text-[9px] font-bold uppercase tracking-widest", !isActive && "opacity-0")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}