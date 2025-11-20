import React from 'react';
import { SettingsIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

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
      </div>
    </div>
  );
};

export default Settings;

