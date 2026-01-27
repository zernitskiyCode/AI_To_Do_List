import './VoiceInputCard.scss';

const VoiceInputCard = ({ 
  onRecordClick 
}) => {
  return (
    <div className="voice-input-card">
      <button 
        className="voice-input-card__button"
        onClick={onRecordClick}
        aria-label="Начать запись голосовой задачи"
      >
        <span className="voice-input-card__icon">🎤</span>
      </button>
      <div className="voice-input-card__text">
        <p className="voice-input-card__title">Нажмите для записи</p>
        <p className="voice-input-card__subtitle">Расскажите о ваших задачах</p>
      </div>
    </div>
  );
};

export default VoiceInputCard;

