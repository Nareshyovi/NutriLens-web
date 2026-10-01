import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'fab';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '', 
  ...props 
}: ButtonProps) {
  let baseClasses = "flex items-center justify-center font-heading transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  let variantClasses = "";
  
  if (variant === 'primary') {
    variantClasses = "bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold rounded-full min-h-[48px] px-6";
  } else if (variant === 'secondary') {
    variantClasses = "bg-[var(--color-surface)] text-[var(--color-on-surface)] border-[1.5px] border-[var(--color-outline-variant)] rounded-full min-h-[48px] px-6";
  } else if (variant === 'fab') {
    variantClasses = "bg-[var(--color-primary)] text-[var(--color-on-primary)] w-[56px] h-[56px] rounded-full shadow-[0px_8px_24px_-2px_rgba(34,160,107,0.35)]";
  }
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
