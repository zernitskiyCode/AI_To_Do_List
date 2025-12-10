import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav/BottomNav';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Stats from './pages/Stats/Stats';
import Calendar from './pages/Calendar/Calendar';
import './styles/style.scss';

// Конфигурация приложения
const APP_CONFIG = {
  title: 'Русский Продукт',
  navItems: [
    { path: '/', icon: '🏠', label: 'Главная' },
    { path: '/stats', icon: '📊', label: 'Статистика' },
    { path: '/calendar', icon: '📅', label: 'Календарь' },
    { path: '/profile', icon: '👤', label: 'Профиль' },
  ],
};

const AppContent = () => {
  const location = useLocation();
  
  // Состояние пользователя
  const [user] = useState({
    name: 'Александр Иванов',
    email: 'alexander@example.com',
    avatar: 'АИ',
  });

  // Статистика для главной страницы
const [stats] = useState({
  voiceRecords: 12,
  averageCompletionTime: '2.5h',  // ← ПРАВИЛЬНО
});

  // Настройки приложения
  const [settings, setSettings] = useState({
    quietMode: true,
    theme: 'light',
    language: 'ru',
  });

  // Обработчики для настроек
  const handleToggleQuietMode = () => {
    setSettings(prev => ({ ...prev, quietMode: !prev.quietMode }));
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const handleLanguageChange = (language) => {
    setSettings(prev => ({ ...prev, language }));
  };

  // Обработчик выхода из аккаунта
  const handleLogout = () => {
    console.log('Выход из аккаунта');
    // Здесь можно добавить логику выхода
  };

  // Обработчик Premium
  const handlePremiumClick = () => {
    console.log('Premium PRO');
    // Здесь можно добавить логику Premium
  };

  // Обработчик обновления профиля
  const handleRefreshProfile = () => {
    // Здесь можно добавить логику обновления
    console.log('Обновление профиля');
  };

  const showLogout = location.pathname === '/';
  const isHomePage = location.pathname === '/';

  return (
    <>
      <main>
        <Routes>
          <Route 
            path="/profile" 
            element={
              <Profile 
                user={user}
                onPremiumClick={handlePremiumClick}
                onRefresh={handleRefreshProfile}
              />
            } 
          />
          <Route 
            path="/settings" 
            element={
              <Settings 
                settings={settings}
                onToggleQuietMode={handleToggleQuietMode}
                onThemeChange={handleThemeChange}
                onLanguageChange={handleLanguageChange}
              />
            } 
          />
          <Route 
            path="/stats" 
            element={<Stats stats={stats} />} 
          />
          <Route 
            path="/" 
            element={
              <Home 
                notificationCount={3}
                onNotificationClick={() => console.log('Notifications clicked')}
                onRecordClick={() => console.log('Record clicked')}
                onSearch={(value) => console.log('Search:', value)}
              />
            } 
          />
          <Route 
            path="/calendar" 
            element={<Calendar />} 
          />
        </Routes>
      </main>
      <BottomNav navItems={APP_CONFIG.navItems} />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;


