import { useState, useEffect } from 'react';
import './DateTimePicker.scss';

const DateTimePicker = ({ value, onChange, label = "Срок выполнения" }) => {
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Пресеты для быстрого выбора
  const presets = [
    {
      id: 'today',
      label: 'Сегодня',
      icon: '📅',
      getValue: () => {
        const today = new Date();
        today.setHours(23, 59, 0, 0);
        return formatDateTimeLocal(today);
      }
    },
    {
      id: 'tomorrow',
      label: 'Завтра',
      icon: '🌅',
      getValue: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 0, 0);
        return formatDateTimeLocal(tomorrow);
      }
    },
    {
      id: 'week',
      label: 'Через неделю',
      icon: '📆',
      getValue: () => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(23, 59, 0, 0);
        return formatDateTimeLocal(nextWeek);
      }
    }
  ];

  // Форматирование даты для input type="datetime-local"
  const formatDateTimeLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Форматирование для отображения
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePresetClick = (preset) => {
    const newValue = preset.getValue();
    setSelectedPreset(preset.id);
    onChange(newValue);
  };

  const handleInputChange = (e) => {
    setSelectedPreset(null);
    onChange(e.target.value);
  };

  const handleClear = () => {
    setSelectedPreset(null);
    onChange('');
  };


  useEffect(() => {
    if (!value) {
      // Раскомментируй, если хочешь автоматически ставить "Завтра"
      // const tomorrowPreset = presets.find(p => p.id === 'tomorrow');
      // handlePresetClick(tomorrowPreset);
    }
  }, []);

  return (
    <div className="datetime-picker">
      <label className="datetime-picker__label">{label}</label>
      
      {/* Быстрые пресеты */}
      <div className="datetime-picker__presets">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`datetime-preset ${selectedPreset === preset.id ? 'datetime-preset--active' : ''}`}
            onClick={() => handlePresetClick(preset)}
          >
            <span className="datetime-preset__icon">{preset.icon}</span>
            <span className="datetime-preset__label">{preset.label}</span>
          </button>
        ))}
      </div>

      {/* Основной input */}
      <div className="datetime-picker__input-wrapper">
        {!value && (
          <span className="datetime-picker__placeholder">
            Выберите дату и время...
          </span>
        )}
        <input
          type="datetime-local"
          className={`datetime-picker__input ${!value ? 'datetime-picker__input--empty' : ''}`}
          value={value}
          onChange={handleInputChange}
          min={new Date().toISOString().slice(0, 16)} // Запрет выбора прошлого
        />
        {value && (
          <button
            type="button"
            className="datetime-picker__clear"
            onClick={handleClear}
            title="Очистить дату"
          >
            ✕
          </button>
        )}
      </div>

      {/* Отображение выбранной даты */}
      {value && (
        <div className="datetime-picker__display">
          <span className="datetime-picker__display-icon">🕐</span>
          <span className="datetime-picker__display-text">
            {formatDisplayDate(value)}
          </span>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
