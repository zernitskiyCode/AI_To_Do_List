import './Calendar.scss';
import PageHeader from '../../components/PageHeader/PageHeader';

const Calendar = () => {

  
  return (
    <div className="calendar-page">
      <PageHeader 
        title="Календарь"
        subtitle="Планирование задач"
        icon="📅"
        variant="calendar"
      />
      
      <div className="calendar-page__content">
        <div className="stats-grid">
          <div className="stat-card">
            <span>Календарь</span>
            <span className="stat-number">-</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
