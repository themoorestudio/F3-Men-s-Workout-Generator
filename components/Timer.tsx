import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { ResetIcon } from './icons/ResetIcon';

interface TimerProps {
  isOpen: boolean;
  duration: number;
  title: string;
  onClose: () => void;
}

// Web Audio API to play a sound without an audio file
const playSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A4 note
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

export const Timer: React.FC<TimerProps> = ({ isOpen, duration, title, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isOpen) {
      resetTimer();
    }
  }, [isOpen, duration, resetTimer]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsActive(false);
      playSound();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);
  
  if (!isOpen) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / duration) * 100;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in-up" onClick={onClose}>
      <div className="relative w-full max-w-sm p-8 text-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors">&times;</button>
        <p className="text-xl text-gray-400 mb-4 truncate">{title}</p>
        
        <div className="relative w-64 h-64 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r={radius} strokeWidth="10" className="text-gray-700" fill="transparent" stroke="currentColor" />
            <circle
              cx="110"
              cy="110"
              r={radius}
              strokeWidth="10"
              className="text-red-500"
              fill="transparent"
              stroke="currentColor"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-6">
          <button onClick={resetTimer} className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors" aria-label="Reset Timer">
            <ResetIcon className="h-6 w-6 text-gray-400" />
          </button>
          <button
            onClick={() => setIsActive(!isActive)}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition-transform transform hover:scale-105"
            aria-label={isActive ? 'Pause Timer' : 'Start Timer'}
          >
            {isActive ? <PauseIcon className="h-10 w-10" /> : <PlayIcon className="h-10 w-10" />}
          </button>
          <div className="w-12 h-12" /> {/* Spacer */}
        </div>
      </div>
    </div>
  );
};