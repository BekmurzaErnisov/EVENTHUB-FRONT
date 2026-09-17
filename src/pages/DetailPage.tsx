import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, CircleDollarSign, MapPin, ShieldCheck, UserRound, UsersRound } from 'lucide-react';
import styles from './DetailPage.module.css';
import { authService } from '../services/auth.service';

interface EventDetails {
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  imageUrl?: string;
  category?: { name: string } | null;
  organizer?: { name: string } | null;
}

const API_URL = 'http://localhost:3000';

function DetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Мероприятие не найдено');
      setLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/events/${id}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || 'Мероприятие не найдено');
        setEvent(data);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!id) return;
    if (!authService.getToken()) {
      setError('Нужно войти в аккаунт, чтобы записаться на мероприятие');
      return;
    }

    try {
      setError('');
      const response = await fetch(`${API_URL}/events/${id}/register`, {
        method: 'POST',
        headers: authService.getAuthHeader(),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Не удалось записаться на мероприятие');
      setIsRegistered(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ошибка записи');
    }
  };

  if (loading) return <div>Загрузка мероприятия...</div>;
  if (error && !event) return <div>{error}</div>;
  if (!event) return <div>Мероприятие не найдено</div>;

  return (
    <div className={styles.eventPage}>
      <div className={styles.mainContent}>
        {event.imageUrl && <img src={`${API_URL}${event.imageUrl}`} alt={event.title} className={styles.bannerImage} />}
        <div className={styles.descriptionBlock}>
          <h2>О мероприятии</h2>
          <p>{event.description}</p>
        </div>
      </div>

      <div className={styles.eventDetails}>
        <span className={styles.eventDetailsDesc}>{event.category?.name || 'Мероприятие'}</span>
        <h1>{event.title}</h1>
        <div><CalendarDays className={styles.detailIcon} size={20} /><p>{new Date(event.date).toLocaleString('ru-RU')}</p></div>
        <div>
          <MapPin className={styles.detailIcon} size={20} />
          <div className={styles.addressContent}>
            <span>{event.location}</span>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noreferrer">Показать на карте</a>
          </div>
        </div>
        <div><CircleDollarSign className={styles.detailIcon} size={20} /><span>{event.price ? `от ${event.price} ₽` : 'Бесплатно'}</span></div>
        <div><UsersRound className={styles.detailIcon} size={20} /><span>Мест всего: {event.capacity}</span></div>
        <div><UserRound className={styles.detailIcon} size={20} /><span>{event.organizer?.name || 'Организатор'}</span></div>
        <button onClick={handleRegister} disabled={isRegistered}>{isRegistered ? 'Вы записаны' : 'Записаться'}</button>
        {error && <p>{error}</p>}
        <div className={styles.protectionNotice}><ShieldCheck className={styles.detailIcon} size={20} /><span>Ваши данные защищены. Запись поможет организатору подготовить мероприятие.</span></div>
      </div>
    </div>
  );
}

export default DetailPage;
