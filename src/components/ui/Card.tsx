import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'md' | 'lg';
}

export function Card({ 
  children, 
  padding = 'lg',
  className = '', 
  ...props 
}: CardProps) {
  let paddingClasses = "";
  if (padding === 'lg') paddingClasses = "p-[20px]";
  else if (padding === 'md') paddingClasses = "p-[16px]";
  
  return (
    <div 
      className={`bg-[var(--color-surface-container-lowest)] rounded-[20px] border border-[var(--color-outline-variant)] shadow-[0px_4px_20px_-2px_rgba(31,41,37,0.04),_0px_1px_3px_0px_rgba(31,41,37,0.02)] ${paddingClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
