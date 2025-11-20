import React, { useState, useEffect } from 'react';

const WindowControls: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const checkMaximized = async () => {
      if (window.electronAPI) {
        const maximized = await window.electronAPI.windowIsMaximized();
        setIsMaximized(maximized);
      }
    };
    
    checkMaximized();
    
    // Check periodically (when window state might change)
    const interval = setInterval(checkMaximized, 500);
    return () => clearInterval(interval);
  }, []);

  const handleMinimize = async () => {
    if (window.electronAPI) {
      await window.electronAPI.windowMinimize();
    }
  };

  const handleMaximize = async () => {
    if (window.electronAPI) {
      await window.electronAPI.windowMaximize();
      // Update state after a short delay
      setTimeout(async () => {
        if (window.electronAPI) {
          const maximized = await window.electronAPI.windowIsMaximized();
          setIsMaximized(maximized);
        }
      }, 100);
    }
  };

  const handleClose = async () => {
    if (window.electronAPI) {
      await window.electronAPI.windowClose();
    }
  };

  return (
    <div className="window-controls">
      <button
        className="window-control window-control-minimize"
        onClick={handleMinimize}
        title="Minimize"
        aria-label="Minimize"
      >
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 3H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>
      <button
        className="window-control window-control-maximize"
        onClick={handleMaximize}
        title={isMaximized ? "Restore" : "Maximize"}
        aria-label={isMaximized ? "Restore" : "Maximize"}
      >
        {isMaximized ? (
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 2H4V5H1V2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 1H5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5H4.5V5H1V1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
      <button
        className="window-control window-control-close"
        onClick={handleClose}
        title="Close"
        aria-label="Close"
      >
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5M5 1L1 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};

export default WindowControls;

