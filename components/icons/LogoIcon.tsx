
import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4"/>
    <path d="M25 50H75" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M50 25L50 42" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M50 58L50 75" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M35 35C38.3333 40.1667 45.4 49 50 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M65 65C61.6667 59.8333 54.6 51 50 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);
