import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroContextType {
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  completedPomodoros: number;
  isAlarmPlaying: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  switchMode: (newMode: TimerMode) => void;
  stopAlarm: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

const WORK_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
const LONG_BREAK_TIME = 15 * 60; // 15 minutes

export const PomodoroProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    // Load from localStorage or default to work time
    const saved = localStorage.getItem('pomodoro-timeLeft');
    return saved ? parseInt(saved, 10) : WORK_TIME;
  });
  
  const [isRunning, setIsRunning] = useState<boolean>(() => {
    const saved = localStorage.getItem('pomodoro-isRunning');
    return saved === 'true';
  });
  
  const [mode, setMode] = useState<TimerMode>(() => {
    const saved = localStorage.getItem('pomodoro-mode') as TimerMode;
    return saved || 'work';
  });
  
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(() => {
    const saved = localStorage.getItem('pomodoro-completedPomodoros');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const modeRef = useRef<TimerMode>(mode);
  const completedPomodorosRef = useRef<number>(completedPomodoros);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  // Update refs when state changes
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    completedPomodorosRef.current = completedPomodoros;
  }, [completedPomodoros]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pomodoro-timeLeft', timeLeft.toString());
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem('pomodoro-isRunning', isRunning.toString());
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem('pomodoro-mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('pomodoro-completedPomodoros', completedPomodoros.toString());
  }, [completedPomodoros]);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const currentMode = modeRef.current;
    const currentCompleted = completedPomodorosRef.current;

    // Show notification
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      const message = currentMode === 'work' 
        ? 'Work session completed! Time for a break.'
        : 'Break completed! Ready to work again.';
      (window as any).electronAPI.showNotification('Pomodoro Timer', message);
      
      // Play notification audio (custom or default)
      (window as any).electronAPI.playNotificationAudio().then((audioPath: string | null) => {
        if (audioPath) {
          // Stop any existing audio first
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          
          // Use custom protocol for Electron file access
          const audio = new Audio();
          // Convert Windows path to custom protocol URL
          const audioUrl = `pomodoro-audio://${audioPath.replace(/\\/g, '/')}`;
          audio.src = audioUrl;
          audio.volume = 0.8;
          audio.loop = true; // Loop audio until stopped
          
          // Store reference
          audioRef.current = audio;
          setIsAlarmPlaying(true);
          
          // Handle audio events
          audio.addEventListener('ended', () => {
            if (audioRef.current === audio) {
              setIsAlarmPlaying(false);
              audioRef.current = null;
            }
          });
          
          audio.addEventListener('pause', () => {
            if (audioRef.current === audio) {
              setIsAlarmPlaying(false);
            }
          });
          
          audio.play().catch((error: any) => {
            console.error('Error playing notification audio:', error);
            setIsAlarmPlaying(false);
            audioRef.current = null;
          });
          
          // Auto-stop after 5 minutes (safety measure)
          setTimeout(() => {
            if (audioRef.current === audio) {
              audio.pause();
              audio.currentTime = 0;
              setIsAlarmPlaying(false);
              audioRef.current = null;
            }
          }, 5 * 60 * 1000); // 5 minutes
        }
      });
    }

    // Auto switch to next mode
    if (currentMode === 'work') {
      const nextMode = currentCompleted % 4 === 3 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      const nextTime = nextMode === 'longBreak' ? LONG_BREAK_TIME : SHORT_BREAK_TIME;
      setTimeLeft(nextTime);
      if (nextMode === 'shortBreak' || nextMode === 'longBreak') {
        setCompletedPomodoros((prev) => prev + 1);
      }
    } else {
      setMode('work');
      setTimeLeft(WORK_TIME);
    }
  }, []);

  // Timer logic
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
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft, handleTimerComplete]);

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
    // If switching to the same mode, do nothing
    if (newMode === mode) return;
    
    // Stop timer and reset when switching modes
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    setMode(newMode);
    // Reset time to default for new mode
    let newTime = WORK_TIME;
    if (newMode === 'shortBreak') {
      newTime = SHORT_BREAK_TIME;
    } else if (newMode === 'longBreak') {
      newTime = LONG_BREAK_TIME;
    }
    setTimeLeft(newTime);
    
    // Timer will be stopped - user needs to manually start again
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsAlarmPlaying(false);
    }
  };

  return (
    <PomodoroContext.Provider
      value={{
        timeLeft,
        isRunning,
        mode,
        completedPomodoros,
        isAlarmPlaying,
        toggleTimer,
        resetTimer,
        switchMode,
        stopAlarm,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within PomodoroProvider');
  }
  return context;
};

