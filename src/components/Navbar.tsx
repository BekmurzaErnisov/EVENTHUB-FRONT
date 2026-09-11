import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    console.log('search searchQuery:', searchQuery);
    navigate(`/profile?search=${searchQuery}`); 
  };

  const isEventsActive = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';
  const isMyEventsActive = location.pathname === '/profile';

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 40px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #E5E7EB',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: '#0A2540', 
          textDecoration: 'none'
        }}>
          Event<span style={{ color: '#2563EB' }}>Hub</span>
        </Link>

        <div style={{ display: 'flex', gap: '24px' }}>
          <Link to="/" style={{ 
            color: isEventsActive ? '#2563EB' : '#4B5563', 
            textDecoration: 'none', 
            fontSize: '15px', 
            fontWeight: '500'
          }}>
            Мероприятия
          </Link>
          <Link to="/profile" style={{ 
            color: isMyEventsActive ? '#2563EB' : '#4B5563', 
            textDecoration: 'none', 
            fontSize: '15px', 
            fontWeight: '500'
          }}>
            Мои мероприятия
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: '8px 36px 8px 12px', 
              borderRadius: '6px', 
              border: 'none', 
              backgroundColor: 'transparent', 
              color: '#111827',
              fontSize: '14px',
              outline: 'none',
              width: '40px',
              cursor: 'pointer'
            }}
          />
          <button type="submit" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg style={{ width: '20px', height: '20px', color: '#4B5563' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/login" style={{ 
            color: '#1F2937', 
            textDecoration: 'none', 
            padding: '10px 20px', 
            borderRadius: '6px', 
            border: '1px solid #E5E7EB',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: '#ffffff'
          }}>
            Войти
          </Link>
          <Link to="/register" style={{ 
            color: '#ffffff', 
            textDecoration: 'none', 
            padding: '10px 20px', 
            borderRadius: '6px', 
            backgroundColor: '#2563EB', 
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Зарегистрироваться
          </Link>
        </div>
      </div>

    </nav>
  );
};
