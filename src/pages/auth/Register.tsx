import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    console.log('submit register form:', { name, email, password });
    alert('Регистрация прошла успешно!');
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: 'calc(100vh - 73px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px 0' }}>
      <div style={{ padding: '32px 40px', maxWidth: '440px', width: '100%', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '28px', fontWeight: '700', color: '#111827', marginTop: 0 }}>Регистрация</h2>
        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px', marginTop: 0, marginBottom: '24px', lineHeight: '1.4' }}>
          Создайте аккаунт, чтобы находить интересные мероприятия и быть в курсе событий рядом с вами.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>Ваше имя</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Например, Анна Иванова"
                style={{ width: '100%', padding: '10px 10px 10px 40px', boxSizing: 'border-box', border: '1px solid #D1D5DB', borderRadius: '8px', color: '#111827', fontSize: '14px', outline: 'none' }}
              />
              <svg style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#9CA3AF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>Электронная почта</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="example@mail.ru"
                style={{ width: '100%', padding: '10px 10px 10px 40px', boxSizing: 'border-box', border: '1px solid #D1D5DB', borderRadius: '8px', color: '#111827', fontSize: '14px', outline: 'none' }}
              />
              <svg style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#9CA3AF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>Пароль</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Минимум 6 символов"
                style={{ width: '100%', padding: '10px 40px 10px 40px', boxSizing: 'border-box', border: '1px solid #D1D5DB', borderRadius: '8px', color: '#111827', fontSize: '14px', outline: 'none' }}
              />
              <svg style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#9CA3AF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>Подтвердите пароль</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Введите пароль еще раз"
                style={{ width: '100%', padding: '10px 40px 10px 40px', boxSizing: 'border-box', border: '1px solid #D1D5DB', borderRadius: '8px', color: '#111827', fontSize: '14px', outline: 'none' }}
              />
              <svg style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#9CA3AF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          
          {error && <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px', marginTop: '-4px' }}>{error}</p>}
          
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '500' }}>
            Зарегистрироваться
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0 0 0', gap: '6px', fontSize: '14px', color: '#6B7280' }}>
            <span>Уже есть аккаунт?</span>
            <Link to="/login" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '600' }}>Войти</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
