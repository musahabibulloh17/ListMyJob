import React from 'react';
import { TimerIcon, StickyNoteIcon, ListIcon, SettingsIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

type MenuType = 'jobs' | 'pomodoro' | 'notes' | 'settings';

interface SidebarProps {
  activeMenu: MenuType;
  onMenuChange: (menu: MenuType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange }) => {
  const { t } = useLanguage();
  
  const menuItems = [
    {
      id: 'jobs' as MenuType,
      label: t('sidebar.jobs'),
      icon: ListIcon,
    },
    {
      id: 'pomodoro' as MenuType,
      label: t('sidebar.pomodoro'),
      icon: TimerIcon,
    },
    {
      id: 'notes' as MenuType,
      label: t('sidebar.notes'),
      icon: StickyNoteIcon,
    },
    {
      id: 'settings' as MenuType,
      label: t('sidebar.settings'),
      icon: SettingsIcon,
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>
          <ListIcon size={24} color="white" />
          {t('app.title')}
        </h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => onMenuChange(item.id)}
            >
              <Icon size={20} className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

