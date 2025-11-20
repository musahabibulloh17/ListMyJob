import React, { useState, useEffect } from 'react';
import { TimerIcon, PlayIcon, PauseIcon, RotateCcwIcon, UploadIcon, MusicIcon, XIcon, StopIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { usePomodoro } from '../contexts/PomodoroContext';

const PomodoroTimer: React.FC = () => {
  const { t } = useLanguage();
  const {
    timeLeft,
    isRunning,
    mode,
    completedPomodoros,
    isAlarmPlaying,
    toggleTimer,
    resetTimer,
    switchMode,
    stopAlarm,
  } = usePomodoro();

  const [hasCustomAudio, setHasCustomAudio] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Check if custom audio exists
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.getNotificationAudioPath().then((audioPath: string | null) => {
        setHasCustomAudio(!!audioPath);
      });
    }
  }, []);

  const WORK_TIME = 25 * 60; // 25 minutes
  const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
  const LONG_BREAK_TIME = 15 * 60; // 15 minutes

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

  const handleUploadAudio = async () => {
    if (typeof window === 'undefined' || !(window as any).electronAPI) return;
    
    setIsUploading(true);
    try {
      const audioPath = await (window as any).electronAPI.uploadNotificationAudio();
      if (audioPath) {
        setHasCustomAudio(true);
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAudio = async () => {
    if (typeof window === 'undefined' || !(window as any).electronAPI) return;
    
    if (confirm(t('pomodoro.notification.deleteConfirm'))) {
      const deleted = await (window as any).electronAPI.deleteNotificationAudio();
      if (deleted) {
        setHasCustomAudio(false);
      }
    }
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
            {isAlarmPlaying && (
              <div className="alarm-indicator">
                <MusicIcon size={16} />
                <span>{t('pomodoro.alarmPlaying')}</span>
              </div>
            )}
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
        {isAlarmPlaying && (
          <button className="btn btn-danger" onClick={stopAlarm}>
            <StopIcon size={20} />
            {t('pomodoro.stopAlarm')}
          </button>
        )}
      </div>

      <div className="pomodoro-notification-settings">
        <div className="notification-header">
          <MusicIcon size={20} />
          <h3>{t('pomodoro.notification.title')}</h3>
        </div>
        <div className="notification-content">
          {hasCustomAudio ? (
            <div className="notification-audio-active">
              <span className="audio-status">
                <MusicIcon size={16} />
                {t('pomodoro.notification.customAudio')}
              </span>
              <button className="btn btn-small btn-danger" onClick={handleDeleteAudio}>
                <XIcon size={16} />
                {t('pomodoro.notification.remove')}
              </button>
            </div>
          ) : (
            <div className="notification-audio-empty">
              <p>{t('pomodoro.notification.description')}</p>
              <button 
                className="btn btn-small btn-primary" 
                onClick={handleUploadAudio}
                disabled={isUploading}
              >
                <UploadIcon size={16} />
                {isUploading ? t('pomodoro.notification.uploading') : t('pomodoro.notification.upload')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;

