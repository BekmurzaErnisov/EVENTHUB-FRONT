import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateEventPage.module.css";
import { authService } from "../services/auth.service";
import { API_URL } from "../config/api";

interface Category {
  id: number;
  name: string;
}

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<number | "">("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((response) => response.json())
      .then((data: Category[]) => {
        setCategories(data);
        if (data && data.length > 0) {
          setCategory(Number(data[0].id));
        }
      })
      .catch(() => setError("Не удалось загрузить категории"));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = authService.getToken();
    if (!token) {
      setError("Чтобы создать мероприятие, войдите в аккаунт");
      return;
    }

    if (!title || !description || !date || !time || !location || !category) {
      setError("Заполните все обязательные поля (включая категорию)");
      return;
    }

    if (!imageFile) {
      setError("Загрузите изображение мероприятия");
      return;
    }

    const eventDate = new Date(`${date}T${time}`);
    const numericPrice = Number(price) || 0;
    const numericSeats = Number(seats);

    if (eventDate <= new Date()) {
      setError("Дата мероприятия должна быть в будущем");
      return;
    }

    if (numericPrice < 0) {
      setError("Цена не может быть отрицательной");
      return;
    }

    if (!Number.isInteger(numericSeats) || numericSeats < 1) {
      setError("Количество мест должно быть целым числом больше нуля");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadRes = await fetch(`${API_URL}/events/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Не удалось загрузить изображение на сервер");
      }

      const uploadData = await uploadRes.json();
      const uploadedImageUrl = uploadData.imageUrl || uploadData.url || uploadData.path;
      if (!uploadedImageUrl || typeof uploadedImageUrl !== "string") {
        throw new Error("Сервер не вернул адрес изображения");
      }

      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          date: eventDate.toISOString(),
          location,
          categoryId: Number(category),
          price: numericPrice,
          capacity: numericSeats,
          imageUrl: uploadedImageUrl,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        throw new Error("Токен авторизации недействителен или истек. Войдите снова.");
      }

      if (!response.ok) {
        const message = data.message || "Не удалось создать мероприятие";
        throw new Error(Array.isArray(message) ? message.join(", ") : message);
      }

      navigate(`/events/${data.id}`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Ошибка создания мероприятия"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Создать мероприятие</h1>
        <p className={styles.subtitle}>
          Расскажите о вашем мероприятии, чтобы привлечь участников
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.leftColumn}>
            <div className={styles.field}>
              <label className={styles.label}>
                Название мероприятия <span>*</span>
              </label>
              <input
                type="text"
                placeholder="Например, Летний джаз в Саду «Эрмитаж»"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Описание <span>*</span>
              </label>
              <div className={styles.textareaWrapper}>
                <textarea
                  placeholder="Расскажите, о чем ваше мероприятие..."
                  maxLength={1000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.textarea}
                />
                <span className={styles.counter}>
                  {description.length}/1000
                </span>
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.field}>
              <label className={styles.label}>
                Изображение мероприятия <span>*</span>
              </label>
              <div className={styles.dropzone}>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageUpload}
                  id="image-upload"
                  className={styles.fileInput}
                />
                <label htmlFor="image-upload" className={styles.dropzoneLabel}>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Превью"
                      className={styles.preview}
                    />
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <div className={styles.imageIcon}>🖼️</div>
                      <p className={styles.uploadTitle}>
                        Загрузите изображение
                      </p>
                      <p className={styles.uploadSub}>
                        Перетащите файл сюда или нажмите для выбора
                      </p>
                      <span className={styles.uploadInfo}>
                        JPG, PNG, до 5 МБ
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rowTwo}>
          <div className={styles.field}>
            <label className={styles.label}>
              Дата и время <span>*</span>
            </label>
            <div className={styles.inputIconGroup}>
              <span className={styles.icon}>📅</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.inputWithIcon}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label} style={{ visibility: "hidden" }}>
              Время
            </label>
            <div className={styles.inputIconGroup}>
              <span className={styles.icon}>🕒</span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={styles.inputWithIcon}
              />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Адрес <span>*</span>
          </label>
          <div className={styles.inputIconGroup}>
            <span className={styles.icon}>📍</span>
            <input
              type="text"
              placeholder="Например, Москва, ул. Покровка, 47"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.inputWithIcon}
            />
          </div>
        </div>

        <div className={styles.rowThree}>
          <div className={styles.field}>
            <label className={styles.label}>
              Категория <span>*</span>
            </label>
            <select
              value={category === "" ? "" : String(category)}
              onChange={(e) => setCategory(Number(e.target.value))}
              className={styles.select}
            >
              {categories.map((item) => (
                <option value={String(item.id)} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Цена билета <span>*</span>
            </label>
            <div className={styles.inputIconGroup}>
              <span className={styles.currencyBadge}>сом</span>
              <input
                type="number"
                placeholder="Например, 500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={styles.inputWithIcon}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Количество мест <span>*</span>
            </label>
            <div className={styles.inputIconGroup}>
              <span className={styles.icon}>👤</span>
              <input
                type="number"
                placeholder="Например, 100"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className={styles.inputWithIcon}
              />
            </div>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.cancelButton}
          >
            ← Отмена
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Создание..." : "Создать мероприятие"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;