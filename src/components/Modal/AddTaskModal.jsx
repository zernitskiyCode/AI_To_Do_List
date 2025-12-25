import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './AddTaskModal.scss';

const AddTaskModal = ({ isActive, onClose }) => {  

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isActive]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isActive) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isActive, onClose]);

  if (!isActive) return null;

  return createPortal(
    <div className="add-task-modal" onClick={handleBackdropClick}>
      <div className="add-task-modal__content">
        <button 
          className="add-task-modal__close" 
          onClick={onClose}
          aria-label="Закрыть модальное окно"
        >
          ×
        </button>
        <div className="add-task-modal__body">
          {/* Здесь будет содержимое модального окна */}
          <h2>Добавить задачу</h2>
          <p>Модальное окно работает!</p>
        </div>
      </div>
    </div>
    ,
    document.getElementById('addTask_modal-root')  
  );
};

export default AddTaskModal;


