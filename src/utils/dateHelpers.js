/**
 * Утилиты для работы с датами в календаре
 */

/**
 * Получить все дни месяца с учетом предыдущего/следующего месяца для заполнения сетки
 * @param {number} year - Год
 * @param {number} month - Месяц (0-11)
 * @returns {Array} Массив объектов дней
 */
export const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Получаем день недели первого дня (0 = воскресенье, нужно сделать 0 = понедельник)
  let firstDayOfWeek = firstDay.getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Понедельник = 0
  
  const daysInMonth = lastDay.getDate();
  const days = [];
  
  // Добавляем дни из предыдущего месяца
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(year, month - 1, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: false,
    });
  }
  
  // Добавляем дни текущего месяца
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      day,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
    });
  }
  
  // Добавляем дни из следующего месяца (чтобы заполнить сетку до 42 ячеек = 6 недель)
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: false,
    });
  }
  
  return days;
};

/**
 * Проверить, совпадают ли две даты (игнорируя время)
 * @param {Date|string} date1 
 * @param {Date|string} date2 
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Проверить, является ли дата сегодняшним днем
 * @param {Date|string} date 
 * @returns {boolean}
 */
export const isToday = (date) => {
  return isSameDay(date, new Date());
};

/**
 * Форматировать месяц и год для отображения
 * @param {Date} date 
 * @returns {string} "Март 2026"
 */
export const formatMonthYear = (date) => {
  return date.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Получить название месяца
 * @param {number} month - Месяц (0-11)
 * @returns {string}
 */
export const getMonthName = (month) => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  return months[month];
};

/**
 * Группировать задачи по датам
 * @param {Array} tasks - Массив задач
 * @returns {Object} Объект { 'YYYY-MM-DD': [tasks] }
 */
export const groupTasksByDate = (tasks) => {
  const grouped = {};
  
  tasks.forEach(task => {
    if (!task.dueDate) return; // Пропускаем задачи без дедлайна
    
    const date = new Date(task.dueDate);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(task);
  });
  
  return grouped;
};

/**
 * Получить ключ даты в формате YYYY-MM-DD
 * @param {Date} date 
 * @returns {string}
 */
export const getDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Проверить, находится ли дата в прошлом
 * @param {Date|string} date 
 * @returns {boolean}
 */
export const isPast = (date) => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
};
