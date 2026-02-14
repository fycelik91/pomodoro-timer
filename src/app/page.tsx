
"use client";

import React, { useState, useEffect, useRef } from 'react';

const motivationalQuotes = [
  "Odaklanma anahtardır.",
  "Her dakika önemlidir.",
  "Küçük adımlar büyük hedeflere götürür.",
  "Disiplin özgürlüktür.",
  "Kendine inan.",
  "Başlamak bitirmenin yarısıdır.",
  "Yapabilirsin!",
  "Sakin kal ve devam et.",
  "Daha iyi bir sen için çalış.",
  "Zaman senin en değerli varlığın."
];

const PomodoroTimer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true); // true for work, false for break
  const [quote, setQuote] = useState('');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setRandomQuote();
    // Initialize audio only once
    audioRef.current = new Audio('/alarm.mp3'); // Assuming alarm.mp3 is in public folder
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Time's up!
            if (audioRef.current) {
              audioRef.current.play();
            }
            setIsActive(false);
            if (isWorkTime) {
              // Switch to break time
              setMinutes(5);
              setSeconds(0);
              setIsWorkTime(false);
            } else {
              // Switch back to work time
              setMinutes(25);
              setSeconds(0);
              setIsWorkTime(true);
            }
            // Automatically start next session
            setIsActive(true);
            setRandomQuote();
          } else {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, minutes, seconds, isWorkTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
    setIsWorkTime(true);
    setMinutes(25);
    setSeconds(0);
    setRandomQuote();
  };

  const setRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  };

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-5xl font-bold mb-8">Pomodoro Timer</h1>

      <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-xl text-center">
        <div className="text-8xl font-mono mb-8">
          {formattedMinutes}:{formattedSeconds}
        </div>
        <div className="flex space-x-4 mb-8">
          <button
            onClick={toggleTimer}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-2xl"
          >
            {isActive ? 'Durdur' : 'Başlat'}
          </button>
          <button
            onClick={resetTimer}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-2xl"
          >
            Sıfırla
          </button>
        </div>
        <p className="text-xl italic">"{quote}"</p>
        <p className="mt-4 text-lg">
          {isWorkTime ? 'Çalışma Zamanı!' : 'Mola Zamanı!'}
        </p>
      </div>

      {/* Add a hidden audio element for the alarm */}
      <audio ref={audioRef} src="/alarm.mp3" preload="auto" />
    </div>
  );
};

export default PomodoroTimer;
