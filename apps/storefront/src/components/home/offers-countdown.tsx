'use client';

import { useEffect, useState } from 'react';

interface OffersCountdownProps {
  endsAt: Date;
  label?: string;
}

function useCountdown(endsAt: Date) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, endsAt.getTime() - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return time;
}

export function OffersCountdown({ endsAt, label = 'Ofertas do dia' }: OffersCountdownProps) {
  const { h, m, s } = useCountdown(endsAt);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-3">
      <span className="font-display text-2xl text-ink">{label}</span>
      <div className="flex items-center gap-1 bg-ink text-paper rounded-md px-3 py-1">
        <span className="font-mono font-bold text-lg text-sun">{pad(h)}</span>
        <span className="text-zinc-400 font-bold">:</span>
        <span className="font-mono font-bold text-lg text-sun">{pad(m)}</span>
        <span className="text-zinc-400 font-bold">:</span>
        <span className="font-mono font-bold text-lg text-sun">{pad(s)}</span>
      </div>
    </div>
  );
}
