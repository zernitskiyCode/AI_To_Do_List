import StatCard from '../../components/StatCard/StatCard';

const Stats = ({ stats = {} }) => {
  const {
    voiceRecords = 0,
    averageCompletionTime = '0ч',
    completed = 0,
    daysInRow = 0,
  } = stats;

  const statCards = [
    { label: 'Голосовых записей', value: voiceRecords },
    { label: 'Среднее время выполнения', value: averageCompletionTime },
    { label: 'Выполнено', value: completed },
    { label: 'Дней подряд', value: daysInRow > 0 ? `🔥 ${daysInRow}` : '0' },
  ];

  return (
    <>
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <StatCard key={index} label={card.label} value={card.value} />
        ))}
      </div>
    </>
  );
};

export default Stats;


