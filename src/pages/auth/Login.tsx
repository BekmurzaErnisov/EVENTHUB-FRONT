import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }
    console.log('submit login form:', { email, password });
  };

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: 'calc(100vh - 73px)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ padding: '40px', maxWidth: '440px', width: '100%', backgroundColor: '#ffffff',
        borderRadius: '12px', border: '1px solid #F3F4F6', boxSizing: 'border-box' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '32px', fontWeight: '700',
          color: '#111827' }}>Вход</h2>
        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '15px', marginTop: 0,
          marginBottom: '32px', lineHeight: '1.5' }}>
          Войдите в свой аккаунт, чтобы управлять мероприятиями и покупать билеты
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600',
              color: '#111827' }}>Электронная почта</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@example.com"
                style={{ width: '100%', padding: '12px 12px 12px 42px', boxSizing: 'border-box',
                  border: '1px solid #D1D5DB', borderRadius: '8px', color: '#111827',
                  fontSize: '15px', outline: 'none' }}
              />
              <svg style={{ position: 'absolute', left: '14px', width: '18px', height: '18px',
                color: '#9CA3AF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>Пароль</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Введите пароль"
                style={{ width: '100%', padding: '12px 42px 12px 42px', boxSizing: 'border-box', border: '1px solid #D1D5DB', borderRadius: '8px', color: '#111827', fontSize: '15px', outline: 'none' }}
              />
              <svg style={{ position: 'absolute', left: '14px', width: '18px', height: '18px', color: '#9CA3AF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          
          {error && <p style={{ color: '#EF4444', fontSize: '14px', marginBottom: '16px', marginTop: '-8px' }}>{error}</p>}
          
          <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}>
            Войти
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 0 0', gap: '8px', fontSize: '14px', color: '#6B7280' }}>
            <span>Нет аккаунта?</span>
            <Link to="/register" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '600' }}>Зарегистрироваться</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
