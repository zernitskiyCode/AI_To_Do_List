import { Link } from 'react-router-dom';

const Profile = ({ 
  user,
  onPremiumClick,
  onRefresh,
  onLogout
}) => {
  // Если user null или undefined — используем пустой объект
  const {
    name = 'Пользователь',
    email = '',
    surname = '',
  } = user;

  // Безопасное создание аватара (проверка на undefined)
  const avatar = (name?.[0]  + '') + (surname?.[0] + '');
  
  const handlePremiumClick = () => {
    if (onPremiumClick) {
      onPremiumClick();
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const menuItems = [
    { 
      icon: '📊', 
      label: 'Аккаунт', 
      to: '/settings',
      isLink: true 
    },
    { 
      icon: '👤', 
      label: 'Профиль',
      isLink: false 
    },
    { 
      icon: '💎', 
      label: 'Premium PRO',
      onClick: handlePremiumClick,
      isLink: false 
    },
    { 
      icon: '🔄', 
      label: 'Обновить',
      onClick: handleRefresh,
      isLink: false 
    },
    { 
      icon: '🚪', 
      label: 'Выход',
      onClick: handleLogout,
      isLink: false,
      isLogout: true
    },
  ];

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="avatar">{avatar}</div>
        <h2>{name}</h2>
        {email && <p className="email">{email}</p>}
      </div>

      <div className="premium-banner">
        <h3>Premium PRO</h3>
        <p>Неограниченные возможности и приоритетная поддержка</p>
        <button 
          className="btn btn--primary"
          onClick={handlePremiumClick}
          aria-label="Попробовать Premium PRO бесплатно"
        >
          Попробовать бесплатно
        </button>
      </div>

      <div className="settings-list">
        {menuItems.map((item, index) => {
          if (item.isLink) {
            return (
              <Link key={index} to={item.to} className="list-item">
                <span>{item.icon} {item.label}</span>
                <span>→</span>
              </Link>
            );
          }

          return (
            <div
              key={index}
              className={`list-item ${item.isLogout ? 'list-item--logout' : ''}`}
              onClick={item.onClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (item.onClick) {
                    item.onClick();
                  }
                }
              }}
            >
              <span>{item.icon} {item.label}</span>
              <span>→</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;



