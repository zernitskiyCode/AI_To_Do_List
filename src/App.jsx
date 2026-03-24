import { useState, useEffect } from 'react';
import { Navigate , useLocation } from 'react-router-dom';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useNavigate 
} from 'react-router-dom';
import BottomNav from './components/BottomNav/BottomNav';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Stats from './pages/Stats/Stats';
import Calendar from './pages/Calendar/Calendar';
import './styles/style.scss';
import Auth from './pages/Auth/Auth';
import { useAuth } from './hooks/useAuth';

import { useSettings } from './hooks/useSettings';




const APP_CONFIG = {
  title: 'Русский Продукт',
  navItems: [
    { path: '/', icon: '🏠', label: 'Главная' },
    { path: '/stats', icon: '📊', label: 'Статистика' },
    { path: '/calendar', icon: '📅', label: 'Календарь' },
    { path: '/profile', icon: '👤', label: 'Профиль' },
  ],
};


const MainApp = () => {
  const location = useLocation();
  const {theme, setLastRoute} = useSettings();

  useEffect(() => {
    setLastRoute(location.pathname);
  }, [location, setLastRoute]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);


  return (
    <>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/settings"
          element={
            <Settings />
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
  const { lastRoute } = useSettings();

  useEffect(() => {
    if (!isLoading && isAuthenticated && lastRoute && lastRoute !== '/auth') {
      navigate(lastRoute, { replace: true });
    }
  }, [isLoading, isAuthenticated, lastRoute, navigate]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Проверка авторизации...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <MainApp />;
};


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
};

export default App;