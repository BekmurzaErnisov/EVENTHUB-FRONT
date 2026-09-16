import styles from './EventsPage.module.css';
import { CalendarDays, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdAt: string;
  category?: { name: string } | null;
}

interface Category {
  id: number;
  name: string;
}

const API_URL = 'http://localhost:3000';

function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sort, setSort] = useState('nearest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError('');
        const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
        const response = await fetch(`${API_URL}/events${query}`);
        if (!response.ok) throw new Error('Не удалось загрузить мероприятия');
        setEvents(await response.json());
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    const timer = window.setTimeout(loadEvents, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((response) => response.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter((event) => event.category?.name === selectedCategory);

  const visibleEvents = [...filteredEvents].sort((first, second) => {
    if (sort === 'title') return first.title.localeCompare(second.title);
    if (sort === 'oldest') return new Date(first.date).getTime() - new Date(second.date).getTime();
    if (sort === 'added') return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    if (sort === 'newest') return new Date(second.date).getTime() - new Date(first.date).getTime();
    return new Date(first.date).getTime() - new Date(second.date).getTime();
  });

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1>Афиша мероприятий</h1>
        <p>Открывайте интересные события рядом с вами</p>

        <div className={styles.filters}>
          <label className={styles.searchField}>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Поиск мероприятий по названию..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            aria-label="Категория мероприятия"
          >
            <option value="all">Все категории</option>
            {categories.map((category) => (
              <option value={category.name} key={category.id}>{category.name}</option>
            ))}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Сортировка мероприятий">
            <option value="nearest">Сначала ближайшие</option>
            <option value="oldest">Сначала старые</option>
            <option value="added">По дате добавления</option>
            <option value="newest">Сначала новые</option>
            <option value="title">По названию</option>
          </select>
        </div>
      </section>

      <section className={styles.eventsSection}>
        <h2>Ближайшие мероприятия</h2>
        <button type="button" className={styles.showAll}>Показать все</button>
      </section>

      {loading && <p className={styles.status}>Загрузка мероприятий...</p>}
      {!loading && error && <p className={styles.status}>{error}</p>}
      {!loading && !error && visibleEvents.length === 0 && (
        <p className={styles.status}>Мероприятий пока нет.</p>
      )}
      {!loading && !error && visibleEvents.length > 0 && <section className={styles.eventsGrid} aria-label="Список мероприятий">
        {visibleEvents.map((event) => (
          <article className={styles.eventCard} key={event.id}>
            <div className={styles.imageWrapper}>
              <div className={styles.imagePlaceholder} aria-hidden="true">{event.category?.name?.slice(0, 1) || 'М'}</div>
              <span className={styles.category}>{event.category?.name || 'Мероприятие'}</span>
            </div>
            <div className={styles.cardContent}>
              <h3>{event.title}</h3>
              <ul className={styles.eventMeta}>
                <li><CalendarDays aria-hidden="true" />{new Date(event.date).toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' })}</li>
                <li><MapPin aria-hidden="true" />{event.location}</li>
              </ul>
              <Link to={`/events/${event.id}`} className={styles.detailsLink}>Подробнее</Link>
            </div>
          </article>
        ))}
        </section>}
    </main>
  );
}

export default EventsPage;