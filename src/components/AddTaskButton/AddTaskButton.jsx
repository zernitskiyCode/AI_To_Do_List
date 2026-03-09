import './AddTaskButton.scss';

const AddTaskButton = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button className="add-task-button" onClick={handleClick}>
      <span className="add-task-button__icon">+</span>
      <span className="add-task-button__text">Добавить задачу вручную</span>
    </button>
  );
};

export default AddTaskButton;