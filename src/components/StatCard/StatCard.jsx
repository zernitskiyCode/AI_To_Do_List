import './StatCard.scss';

const StatCard = ({ value, type, subtitle }) => {
  
  const getIcon = (type) => {
    switch (type) {
      case 'completed':
        return <img src="/icons8-checkmark-64.png" alt="completed" className="stat-card__icon" />;
      case 'ready':
        return <span className="stat-card__emoji">✅</span>;
      case 'total':
        return <span className="stat-card__emoji">📋</span>;
      case 'streak':
        return <span className="stat-card__emoji">🔥</span>;
      default:
        return null;
    }
  };

  const cardClasses = `stat-card ${type ? `stat-card--${type}` : ''}`.trim();
  
  // Отладка - можно убрать позже
  console.log('StatCard type:', type, 'classes:', cardClasses);

  return (
    <div className={cardClasses}>
      <div className="stat-card__header">
        {getIcon(type)}
        <span className="stat-card__value">{value}</span>
      </div>
      {subtitle && (
        <span className="stat-card__subtitle">{subtitle}</span>
      )}
    </div>
  );
};

export default StatCard;
