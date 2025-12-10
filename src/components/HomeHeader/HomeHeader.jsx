import './HomeHeader.scss';

const HomeHeader = ({ 
  title = 'AI Задачи',
  date = '',
  notificationCount = 0,
  onNotificationClick 
}) => {
  const formatDate = () => {
    if (date) return date;
    
    const today = new Date();
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                   'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
    const dayName = days[today.getDay()];
    const day = today.getDate();
    const month = months[today.getMonth()];
    
    return `${dayName}, ${day} ${month}`;
  };

  return (
    <div className="home-header">
      <div className="home-header__left">
        <div className="home-header__title">
          <span className="home-header__icon">⚡</span>
          <h1>{title}</h1>
        </div>
        <p className="home-header__date">{formatDate()}</p>
      </div>
      <button 
        className="home-header__notifications"
        onClick={onNotificationClick}
        aria-label={`Уведомления${notificationCount > 0 ? ` (${notificationCount})` : ''}`}
      >
        <span className="home-header__bell">🔔</span>
        {notificationCount > 0 && (
          <span className="home-header__badge">{notificationCount}</span>
        )}
      </button>
    </div>
  );
};

export default HomeHeader;

