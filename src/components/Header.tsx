import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { isAuthenticated, logout } = useAuth();

  const getLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/my-events?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSearchClick = () => {
    if (isSearchOpen && searchQuery.trim()) {
      searchInputRef.current?.form?.requestSubmit();
      return;
    }

    setIsSearchOpen(true);
  };

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.brandSection}>
          <NavLink to="/" end className={styles.brand}>
            Event<span className={styles.brandAccent}>Hub</span>
          </NavLink>

          <div className={styles.mainLinks}>
            <NavLink to="/events" className={getLinkClass}>
              Мероприятия
            </NavLink>
            <NavLink to="/my-events" className={getLinkClass}>
              Мои мероприятия
            </NavLink>
          </div>
        </div>

        <div className={styles.actions}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                if (!searchQuery.trim()) setIsSearchOpen(false);
              }}
              aria-label="Поиск"
              className={`${styles.searchInput} ${isSearchOpen ? styles.searchInputOpen : ""}`}
            />
            <button
              type="button"
              onClick={handleSearchClick}
              className={styles.searchButton}
              aria-label="Открыть поиск"
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          <div className={styles.authLinks}>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className={styles.authLink}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Выйти
              </button>
            ) : (
              <>
                <NavLink to="/login" className={styles.authLink}>
                  Войти
                </NavLink>
                <NavLink
                  to="/register"
                  className={`${styles.authLink} ${styles.registerLink}`}
                >
                  Зарегистрироваться
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
