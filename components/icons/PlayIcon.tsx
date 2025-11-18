import React from 'react';

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    stroke="currentColor" 
    strokeWidth="0" 
    className={className}
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);