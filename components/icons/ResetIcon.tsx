import React from 'react';

export const ResetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21.5 2v6h-6"/>
    <path d="M2.5 22v-6h6"/>
    <path d="M4.93 15c1.24.96 2.69 1.6 4.24 1.95 2.58.58 5.31-.15 7.42-1.95s3.42-4.47 3.42-7.17"/>
    <path d="M19.07 9c-1.24-.96-2.69-1.6-4.24-1.95-2.58-.58-5.31.15-7.42 1.95s-3.42 4.47-3.42 7.17"/>
  </svg>
);