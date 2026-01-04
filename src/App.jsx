import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav/BottomNav';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Stats from './pages/Stats/Stats';
import Calendar from './pages/Calendar/Calendar';
import './styles/style.scss';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);


  const handleAuthSuccess = (userData) => {
    setAuthUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setAuthUser(null);
    setIsAuthenticated(false);
  };

  const [user] = useState({
    name: authUser?.fullName || 'Пользователь',
    email: authUser?.email || 'user@example.com',
    avatar: authUser?.firstName?.[0] + authUser?.lastName?.[0] || 'УУ',
  });

  const [settings, setSettings] = useState({
    quietMode: true,
    theme: 'light',
    language: 'ru',
  });

  const handleToggleQuietMode = () => {
    setSettings((prev) => ({ ...prev, quietMode: !prev.quietMode }));
  };

  const handleThemeChange = (theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const handleLanguageChange = (language) => {
    setSettings((prev) => ({ ...prev, language }));
  };

  return (
    <>
      <Routes>
        <Route
          path="/profile"
          element={<Profile user={user} />}
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
        <Route path="/stats" element={<Stats />} />
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
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
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