import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const getLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/my-events?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>

        <div className={styles.brandSection}>
          <NavLink to="/" className={styles.brand}>
            Event<span className={styles.brandAccent}>Hub</span>
          </NavLink>

          <div className={styles.mainLinks}>
            <NavLink to="/" end className={getLinkClass}>
              Главная
            </NavLink>
            <NavLink to="/my-events" className={getLinkClass}>
              Мои события
            </NavLink>
            <NavLink to="/create-event" className={getLinkClass}>
              Создать событие
            </NavLink>
          </div>
        </div>

        <div className={styles.actions}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input 
              type="text" 
              placeholder="Поиск..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className={styles.authLinks}>
            <NavLink to="/login" className={styles.authLink}>
              Вход
            </NavLink>
            <NavLink to="/register" className={`${styles.authLink} ${styles.registerLink}`}>
              Регистрация
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;