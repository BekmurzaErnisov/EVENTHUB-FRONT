import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateEventPage.module.css";

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      description,
      date,
      time,
      location,
      category,
      price,
      seats,
    });
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
          {/* Левая колонка */}
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
                  placeholder="Расскажите, о чем ваше мероприятие, что ждёт участников..."
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
                  {imageUrl ? (
                    <img
                      src={imageUrl}
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.select}
            >
                <option value="">Выберите категорию</option>
                <option value="sport">Спорт</option>
                <option value="cinema">Кино</option>
                <option value="music">Музыка</option>
                <option value="education">Образование</option>
                <option value="conference">Конференции</option>
                <option value="exhibition">Выставки</option>
                <option value="theatre">Театр</option>
                <option value="other">Другое</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Цена билета <span>*</span>
            </label>
            <div className={styles.inputIconGroup}>
              <span className={styles.icon}>₽</span>
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

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.cancelButton}
          >
            ← Отмена
          </button>
          <button type="submit" className={styles.submitButton}>
            Создать мероприятие
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;
