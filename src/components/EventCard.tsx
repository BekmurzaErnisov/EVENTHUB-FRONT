import React from 'react';
import styles from './EventCard.module.css';
import { Calendar, MapPin, RussianRuble, Users } from 'lucide-react';

interface EventData {
  id: number | string;
  imageUrl?: string;
  category: string;
  title: string;
  date: string;
  address: string;
  price: number | string;
  remainingSlots: number;
}

interface EventCardProps {
  event: EventData;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const {
    imageUrl = 'https://placeholder.com',
    category = 'Категория',
    title = 'Название мероприятия',
    date = 'Дата не указана',
    address = 'Адрес не указан',
    price = 0,
    remainingSlots = 0,
  } = event || {};

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={imageUrl} alt={title} className={styles.image} />
        <span className={styles.badge}>{category}</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        
        <div className={styles.infoList}>
            
          <div className={styles.infoItem}>
            <Calendar size={16} className={styles.icon} />
            <span>{date}</span>
          </div>
          
          <div className={styles.infoItem}>
            <MapPin size={16} className={styles.icon} />
            <span className={styles.truncate}>{address}</span>
          </div>
          
          <div className={styles.infoItem}>
            <RussianRuble size={16} className={styles.icon} />
            <span className={styles.priceText}>
              {typeof price === 'number' ? `от ${price} ₽` : price}
            </span>
          </div>
          
          <div className={styles.infoItem}>
            <Users size={16} className={styles.icon} />
            <span>Осталось {remainingSlots} мест</span>
          </div>
        </div>

        <button className={styles.button}>
          Подробнее
        </button>
      </div>
    </div>
  );
};

export default EventCard;
