import './Header.scss';

const Header = ({ 
  title = 'Русский Продукт',
  showLogout = false, 
  onLogout 
}) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('Выход из аккаунта');
    }
  };

  return (
    <header>
      <h1>{title}</h1>
      {showLogout ? (
        <button 
          className="btn btn--logout" 
          onClick={handleLogout}
          aria-label="Выйти из аккаунта"
        >
          → Выйти из аккаунта
        </button>
      ) : (
        <div></div>
      )}
    </header>
  );
};

export default Header;
