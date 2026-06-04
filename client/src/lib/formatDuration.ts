export interface DurationParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function getDurationParts(totalSeconds: number): DurationParts {
  const safe = Math.max(0, totalSeconds);
  return {
    days: Math.floor(safe / 86400),
    hours: Math.floor((safe % 86400) / 3600),
    minutes: Math.floor((safe % 3600) / 60),
    seconds: safe % 60,
  };
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}
