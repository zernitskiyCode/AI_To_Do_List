import { useState, useEffect } from 'react';
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
import { useAuthStore } from './hooks/useAuthStore';
import Api from './api/Api';


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
  const { user: authUser } = useAuthStore(); 
  const [user, setUser] = useState(null); // Начальное значение null
 
useEffect(() => {
    Api.get('/getInfoProfile', {
      params: { user_id: authUser.user_id }
    }).then(UserInfo => {
      const data = UserInfo.data;
      console.log(data);
      // Сохраняем данные в state
      setUser({
        name: data[0],
        email: data[2],
        surname: data[1]
      });
    });
  }, [authUser.user_id]);


  console.log(user)

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
        <Route path="/profile" element={<Profile user={user} />} />
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
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <MainApp /> : null;
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