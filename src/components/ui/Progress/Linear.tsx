import React from 'react';

interface LinearProgressProps {
  value: number;
  max: number;
  color?: string;
  trackColor?: string;
  className?: string;
}

export function LinearProgress({
  value,
  max,
  color = 'var(--color-primary)',
  trackColor = 'rgba(34, 160, 107, 0.1)',
  className = '',
}: LinearProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`h-2 rounded-full overflow-hidden w-full ${className}`} style={{ backgroundColor: trackColor }}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );
}
