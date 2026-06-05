import { useEffect, useState } from 'react';

function computeSecondsUntil(endsAt: string): number {
  return Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000));
}

export function useSecondsUntil(endsAt?: string): number | null {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(() =>
    endsAt ? computeSecondsUntil(endsAt) : null,
  );

  useEffect(() => {
    if (!endsAt) {
      setSecondsLeft(null);
      return;
    }

    const tick = () => setSecondsLeft(computeSecondsUntil(endsAt));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [endsAt]);

  return endsAt ? secondsLeft : null;
}
