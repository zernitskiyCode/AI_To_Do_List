import HomeHeader from '../../components/HomeHeader/HomeHeader';
import VoiceInputCard from '../../components/VoiceInputCard/VoiceInputCard';
import SearchBar from '../../components/SearchBar/SearchBar';

const Home = ({ 
  notificationCount = 0,
  onNotificationClick,
  onRecordClick,
  onSearch 
}) => {
  return (
    <div className="home-page">
      <HomeHeader 
        notificationCount={notificationCount}
        onNotificationClick={onNotificationClick}
      />
      <VoiceInputCard onRecordClick={onRecordClick} />
      <SearchBar onSearch={onSearch} />
    </div>
  );
};

export default Home;
