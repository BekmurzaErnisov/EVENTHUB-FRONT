import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Edit2, Trash2, LogOut } from "lucide-react";
import { eventService } from "../services/event.service";
import { useAuth } from "../AuthContext"; // Импортируем хук авторизации
import styles from "./MyEventsPage.module.css";

interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  price: number;
  imageUrl: string;
}

export const MyEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<"created" | "joined">("created");
  const [createdEvents, setCreatedEvents] = useState<EventItem[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await eventService.getMyEvents();
        setCreatedEvents(data.created || []);
        setJoinedEvents(data.joined || []);
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <p style={{ color: 'red' }}>Пожалуйста, войдите в аккаунт</p>
      </div>
    );
  }

  const handleDeleteCreated = async (id: string) => {
    if (confirm("Вы уверены, что хотите удалить это мероприятие?")) {
      try {
        await eventService.deleteEvent(id);
        setCreatedEvents((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        alert("Не удалось удалить мероприятие");
      }
    }
  };

  const handleCancelJoined = async (id: string) => {
    if (confirm("Отменить запись на мероприятие?")) {
      try {
        await eventService.cancelRegistration(id);
        setJoinedEvents((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        alert("Не удалось отменить запись");
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p style={{ color: "red", fontSize: "1.1rem", marginBottom: "1rem" }}>
            Пожалуйста, войдите в аккаунт
          </p>
          <button
            onClick={() => navigate("/login")}
            className={styles.createBtn}
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  const currentList = activeTab === "created" ? createdEvents : joinedEvents;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Мои мероприятия</h1>
        <p className={styles.subtitle}>
          Управляйте созданными событиями и своими записями
        </p>
      </header>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === "created" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("created")}
        >
          Созданные мной ({createdEvents.length})
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "joined" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("joined")}
        >
          Я записан ({joinedEvents.length})
        </button>
      </div>

      {currentList.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            {activeTab === "created"
              ? "Вы ещё не создали ни одного мероприятия."
              : "Вы пока не записаны ни на одно мероприятие."}
          </p>
          {activeTab === "created" && (
            <button
              onClick={() => navigate("/events/create")}
              className={styles.createBtn}
            >
              Создать мероприятие
            </button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {currentList.map((event) => (
            <div key={event.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className={styles.image}
                />
                <span className={styles.categoryBadge}>{event.category}</span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.eventTitle}>{event.title}</h3>

                <div className={styles.infoRow}>
                  <CalendarDays size={16} className={styles.icon} />
                  <span>{event.date}</span>
                </div>

                <div className={styles.infoRow}>
                  <MapPin size={16} className={styles.icon} />
                  <span className={styles.locationText}>{event.location}</span>
                </div>

                <div className={styles.priceRow}>
                  <span className={styles.price}>
                    {event.price > 0 ? `${event.price} ₽` : "Бесплатно"}
                  </span>
                </div>

                <div className={styles.actions}>
                  {activeTab === "created" ? (
                    <>
                      <button
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                        className={styles.editBtn}
                      >
                        <Edit2 size={16} /> Редактировать
                      </button>
                      <button
                        onClick={() => handleDeleteCreated(event.id)}
                        className={styles.deleteBtn}
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleCancelJoined(event.id)}
                      className={styles.cancelBtn}
                    >
                      <LogOut size={16} /> Отменить запись
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
