import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventService } from "../services/event.service";
import styles from "./CreateEventPage.module.css";
import { API_URL } from "../config/api";

interface Category {
  id: number;
  name: string;
}

function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [category, setCategory] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) return;
        const event = await eventService.getEventById(id);
        setTitle(event.title || "");
        setDescription(event.description || "");
        if (event.date) {
          setDate(new Date(event.date).toISOString().slice(0, 16));
        }
        setLocation(event.location || "");
        setPrice(event.price !== undefined && event.price !== null ? event.price.toString() : "");
        setCapacity(event.capacity !== undefined && event.capacity !== null ? event.capacity.toString() : "");
        setCategory(event.category?.id ?? "");
        
        if (event.imageUrl || event.image) {
          const imgUrl = event.imageUrl || event.image;
          // Корректно формируем путь, если картинка относительная
          const fullImgUrl = imgUrl.startsWith("http") ? imgUrl : `${API_URL}${imgUrl}`;
          setImagePreview(fullImgUrl);
        }
      } catch (err) {
        setError("Не удалось загрузить данные мероприятия");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((response) => response.json())
      .then((data: Category[]) => setCategories(data))
      .catch(() => setError("Не удалось загрузить категории"));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!id) return;

      const eventDate = new Date(date);
      const numericPrice = Number(price) || 0;
      const numericCapacity = Number(capacity);

      if (!date || eventDate <= new Date()) {
        throw new Error("Дата мероприятия должна быть в будущем");
      }

      if (numericPrice < 0) {
        throw new Error("Цена не может быть отрицательной");
      }

      if (!Number.isInteger(numericCapacity) || numericCapacity < 1) {
        throw new Error("Вместимость должна быть целым числом больше нуля");
      }

      let uploadedImageUrl = imagePreview;

      if (imageFile) {
        uploadedImageUrl = await eventService.uploadImage(imageFile);
      }

      await eventService.updateEvent(id, {
        title,
        description,
        date: eventDate.toISOString(),
        location,
        price: numericPrice,
        capacity: numericCapacity,
        ...(category !== "" ? { categoryId: category } : {}),
        imageUrl: uploadedImageUrl,
      });

      navigate(`/events/${id}`);
    } catch (err: any) {
      setError(err.message || "Ошибка при сохранении изменений");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Редактировать мероприятие</h1>
        <p className={styles.subtitle}>Внесите изменения в информацию о вашем событии</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.grid}>
          <div className={styles.leftColumn}>
            <div className={styles.field}>
              <label className={styles.label}>
                Название <span>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Описание</label>
              <div className={styles.textareaWrapper}>
                <textarea
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                />
                <span className={styles.counter}>{description.length}/1000</span>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Дата и время <span>*</span>
              </label>
              <input
                type="datetime-local"
                className={styles.input}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.field}>
              <label className={styles.label}>
                Местоположение <span>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className={styles.rowThree}>
              <div className={styles.field}>
                <label className={styles.label}>Цена (сом)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Категория</label>
                <select
                  className={styles.select}
                  value={category === "" ? "" : String(category)}
                  onChange={(e) => setCategory(Number(e.target.value))}
                >
                  <option value="">Без категории</option>
                  {categories.map((item) => (
                    <option value={item.id} key={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Вместимость <span>*</span>
                </label>
                <input
                  type="number"
                  className={styles.input}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Изображение мероприятия</label>
              <div className={styles.dropzone}>
                <input
                  type="file"
                  id="event-image-input"
                  className={styles.fileInput}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label htmlFor="event-image-input" className={styles.dropzoneLabel}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className={styles.preview} />
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <span className={styles.imageIcon}>📁</span>
                      <span className={styles.uploadTitle}>Загрузить обложку</span>
                      <span className={styles.uploadSub}>Перетащите файл или нажмите</span>
                      <span className={styles.uploadInfo}>PNG, JPG до 10MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate(-1)}
          >
            Отмена
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEventPage;