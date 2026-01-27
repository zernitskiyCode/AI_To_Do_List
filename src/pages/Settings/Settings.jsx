import { Link } from 'react-router-dom';

const Settings = ({ 
  settings = {},
  onToggleQuietMode,
  onThemeChange,
  onLanguageChange 
}) => {
  const {
    quietMode = false,
    theme = 'light',
    language = 'ru',
  } = settings;

  const handleToggleQuietMode = () => {
    if (onToggleQuietMode) {
      onToggleQuietMode();
    }
  };

  const handleThemeChange = (e) => {
    if (onThemeChange) {
      onThemeChange(e.target.value);
    }
  };

  const handleLanguageChange = (e) => {
    if (onLanguageChange) {
      onLanguageChange(e.target.value);
    }
  };

  const accountItems = [
    { icon: '👤', label: 'Профиль', to: '/profile', isLink: true },
    { icon: '🔐', label: 'Безопасность', isLink: false },
    { icon: '💳', label: 'Оплата', isLink: false },
  ];

  const themeOptions = [
    { value: 'light', label: 'Светлая' },
    { value: 'dark', label: 'Темная' },
  ];

  const languageOptions = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' },
    { value: 'uk', label: 'Українська' },
  ];

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-section">
          <h3 className="section-title">Аккаунт</h3>
          <div className="settings-list">
            {accountItems.map((item, index) => {
              if (item.isLink) {
                return (
                  <Link key={index} to={item.to} className="list-item">
                    <span>{item.icon} {item.label}</span>
                    <span>→</span>
                  </Link>
                );
              }

              return (
                <div key={index} className="list-item">
                  <span>{item.icon} {item.label}</span>
                  <span>→</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="settings-section">
          <h3 className="section-title">Настройки</h3>
          <div className="settings-list">
            <div className="list-item">
              <span>🔕 Тихий режим</span>
              <div 
                className={`toggle-switch ${quietMode ? 'toggle-switch--active' : ''}`}
                onClick={handleToggleQuietMode}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleQuietMode();
                  }
                }}
                aria-label="Переключить тихий режим"
                aria-checked={quietMode}
              />
            </div>
            <div className="list-item">
              <span>🎨 Тема</span>
              <div className="radio-group">
                {themeOptions.map((option) => (
                  <label key={option.value} className="radio-option">
                    <input 
                      type="radio" 
                      name="theme" 
                      value={option.value}
                      checked={theme === option.value}
                      onChange={handleThemeChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="list-item">
              <span>🌐 Язык</span>
              <div className="dropdown">
                <select value={language} onChange={handleLanguageChange}>
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="list-item">
              <span>📱 Уведомления</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;



