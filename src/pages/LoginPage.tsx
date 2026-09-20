import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { authService } from '../services/auth.service';
import { useAuth } from '../AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setLoading(true);
      const data = await authService.login({ email, password });
      const token = data.access_token;
      const refreshToken = data.refresh_token || data.refreshToken;
      const fallbackName = email.split('@')[0];
      const userData = data.user || { email, name: fallbackName };

      if (token) {
        login(token, refreshToken, userData as any);
        navigate(from, { replace: true });
      } else {
        setError('Токен не получен');
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Вход</h2>
        <p className={styles.description}>
          Войдите в свой аккаунт, чтобы управлять мероприятиями и покупать билеты
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Электронная почта</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={styles.input}
              />
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div className={styles.passwordGroup}>
            <label className={styles.label}>Пароль</label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className={styles.input}
              />
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            Войти
          </button>

          <div className={styles.footer}>
            <span>Нет аккаунта?</span>
            <Link className={styles.registerLink} to="/register">Зарегистрироваться</Link>
          </div>
        </form>
      </div>
    </div>
  );
};