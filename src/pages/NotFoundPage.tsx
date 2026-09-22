import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <main className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Страница не найдена</h1>
      <p className={styles.text}>Такого адреса в EventHub нет.</p>
      <Link to="/events" className={styles.link}>
        К афише мероприятий
      </Link>
    </main>
  );
}

export default NotFoundPage;
