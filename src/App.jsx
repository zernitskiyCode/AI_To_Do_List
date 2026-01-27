import { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useNavigate 
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BottomNav from './components/BottomNav/BottomNav';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Stats from './pages/Stats/Stats';
import Calendar from './pages/Calendar/Calendar';
import './styles/style.scss';
import Auth from './pages/Auth/Auth';
import { useAuth } from './hooks/useAuth';

// import Testing from './components/ForTesting/TokenTestComponent'


const APP_CONFIG = {
  title: 'Русский Продукт',
  navItems: [
    { path: '/', icon: '🏠', label: 'Главная' },
    { path: '/stats', icon: '📊', label: 'Статистика' },
    { path: '/calendar', icon: '📅', label: 'Календарь' },
    { path: '/profile', icon: '👤', label: 'Профиль' },
  ],
};

const queryClient = new QueryClient();


const MainApp = () => {

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
        <Route path="/profile" element={<Profile />} />
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
        <Route path="/stats" element={<Stats 
        
        />} />
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


const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Показываем лоадер пока проверяем авторизацию
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return isAuthenticated ? <MainApp /> : null;
};


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;