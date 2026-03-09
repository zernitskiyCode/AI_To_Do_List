import { useEffect } from 'react';
import './AddTaskModal.scss';
import {usePortal} from '../../hooks/usePortal'
import AddTaskForm from './AddTaskForm';

const AddTaskModal = ({ isActive, onClose }) => {  

  const { Portal } = usePortal();

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

  return (
    <Portal>
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
          <AddTaskForm onClose={onClose} />
        </div>
      </div>
    </div>
    </Portal>
  );
};

export default AddTaskModal;


