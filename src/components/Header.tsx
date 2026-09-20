import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import styles from "./Header.module.css";

const API_URL = "http://localhost:3000";

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, logout } = useAuth();

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayName = user?.name || user?.email || "Профиль";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const getAvatarSrc = (url?: string) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:")) {
      return url;
    }
    return `${API_URL}${url}`;
  };

  const avatarSrc = getAvatarSrc(user?.avatarUrl);

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

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => navigate("/create-event")}
              className={styles.createButton}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Создать</span>
            </button>
          )}

          <div className={styles.authLinks}>
            {isAuthenticated ? (
              <div className={styles.profileMenuContainer} ref={menuRef}>
                <button
                  type="button"
                  className={styles.profileTrigger}
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                  <div className={styles.avatar}>
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={displayName} className={styles.avatarImg} />
                    ) : (
                      <span>{avatarLetter}</span>
                    )}
                  </div>
                  <span className={styles.userName}>{displayName}</span>
                </button>

                {isMenuOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.menuHeader}>
                      <p className={styles.menuName}>{displayName}</p>
                      {user?.email && (
                        <p className={styles.menuEmail}>{user.email}</p>
                      )}
                    </div>
                    <hr className={styles.divider} />
                    <Link
                      to="/settings"
                      className={styles.menuItem}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Настройки аккаунта
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className={`${styles.menuItem} ${styles.logoutBtn}`}
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
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