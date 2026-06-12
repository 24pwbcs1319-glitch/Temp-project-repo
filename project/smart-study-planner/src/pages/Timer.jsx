import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Pomodoro Timer component that manages study and break intervals.
 * It features a visual progress background, audio beeps on session completion, and auto-cycling.
 */
export default function Timer() {
  const STUDY_TIME = 25 * 60; // 25 minutes
  const BREAK_TIME = 5 * 60;  // 5 minutes

  const [timeLeft, setTimeLeft] = useState(STUDY_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(true);
  
  const timerRef = useRef(null);

  /**
   * Generates a beep sound using Web Audio API when a timer session is completed
   */
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz (A4)
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 1);
    } catch (e) {
      console.warn("Audio Context not supported or allowed.", e);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      // Time is up
      playBeep();
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Auto-toggle mode strictly based on the roadmap's bonus spec "Pomodoro auto-cycle"
      const nextMode = !isStudyMode;
      setIsStudyMode(nextMode);
      setTimeLeft(nextMode ? STUDY_TIME : BREAK_TIME);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, isStudyMode]);

  /**
   * Toggles the timer to either start or pause depending on current state
   */
  const toggleTimer = () => setIsActive(!isActive);
  
  /**
   * Resets the current timer to the original full length duration
   */
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isStudyMode ? STUDY_TIME : BREAK_TIME);
  };

  /**
   * Switches the active mode between 'Study' and 'Break'
   */
  const switchMode = (study) => {
    setIsActive(false);
    setIsStudyMode(study);
    setTimeLeft(study ? STUDY_TIME : BREAK_TIME);
  };

  /**
   * Formats the integer seconds remaining into MM:SS format
   */
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Determine progress percentage purely for visual circle/bar display
  const totalDuration = isStudyMode ? STUDY_TIME : BREAK_TIME;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-2xl mx-auto min-h-[80vh] animate-in fade-in duration-500">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Pomodoro Timer</h1>
        <p className="text-muted-foreground mt-2">Focus deeply. Take effective breaks.</p>
      </div>

      <div className="bg-white w-full max-w-md border border-slate-200 shadow-sm rounded-3xl p-8 flex flex-col items-center relative overflow-hidden">
        {/* Background visual progress */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-indigo-50 transition-all duration-1000 z-0" 
          style={{ height: `${progressPercent}%` }}
        />

        <div className="flex gap-2 bg-slate-50 border border-slate-100 p-1 rounded-full mb-8 z-10 w-full relative">
          <button
            onClick={() => switchMode(true)}
            className={cn(
              "flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2",
              isStudyMode ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <BookOpen className="w-4 h-4" /> Study
          </button>
          <button
            onClick={() => switchMode(false)}
            className={cn(
              "flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2",
              !isStudyMode ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Coffee className="w-4 h-4" /> Break
          </button>
        </div>

        <div className="text-8xl font-sans font-black tracking-tighter tabular-nums mb-12 text-slate-900 z-10 relative">
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center gap-4 z-10 relative">
          <button 
            onClick={resetTimer}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100 hover:text-slate-600 transition-all shadow-sm"
            aria-label="Reset Timer"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className="w-20 h-20 rounded-full flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200 transition-all"
            aria-label={isActive ? 'Pause' : 'Start'}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
}
