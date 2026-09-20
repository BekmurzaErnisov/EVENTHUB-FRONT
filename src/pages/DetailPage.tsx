import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CalendarDays,
  CircleDollarSign,
  MapPin,
  ShieldCheck,
  UserRound,
  UsersRound,
  Ticket,
} from "lucide-react";
import styles from "./DetailPage.module.css";
import { authService } from "../services/auth.service";
import { formatDate } from "../utils/formatDate";

interface EventDetails {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  registeredCount?: number;
  availableSeats?: number;
  imageUrl?: string;
  category?: { name: string } | null;
  organizer?: { name: string } | null;
  isJoined?: boolean;
}

const API_URL = "http://localhost:3000";

function DetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadEvent = async () => {
    if (!id) return;
    try {
      const token = authService.getToken();
      const headers: Record<string, string> = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/events/${id}`, { headers });
      const data = await response.json().catch(() => ({}));

      if (!response.ok)
        throw new Error(data.message || "Мероприятие не найдено");

      setEvent(data);
      if (data.isJoined !== undefined) {
        setIsRegistered(data.isJoined);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Ошибка загрузки",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Мероприятие не найдено");
      setLoading(false);
      return;
    }
    loadEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!id) return;
    const token = authService.getToken();
    if (!token) {
      setError("Нужно войти в аккаунт, чтобы записаться на мероприятие");
      return;
    }

    try {
      setError("");
      setActionLoading(true);
      const response = await fetch(`${API_URL}/events/${id}/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(data.message || "Не удалось записаться на мероприятие");

      setIsRegistered(true);
      await loadEvent();
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Ошибка записи",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!id) return;
    const token = authService.getToken();
    if (!token) return;

    try {
      setError("");
      setActionLoading(true);

      const response = await fetch(`${API_URL}/events/${id}/register`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        authService.removeToken();
        throw new Error("Пожалуйста, войдите в аккаунт повторно");
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Не удалось отменить запись");
      }

      setIsRegistered(false);
      // Перезагружаем данные мероприятия, чтобы вернуть свободные места
      await loadEvent();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Ошибка отмены записи",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div>Загрузка мероприятия...</div>;
  if (error && !event) return <div>{error}</div>;
  if (!event) return <div>Мероприятие не найдено</div>;

  // Вычисление оставшихся мест
  const getSeatsDisplay = () => {
    if (event.availableSeats !== undefined && event.availableSeats !== null) {
      return `Осталось мест: ${event.availableSeats}`;
    }
    if (event.capacity && event.registeredCount !== undefined) {
      return `Осталось мест: ${Math.max(0, event.capacity - event.registeredCount)}`;
    }
    return `Мест всего: ${event.capacity}`;
  };

  return (
    <div className={styles.eventPage}>
      <div className={styles.mainContent}>
        {event.imageUrl ? (
          <img
            src={
              event.imageUrl.startsWith("http")
                ? event.imageUrl
                : `${API_URL}${event.imageUrl}`
            }
            alt={event.title}
            className={styles.bannerImage}
          />
        ) : (
          <div className={styles.bannerPlaceholder}>
            <Ticket size={48} className={styles.placeholderIcon} />
            <span>EventHub</span>
          </div>
        )}
        <div className={styles.descriptionBlock}>
          <h2>О мероприятии</h2>
          <p>{event.description}</p>
        </div>
      </div>

      <div className={styles.eventDetails}>
        <span className={styles.eventDetailsDesc}>
          {event.category?.name || "Мероприятие"}
        </span>
        <h1>{event.title}</h1>
        <div>
          <CalendarDays className={styles.detailIcon} size={20} />
          <p>{formatDate(event.date)}</p>
        </div>
        <div>
          <MapPin className={styles.detailIcon} size={20} />
          <div className={styles.addressContent}>
            <span>{event.location}</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noreferrer"
            >
              Показать на карте
            </a>
          </div>
        </div>
        <div>
          <CircleDollarSign className={styles.detailIcon} size={20} />
          <span>
            {event.price
              ? <>{`от ${new Intl.NumberFormat('ru-RU').format(event.price)} `}<span className={styles.currencyBadge}>сом</span></>
              : 'Бесплатно'}
          </span>
        </div>
        <div>
          <UsersRound className={styles.detailIcon} size={20} />
          <span>{getSeatsDisplay()}</span>
        </div>
        <div>
          <UserRound className={styles.detailIcon} size={20} />
          <span>{event.organizer?.name || "Организатор"}</span>
        </div>

        {isRegistered ? (
          <button
            onClick={handleUnregister}
            disabled={actionLoading}
            className={styles.leaveButton}
          >
            {actionLoading ? "Отмена..." : "Отменить запись"}
          </button>
        ) : (
          <button
            onClick={handleRegister}
            disabled={actionLoading}
            className={styles.joinButton}
          >
            {actionLoading ? "Запись..." : "Записаться"}
          </button>
        )}

        {error && <p className={styles.errorMessage}>{error}</p>}

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