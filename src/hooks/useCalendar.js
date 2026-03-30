import { useState, useMemo } from 'react';
import { getMonthDays, groupTasksByDate } from '../utils/dateHelpers';

/**
 * Хук для управления состоянием календаря
 */
export const useCalendar = (tasks = []) => {
  const today = new Date();
  
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Генерация дней месяца
  const monthDays = useMemo(() => {
    return getMonthDays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Группировка задач по датам
  const tasksByDate = useMemo(() => {
    return groupTasksByDate(tasks);
  }, [tasks]);

  // Навигация: следующий месяц
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Навигация: предыдущий месяц
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Переход на текущий месяц
  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };

  return {
    currentMonth,
    currentYear,
    monthDays,
    tasksByDate,
    nextMonth,
    prevMonth,
    goToToday,
  };
};
