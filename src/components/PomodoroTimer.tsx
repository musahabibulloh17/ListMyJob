import React, { useState, useEffect, useRef } from 'react';
import { TimerIcon, PlayIcon, PauseIcon, RotateCcwIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  onTimerComplete?: (mode: TimerMode) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onTimerComplete }) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const WORK_TIME = 25 * 60; // 25 minutes
  const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
  const LONG_BREAK_TIME = 15 * 60; // 15 minutes

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Show notification
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      const message = mode === 'work' 
        ? t('pomodoro.notification.workComplete')
        : t('pomodoro.notification.breakComplete');
      (window as any).electronAPI.showNotification(t('pomodoro.title'), message);
    }

    if (onTimerComplete) {
      onTimerComplete(mode);
    }

    // Auto switch to next mode
    if (mode === 'work') {
      const nextMode = completedPomodoros % 4 === 3 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(nextMode === 'longBreak' ? LONG_BREAK_TIME : SHORT_BREAK_TIME);
      if (nextMode === 'shortBreak' || nextMode === 'longBreak') {
        setCompletedPomodoros((prev) => prev + 1);
      }
    } else {
      setMode('work');
      setTimeLeft(WORK_TIME);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (mode === 'work') {
      setTimeLeft(WORK_TIME);
    } else if (mode === 'shortBreak') {
      setTimeLeft(SHORT_BREAK_TIME);
    } else {
      setTimeLeft(LONG_BREAK_TIME);
    }
  };

  const switchMode = (newMode: TimerMode) => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    setMode(newMode);
    if (newMode === 'work') {
      setTimeLeft(WORK_TIME);
    } else if (newMode === 'shortBreak') {
      setTimeLeft(SHORT_BREAK_TIME);
    } else {
      setTimeLeft(LONG_BREAK_TIME);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    let totalTime = WORK_TIME;
    if (mode === 'shortBreak') totalTime = SHORT_BREAK_TIME;
    if (mode === 'longBreak') totalTime = LONG_BREAK_TIME;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="pomodoro-timer">
      <div className="pomodoro-header">
        <h2>
          <TimerIcon size={24} className="icon-inline" />
          {t('pomodoro.title')}
        </h2>
        <div className="pomodoro-stats">
          <span className="pomodoro-count">
            {completedPomodoros} {completedPomodoros === 1 ? t('pomodoro.completed.singular') : t('pomodoro.completed.plural')}
          </span>
        </div>
      </div>

      <div className="pomodoro-mode-selector">
        <button
          className={`mode-btn ${mode === 'work' ? 'active' : ''}`}
          onClick={() => switchMode('work')}
        >
          {t('pomodoro.work')}
        </button>
        <button
          className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => switchMode('shortBreak')}
        >
          {t('pomodoro.shortBreak')}
        </button>
        <button
          className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => switchMode('longBreak')}
        >
          {t('pomodoro.longBreak')}
        </button>
      </div>

      <div className="pomodoro-display">
        <div className="pomodoro-circle">
          <svg className="pomodoro-progress" viewBox="0 0 200 200">
            <circle
              className="pomodoro-progress-bg"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
            />
            <circle
              className="pomodoro-progress-bar"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgress() / 100)}`}
              transform="rotate(-90 100 100)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="pomodoro-time">
            <span className="time-display">{formatTime(timeLeft)}</span>
            <span className="mode-label">
              {mode === 'work' ? t('pomodoro.focusTime') : mode === 'shortBreak' ? t('pomodoro.shortBreak') : t('pomodoro.longBreak')}
            </span>
          </div>
        </div>
      </div>

      <div className="pomodoro-controls">
        <button className="btn btn-primary" onClick={toggleTimer}>
          {isRunning ? (
            <>
              <PauseIcon size={20} />
              {t('pomodoro.pause')}
            </>
          ) : (
            <>
              <PlayIcon size={20} />
              {t('pomodoro.start')}
            </>
          )}
        </button>
        <button className="btn btn-secondary" onClick={resetTimer}>
          <RotateCcwIcon size={20} />
          {t('pomodoro.reset')}
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;

