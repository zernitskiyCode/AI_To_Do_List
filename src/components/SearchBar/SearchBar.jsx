import './SearchBar.scss';

const SearchBar = ({ 
  placeholder = 'Поиск задач...',
  onSearch,
  value = ''
}) => {
  return (
    <div className="search-bar">
      <span className="search-bar__icon">🔍</span>
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearch && onSearch(e.target.value)}
        aria-label="Поиск задач"
      />
    </div>
  );
};

export default SearchBar;

