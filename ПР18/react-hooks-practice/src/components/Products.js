import React from 'react';
import { Link } from 'react-router-dom';

function Products() {
  const services = [
    {
      id: 1,
      title: 'Мужская стрижка',
      icon: '✂',
      price: '1500 ₽',
      description: 'Классическая или современная стрижка с мытьем головы и укладкой',
      duration: '45-60 мин'
    },
    {
      id: 2,
      title: 'Бритье опасной бритвой',
      icon: '🪒',
      price: '1200 ₽',
      description: 'Традиционное бритье с распариванием, горячим полотенцем и уходом',
      duration: '30-40 мин'
    },
    {
      id: 3,
      title: 'Стрижка бороды',
      icon: '👔',
      price: '1000 ₽',
      description: 'Моделирование, стрижка и оформление бороды',
      duration: '30 мин'
    },
    {
      id: 4,
      title: 'Комплекс "Полный уход от тревог"',
      icon: '💎',
      price: '3500 ₽',
      description: 'Стрижка + бритье + оформление бороды + уход за кожей',
      duration: '90-120 мин'
    },
    {
      id: 5,
      title: 'Детская стрижка',
      icon: '👦',
      price: '1000 ₽',
      description: 'Стрижка для мальчиков до 12 лет с игровым подходом',
      duration: '30-40 мин'
    },
    {
      id: 6,
      title: 'Отец + сын',
      icon: '‍👨‍👦',
      price: '2200 ₽',
      description: 'Совместная стрижка отца и сына со скидкой 15%',
      duration: '60-80 мин'
    }
  ];

  return (
    <div className="section">
      <h2>Наши услуги и цены</h2>
      <p style={{ color: 'var(--rose-pale)', marginBottom: '2rem', fontSize: '1.1rem' }}>
        Выберите услугу и запишитесь онлайн. Все цены указаны с учетом НДС.
      </p>

      <div className="cards-grid">
        {services.map(service => (
          <div className="card" key={service.id}>
            <div className="card-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <div className="card-price">{service.price}</div>
            <p style={{ color: 'var(--rose-light)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              ⏱ {service.duration}
            </p>
            <Link to={`/services/${service.id}`} className="btn">
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;