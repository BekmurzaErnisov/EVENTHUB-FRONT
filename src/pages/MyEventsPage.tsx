import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Edit2, Trash2, LogOut } from 'lucide-react';
import { eventService } from '../services/event.service';
import { authService } from '../services/auth.service';
import styles from './MyEventsPage.module.css';

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  imageUrl?: string;
  category?: { name: string } | null;
}

interface MyEventsResponse {
  created?: EventItem[];
  joined?: EventItem[];
}

function MyEventsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'created' | 'joined'>('created');
  const [createdEvents, setCreatedEvents] = useState<EventItem[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authService.getToken()) {
      setIsLoading(false);
      setError('Пожалуйста, войдите в аккаунт');
      return;
    }

    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await eventService.getMyEvents() as EventItem[] | MyEventsResponse;

        if (Array.isArray(data)) {
          setCreatedEvents(data);
          setJoinedEvents([]);
        } else {
          setCreatedEvents(data.created || []);
          setJoinedEvents(data.joined || []);
        }
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Ошибка загрузки');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleDeleteCreated = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить это мероприятие?')) return;

    try {
      await eventService.deleteEvent(id);
      setCreatedEvents((events) => events.filter((event) => event.id !== id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось удалить мероприятие');
    }
  };

  const handleCancelJoined = async (id: string) => {
    if (!window.confirm('Отменить запись на мероприятие?')) return;

    try {
      await eventService.cancelRegistration(id);
      setJoinedEvents((events) => events.filter((event) => event.id !== id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось отменить запись');
    }
  };

  if (isLoading) return <div className={styles.container}><p>Загрузка...</p></div>;

  if (error && !createdEvents.length && !joinedEvents.length) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>{error}</p>
          {!authService.getToken() && <button className={styles.createBtn} onClick={() => navigate('/login')}>Войти</button>}
        </div>
      </div>
    );
  }

  const currentEvents = activeTab === 'created' ? createdEvents : joinedEvents;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Мои мероприятия</h1>
        <p className={styles.subtitle}>Управляйте созданными событиями и своими записями</p>
      </header>

      <div className={styles.tabsContainer}>
        <button className={`${styles.tabButton} ${activeTab === 'created' ? styles.activeTab : ''}`} onClick={() => setActiveTab('created')}>
          Созданные мной ({createdEvents.length})
        </button>
        <button className={`${styles.tabButton} ${activeTab === 'joined' ? styles.activeTab : ''}`} onClick={() => setActiveTab('joined')}>
          Я записан ({joinedEvents.length})
        </button>
      </div>

      {error && <p>{error}</p>}

      {!currentEvents.length ? (
        <div className={styles.emptyState}>
          <p>{activeTab === 'created' ? 'Вы ещё не создали ни одного мероприятия.' : 'Вы пока не записаны ни на одно мероприятие.'}</p>
          {activeTab === 'created' && <button className={styles.createBtn} onClick={() => navigate('/events/create')}>Создать мероприятие</button>}
        </div>
      ) : (
        <div className={styles.grid}>
          {currentEvents.map((event) => (
            <article key={event.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                {event.imageUrl && <img src={`http://localhost:3000${event.imageUrl}`} alt={event.title} className={styles.image} />}
                <span className={styles.categoryBadge}>{event.category?.name || 'Мероприятие'}</span>
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.eventTitle}>{event.title}</h2>
                <div className={styles.infoRow}><CalendarDays size={16} className={styles.icon} /><span>{new Date(event.date).toLocaleString('ru-RU')}</span></div>
                <div className={styles.infoRow}><MapPin size={16} className={styles.icon} /><span className={styles.locationText}>{event.location}</span></div>
                <div className={styles.priceRow}><span className={styles.price}>{event.price ? `${event.price} ₽` : 'Бесплатно'}</span></div>
                <div className={styles.actions}>
                  {activeTab === 'created' ? (
                    <>
                      <button className={styles.editBtn} onClick={() => navigate(`/events/${event.id}/edit`)}><Edit2 size={16} />Редактировать</button>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteCreated(event.id)} aria-label="Удалить мероприятие"><Trash2 size={16} /></button>
                    </>
                  ) : (
                    <button className={styles.cancelBtn} onClick={() => handleCancelJoined(event.id)}><LogOut size={16} />Отменить запись</button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyEventsPage;
