import React from 'react';
import { SettingsIcon, HelpCircleIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>
          <SettingsIcon size={24} className="icon-inline" />
          {t('settings.title')}
        </h2>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h3>{t('settings.language')}</h3>
          <p className="settings-desc">{t('settings.languageDesc')}</p>
          
          <div className="language-selector">
            <button
              className={`language-option ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              <span className="language-flag">🇬🇧</span>
              <span className="language-name">{t('settings.english')}</span>
              {language === 'en' && <span className="language-check">✓</span>}
            </button>
            
            <button
              className={`language-option ${language === 'id' ? 'active' : ''}`}
              onClick={() => setLanguage('id')}
            >
              <span className="language-flag">🇮🇩</span>
              <span className="language-name">{t('settings.indonesian')}</span>
              {language === 'id' && <span className="language-check">✓</span>}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>{t('settings.theme')}</h3>
          <p className="settings-desc">{t('settings.themeDesc')}</p>
          
          <div className="theme-selector">
            <button
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <span className="theme-icon">☀️</span>
              <span className="theme-name">{t('settings.lightMode')}</span>
              {theme === 'light' && <span className="theme-check">✓</span>}
            </button>
            
            <button
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <span className="theme-icon">🌙</span>
              <span className="theme-name">{t('settings.darkMode')}</span>
              {theme === 'dark' && <span className="theme-check">✓</span>}
            </button>
          </div>
        </div>

        <div className="settings-section settings-contact">
          <div className="contact-header">
            <HelpCircleIcon size={20} />
            <h3>{t('settings.contact.title')}</h3>
          </div>
          <p className="contact-description">{t('settings.contact.description')}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

