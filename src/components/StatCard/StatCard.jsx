import './StatCard.scss';

const StatCard = ({ label, value , valueColor }) => {

  return (
    <div className="stat-card">
      <span>{label}</span>
      <span className="stat-number" color={valueColor}>{value}</span>
    </div>
  );
};

export default StatCard;
