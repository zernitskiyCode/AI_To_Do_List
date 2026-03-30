import './CalendarHeader.scss';
import { getMonthName } from '../../utils/dateHelpers';

const CalendarHeader = ({ currentMonth, currentYear, onPrevMonth, onNextMonth, onToday }) => {
  return (
    <div className="calendar-header">
      <div className="calendar-header__title">
        <h2 className="calendar-header__month">
          {getMonthName(currentMonth)} {currentYear}
        </h2>
      </div>
      
      <div className="calendar-header__controls">
        <button
          className="calendar-header__btn calendar-header__btn--prev"
          onClick={onPrevMonth}
          aria-label="Предыдущий месяц"
        >
          ←
        </button>
        
        <button
          className="calendar-header__btn calendar-header__btn--today"
          onClick={onToday}
        >
          Сегодня
        </button>
        
        <button
          className="calendar-header__btn calendar-header__btn--next"
          onClick={onNextMonth}
          aria-label="Следующий месяц"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
