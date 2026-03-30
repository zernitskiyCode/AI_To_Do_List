import './CalendarGrid.scss';
import CalendarDay from './CalendarDay';
import { getDateKey } from '../../utils/dateHelpers';

const CalendarGrid = ({ monthDays, tasksByDate }) => {
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="calendar-grid">
      {/* Заголовки дней недели */}
      <div className="calendar-grid__header">
        {weekDays.map((day) => (
          <div key={day} className="calendar-grid__weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Сетка дней */}
      <div className="calendar-grid__days">
        {monthDays.map((dayData, index) => {
          const dateKey = getDateKey(dayData.date);
          const tasksForDay = tasksByDate[dateKey] || [];

          return (
            <CalendarDay
              key={index}
              dayData={dayData}
              tasks={tasksForDay}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
