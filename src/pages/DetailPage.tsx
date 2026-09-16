import { useState } from "react";
import styles from "./DetailPage.module.css";
import {
  CalendarDays,
  CircleDollarSign,
  MapPin,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

function DetailPage() {
  const [isRegistered, setIsRegistered] = useState(false);

  const registerState = () => {
    setIsRegistered(!isRegistered);
  };

  return (
    <div className={styles.eventPage}>
      {/* Левая колонка: Изображение и описание */}
      <div className={styles.mainContent}>
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop"
          alt="Летний джаз в Саду «Эрмитаж»"
          className={styles.bannerImage}
        />
        <div className={styles.descriptionBlock}>
          <h2>О мероприятии</h2>
          <p>
            Приглашаем вас на тёплый музыкальный вечер под открытым небом в
            самом центре города! На сцене выступят лучшие джазовые коллективы.
            Вас ждут известные джазовые стандарты, авторские композиции и
            незабываемая атмосфера.
          </p>
        </div>
      </div>

      {/* Правая колонка: Детали и кнопка записи */}
      <div className={styles.eventDetails}>
        <span className={styles.eventDetailsDesc}>Концерты</span>

        <h1>Летний джаз в Саду «Эрмитаж»</h1>

        <div>
          <CalendarDays className={styles.detailIcon} size={20} />
          <p>12 июн. 2025, 19:00</p>
        </div>

        <div>
          <MapPin className={styles.detailIcon} size={20} />
          <div className={styles.addressContent}>
            <span>Москва, ул. Каретный Ряд, 3</span>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Москва, ул. Каретный Ряд, 3"
              target="_blank"
              rel="noreferrer"
            >
              Показать на карте
            </a>
          </div>
        </div>

        <div>
          <CircleDollarSign className={styles.detailIcon} size={20} />
          <span>от 1 200 ₽</span>
        </div>

        <div>
          <UsersRound className={styles.detailIcon} size={20} />
          <span>Осталось {isRegistered ? 47 : 48} мест из 200</span>
        </div>

        <div>
          <UserRound className={styles.detailIcon} size={20} />
          <span>Jazz Garden Events</span>
        </div>

        <button onClick={registerState} disabled={isRegistered}>
          {isRegistered ? "Вы записаны" : "Записаться"}
        </button>

        <div className={styles.protectionNotice}>
          <ShieldCheck className={styles.detailIcon} size={20} />
          <span>
            Ваши данные защищены. Запись поможет организатору подготовить
            мероприятие.
          </span>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
