import styles from './EventsPage.module.css';

function EventsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1>Афиша мероприятий</h1>
        <p>Открывайте интересные события рядом с вами</p>

        <div className={styles.filters}>
          <label className={styles.searchField}>
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Поиск мероприятий по названию..." />
          </label>
          <select defaultValue="all" aria-label="Категория мероприятия">
            <option value="all">Все категории</option>
            <option value="sport">Спорт</option>
            <option value="cinema">Кино</option>
            <option value="music">Музыка</option>
            <option value="education">Образование</option>
            <option value="conference">Конференции</option>
            <option value="exhibition">Выставки</option>
            <option value="theatre">Театр</option>
            <option value="other">Другое</option>
          </select>
          <select defaultValue="nearest" aria-label="Сортировка мероприятий">
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
    </main>
  );
}

export default EventsPage;