const StatCard = ({ label, value }) => {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <span className="stat-number">{value}</span>
    </div>
  );
};

export default StatCard;

