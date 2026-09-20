import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import styles from './LoginPage.module.css';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

export const SettingsPage: React.FC = () => {
  const { user, login, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileError, setProfileError] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const displayName = name || email || 'Профиль';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsAvatarRemoved(false);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    setSelectedFile(null);
    setIsAvatarRemoved(true);
    setAvatarUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    try {
      setLoadingProfile(true);

      let finalAvatarUrl: string | null = avatarUrl;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch(`${API_URL}/users/avatar`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Ошибка загрузки аватара');
        }

        finalAvatarUrl = data.avatarUrl;
      } else if (isAvatarRemoved) {
        await authService.deleteAvatar();
        finalAvatarUrl = null;
      }

      const updateData = await authService.updateProfile({
        name,
        email,
        avatarUrl: finalAvatarUrl,
      });

      const token = localStorage.getItem('userToken') || '';
      const updatedUser = updateData || {
        ...user,
        name,
        email,
        avatarUrl: finalAvatarUrl,
      };

      login(token, updatedUser as any);

      setSelectedFile(null);
      setIsAvatarRemoved(false);
      setProfileSuccess('Данные профиля успешно обновлены');
    } catch (err: any) {
      setProfileError(
        err.response?.data?.message || err.message || 'Ошибка обновления профиля'
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Заполните все поля пароля');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Длина нового пароля должна быть от 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }

    try {
      await authService.changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      setPasswordSuccess('Пароль успешно обновлен');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Не удалось изменить пароль');
    }
  };

  const renderAvatarSrc = () => {
    if (!avatarUrl) return null;
    if (
      avatarUrl.startsWith('http') ||
      avatarUrl.startsWith('data:') ||
      avatarUrl.startsWith('blob:')
    ) {
      return avatarUrl;
    }
    return `${API_URL}${avatarUrl}`;
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить аккаунт? Это действие необратимо и все ваши мероприятия будут удалены.'
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setDeleteError('');
      await deleteAccount();
      navigate('/', { replace: true });
    } catch (err: any) {
      setDeleteError(err.message || 'Ошибка при удалении аккаунта');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card} style={{ maxWidth: '520px', padding: '32px' }}>
        <h2 className={styles.title}>Настройки аккаунта</h2>
        <p className={styles.description}>Управление личным профилем и безопасностью</p>

        <form onSubmit={handleProfileSubmit} style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                overflow: 'hidden',
                marginBottom: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {avatarUrl ? (
                <img
                  src={renderAvatarSrc() || ''}
                  alt="Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                avatarLetter
              )}
            </div>

            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  fontSize: '13px',
                  padding: '6px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                }}
              >
                Загрузить фото
              </button>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  style={{
                    fontSize: '13px',
                    padding: '6px 12px',
                    border: '1px solid #fca5a5',
                    borderRadius: '6px',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    cursor: 'pointer',
                  }}
                >
                  Удалить
                </button>
              )}
            </div>
          </div>

          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#111827',
            }}
          >
            Личные данные
          </h3>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Имя пользователя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите ваше имя"
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Электронная почта</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={styles.input}
            />
          </div>

          {profileError && (
            <p className={styles.error} style={{ marginBottom: '12px' }}>
              {profileError}
            </p>
          )}

          {profileSuccess && (
            <p style={{ color: '#16a34a', fontSize: '14px', marginBottom: '12px' }}>
              {profileSuccess}
            </p>
          )}

          <button type="submit" className={styles.submitButton} disabled={loadingProfile}>
            {loadingProfile ? 'Сохранение...' : 'Сохранить данные профиля'}
          </button>
        </form>

        <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />

        <form onSubmit={handlePasswordSubmit}>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#111827',
            }}
          >
            Безопасность и пароль
          </h3>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Текущий пароль</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Новый пароль</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Подтвердите новый пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите новый пароль"
              className={styles.input}
            />
          </div>

          {passwordError && <p className={styles.error}>{passwordError}</p>}
          {passwordSuccess && (
            <p style={{ color: '#16a34a', fontSize: '14px', marginBottom: '12px' }}>
              {passwordSuccess}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            style={{ backgroundColor: '#374151' }}
          >
            Изменить пароль
          </button>
        </form>

        <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />

        <div
          style={{
            border: '1px solid #fecaca',
            backgroundColor: '#fef2f2',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#dc2626' }}>
            Удаление аккаунта
          </h3>
          <p style={{ fontSize: '14px', color: '#7f1d1d', marginBottom: '16px', lineHeight: '1.4' }}>
            После удаления аккаунта восстановить данные будет невозможно. Все ваши созданные мероприятия и настройки будут окончательно удалены.
          </p>

          {deleteError && (
            <p className={styles.error} style={{ marginBottom: '12px' }}>
              {deleteError}
            </p>
          )}

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.7 : 1,
            }}
          >
            {isDeleting ? 'Удаление...' : 'Удалить аккаунт'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;