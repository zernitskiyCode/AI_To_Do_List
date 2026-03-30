import './Calendar.scss';
import PageHeader from '../../components/PageHeader/PageHeader';
import CalendarHeader from '../../components/Calendar/CalendarHeader';
import CalendarGrid from '../../components/Calendar/CalendarGrid';
import { useCalendar } from '../../hooks/useCalendar';
import { useTasks } from '../../hooks/useTasks';

const Calendar = () => {
  const { tasks, isLoading } = useTasks();
  
  const {
    currentMonth,
    currentYear,
    monthDays,
    tasksByDate,
    nextMonth,
    prevMonth,
    goToToday,
  } = useCalendar(tasks);

  if (isLoading) {
    return (
      <div className="calendar-page">
        <PageHeader 
          title="Календарь"
          subtitle="Планирование задач"
          icon="📅"
          variant="calendar"
        />
        <div className="calendar-page__content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Загрузка календаря...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <PageHeader 
        title="Календарь"
        subtitle="Планирование задач"
        icon="📅"
        variant="calendar"
      />
      
      <div className="calendar-page__content">
        <CalendarHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onToday={goToToday}
        />
        
        <CalendarGrid
          monthDays={monthDays}
          tasksByDate={tasksByDate}
        />
        
        {/* TODO: Добавить DayTasksModal для отображения задач на выбранный день */}
        {/* <DayTasksModal 
          isOpen={selectedDate !== null}
          date={selectedDate}
          tasks={tasksForSelectedDate}
          onClose={() => setSelectedDate(null)}
        /> */}
      </div>
    </div>
  );
};

export default Calendar;
