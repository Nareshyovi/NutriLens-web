import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full text-left">
        {label && <label className="text-[11px] font-bold tracking-[0.06em] text-[var(--color-on-surface)] uppercase font-sans mb-1">{label}</label>}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-4 text-[var(--color-on-surface-variant)]">{icon}</div>}
          <input
            ref={ref}
            className={`bg-[var(--color-surface)] h-[48px] rounded-[16px] w-full border-[1.5px] border-[var(--color-outline-variant)] text-[var(--color-on-surface)] font-sans focus:outline-none focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[rgba(34,160,107,0.15)] transition-all ${error ? 'border-[var(--color-error)]' : ''} ${icon ? 'pl-12 pr-4' : 'px-4'} ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-[var(--color-error)] text-xs mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
