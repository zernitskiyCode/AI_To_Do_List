import './PageHeader.scss';

const PageHeader = ({ 
  title = 'Заголовок',
  subtitle = '',
  icon = '⚡',
  variant = 'default', // 'default', 'stats','calendar'
  showNotifications = false,
  notificationCount = 0,
  onNotificationClick,
  showDate = false,
  date = '',
  className = ''
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

  const headerClasses = `page-header page-header--${variant} ${className}`.trim();

  return (
    <div className={headerClasses}>
      <div className="page-header__content">
        <div className="page-header__title">
          <span className="page-header__icon">{icon}</span>
          <h1>{title}</h1>
        </div>
        {(subtitle || showDate) && (
          <p className="page-header__subtitle">
            {showDate ? formatDate() : subtitle}
          </p>
        )}
      </div>
      
      {showNotifications && (
        <button 
          className="page-header__notifications"
          onClick={onNotificationClick}
          aria-label={`Уведомления${notificationCount > 0 ? ` (${notificationCount})` : ''}`}
        >
          <span className="page-header__bell">🔔</span>
          {notificationCount > 0 && (
            <span className="page-header__badge">{notificationCount}</span>
          )}
        </button>
      )}
    </div>
  );
};

export default PageHeader;