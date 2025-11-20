import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PomodoroProvider } from './contexts/PomodoroContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <PomodoroProvider>
          <App />
        </PomodoroProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);

