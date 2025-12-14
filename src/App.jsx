import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav/BottomNav';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Stats from './pages/Stats/Stats';
import Calendar from './pages/Calendar/Calendar';
import Auth from './pages/Auth/Auth';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Проверяем, есть ли пользователь в localStorage при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    console.log('Checking saved user:', savedUser);
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('Loading user data:', userData);
        setAuthUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
      }
    }
  }, []);

  // Обработчик успешной авторизации
  const handleAuthSuccess = (userData) => {
    console.log('Auth success:', userData);
    setAuthUser(userData);
    setIsAuthenticated(true);
  };

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.removeItem('user');
    setAuthUser(null);
    setIsAuthenticated(false);
  };
  
  // Состояние пользователя
  const [user] = useState({
    name: authUser?.fullName || 'Пользователь',
    email: 'user@example.com',
    avatar: authUser?.firstName?.[0] + authUser?.lastName?.[0] || 'УУ',
  });

  // Статистика для главной страницы
  const [stats] = useState({
    voiceRecords: 12,
    averageCompletionTime: '2.5h',
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
  const handleLogoutClick = () => {
    handleLogout();
  };

  // Обработчик Premium
  const handlePremiumClick = () => {
    console.log('Premium PRO');
  };

  // Обработчик обновления профиля
  const handleRefreshProfile = () => {
    console.log('Обновление профиля');
  };

  // Если пользователь не авторизован, показываем только страницу авторизации
  if (!isAuthenticated) {
    console.log('User not authenticated, showing auth page');
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }
  
  console.log('User authenticated, showing app:', authUser);

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
                onLogout={handleLogoutClick}
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


