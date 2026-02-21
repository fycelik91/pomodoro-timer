"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Briefcase } from 'lucide-react';
import clsx from 'clsx';

export default function Home() {
  const [mode, setMode] = useState('work'); // 'work' | 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef(null);

  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (audioRef.current) {
        audioRef.current.play();
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100 
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <main className={clsx(
      "min-h-screen flex flex-col items-center justify-center transition-colors duration-500",
      mode === 'work' ? "bg-rose-50 text-rose-900" : "bg-emerald-50 text-emerald-900"
    )}>
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" />
      
      <div className="w-full max-w-md px-6">
        <h1 className="text-3xl font-bold text-center mb-8 tracking-tight">Pomodoro</h1>

        {/* Mode Switcher */}
        <div className="flex bg-white/50 p-1 rounded-full mb-12 shadow-sm backdrop-blur-sm mx-auto w-fit">
          <button
            onClick={() => switchMode('work')}
            className={clsx(
              "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
              mode === 'work' ? "bg-white shadow text-rose-600" : "text-gray-500 hover:bg-white/30"
            )}
          >
            <Briefcase size={16} /> Work
          </button>
          <button
            onClick={() => switchMode('break')}
            className={clsx(
              "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
              mode === 'break' ? "bg-white shadow text-emerald-600" : "text-gray-500 hover:bg-white/30"
            )}
          >
            <Coffee size={16} /> Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative flex items-center justify-center mb-12">
          {/* SVG Progress Circle Background */}
          <svg className="w-72 h-72 transform -rotate-90">
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className={mode === 'work' ? "text-rose-100" : "text-emerald-100"}
            />
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 130}
              strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
              className={clsx(
                "transition-all duration-1000 ease-linear",
                mode === 'work' ? "text-rose-500" : "text-emerald-500"
              )}
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute flex flex-col items-center">
            <span className={clsx(
              "text-7xl font-mono font-bold tracking-tighter",
              mode === 'work' ? "text-rose-600" : "text-emerald-600"
            )}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm font-medium opacity-60 mt-2 uppercase tracking-widest">
              {isActive ? 'Running' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6">
          <button
            onClick={toggleTimer}
            className={clsx(
              "p-6 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center",
              mode === 'work' 
                ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200" 
                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200"
            )}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
          </button>
          
          <button
            onClick={resetTimer}
            className={clsx(
              "p-6 rounded-2xl bg-white shadow-lg transition-colors hover:bg-gray-50 flex items-center justify-center",
              mode === 'work' ? "text-rose-500 shadow-rose-100" : "text-emerald-500 shadow-emerald-100"
            )}
          >
            <RotateCcw size={32} />
          </button>
        </div>
      </div>
    </main>
  );
}