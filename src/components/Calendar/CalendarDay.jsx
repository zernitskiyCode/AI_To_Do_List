import './CalendarDay.scss';

const CalendarDay = ({ dayData, tasks = [] }) => {
  const { day, isCurrentMonth, isToday } = dayData;

  // Группируем задачи по приоритетам для отображения
  const tasksByPriority = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  const totalTasks = tasks.length;

  return (
    <div 
      className={`calendar-day ${!isCurrentMonth ? 'calendar-day--other-month' : ''} ${isToday ? 'calendar-day--today' : ''}`}
    >
      <div className="calendar-day__number">{day}</div>
      
      {totalTasks > 0 && (
        <div className="calendar-day__tasks">
          {/* Показываем точки по приоритетам */}
          <div className="calendar-day__dots">
            {tasksByPriority.high > 0 && (
              <span className="calendar-day__dot calendar-day__dot--high" title={`${tasksByPriority.high} важных`}></span>
            )}
            {tasksByPriority.medium > 0 && (
              <span className="calendar-day__dot calendar-day__dot--medium" title={`${tasksByPriority.medium} средних`}></span>
            )}
            {tasksByPriority.low > 0 && (
              <span className="calendar-day__dot calendar-day__dot--low" title={`${tasksByPriority.low} низких`}></span>
            )}
          </div>
          
          {/* Показываем общее количество */}
          {totalTasks > 3 && (
            <div className="calendar-day__count">
              {totalTasks}
            </div>
          )}
        </div>
      )}
      
      {/* TODO: Добавить клик для открытия DayTasksModal */}
      {/* <button onClick={() => onDayClick(dayData.date)}>...</button> */}
    </div>
  );
};

export default CalendarDay;
