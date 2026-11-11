import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const services = {
    1: {
      title: 'Мужская стрижка',
      icon: '✂',
      price: '1500 ₽',
      description: 'Профессиональная мужская стрижка - это не просто удаление волос, это создание образа, который подчеркнет вашу индивидуальность и стиль.',
      features: [
        'Консультация стилиста перед стрижкой',
        'Мытье головы премиум шампунем',
        'Стрижка с учетом формы лица и типа волос',
        'Укладка и рекомендации по уходу',
        'Чай, кофе или виски во время процедуры'
      ],
      duration: '45-60 минут',
      includes: 'Включает: консультацию, стрижку, мытье, укладку'
    },
    2: {
      title: 'Бритье опасной бритвой',
      icon: '🪒',
      price: '1200 ₽',
      description: 'Традиционное бритье опасной бритвой - это ритуал, который возвращает мужчинам ощущение настоящего ухода за собой. Горячее полотенце, качественная пена и мастерство барбера.',
      features: [
        'Распаривание кожи горячим полотенцем',
        'Нанесение профессиональной пены',
        'Бритье опасной бритвой',
        'Нанесение послебривного лосьона',
        'Массаж лица'
      ],
      duration: '30-40 минут',
      includes: 'Включает: распаривание, бритье, уход за кожей'
    },
    3: {
      title: 'Стрижка бороды',
      icon: '👔',
      price: '1000 ₽',
      description: 'Правильно оформленная борода - это признак стиля и уверенности. Мы поможем вам создать идеальную форму, которая подойдет именно вам.',
      features: [
        'Консультация по форме бороды',
        'Стрижка и оформление контуров',
        'Удаление лишних волос',
        'Нанесение масла для бороды',
        'Рекомендации по домашнему уходу'
      ],
      duration: '30 минут',
      includes: 'Включает: стрижку, оформление, уход'
    },
    4: {
      title: 'Комплекс "Полный уход от тревог"',
      icon: '💎',
      price: '3500 ₽',
      description: 'Максимальный уход для тех, кто ценит свое время и хочет получить всё и сразу. Идеально для особых случаев или когда нужно выглядеть на 100%.',
      features: [
        'Все услуги из комплекса',
        'Приоритетная запись',
        'Напитки премиум класса',
        'Маска для лица',
        'Уход за кожей головы'
      ],
      duration: '90-120 минут',
      includes: 'Включает: стрижку, бритье, бороду, уход'
    },
    5: {
      title: 'Детская стрижка',
      icon: '👦',
      price: '1000 ₽',
      description: 'Стрижка для маленьких джентльменов. Наши мастера знают подход к детям и сделают процесс максимально комфортным и даже веселым.',
      features: [
        'Игровой подход к стрижке',
        'Планшет или мультфильмы во время стрижки',
        'Сертификат "Я был в барбершопе"',
        'Мытье головы детским шампунем',
        'Небольшой подарок'
      ],
      duration: '30-40 минут',
      includes: 'Включает: стрижку, мытье, подарок'
    },
    6: {
      title: 'Отец + сын',
      icon: '👨‍👦',
      price: '2200 ₽',
      description: 'Специальное предложение для отцов и сыновей. Проведите время вместе, пока наши мастера позаботятся о вашем стиле.',
      features: [
        'Стрижка для отца и сына',
        'Скидка 15% от общей стоимости',
        'Два мастера одновременно',
        'Напитки для обоих',
        'Семейное фото на память'
      ],
      duration: '60-80 минут',
      includes: 'Включает: две стрижки, напитки, фото'
    }
  };

  const service = services[id];

  if (!service) {
    return (
      <div className="not-found">
        <h1>😕</h1>
        <h2>Услуга не найдена</h2>
        <p>К сожалению, такая услуга не существует</p>
        <Link to="/services" className="btn">Все услуги</Link>
      </div>
    );
  }

  const handleBookService = () => {
    navigate('/contact', { state: { serviceId: id } });
  };

  return (
    <div className="product-detail">
      <div className="product-detail-header">
        <div>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{service.icon}</div>
          <h1>{service.title}</h1>
          <p style={{ color: 'var(--rose-pale)', fontSize: '1.1rem' }}>{service.duration}</p>
        </div>
        <div className="product-price-large">{service.price}</div>
      </div>

      <p className="product-description">{service.description}</p>

      <h3 style={{ color: 'var(--rose-light)', marginBottom: '1rem' }}>Что включено:</h3>
      <ul className="product-features">
        {service.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <p style={{ color: 'var(--rose-medium)', fontStyle: 'italic', marginBottom: '2rem' }}>
        {service.includes}
      </p>

      <button onClick={handleBookService} className="btn" style={{ marginRight: '1rem' }}>
        Записаться на эту услугу
      </button>
      <Link to="/services" className="btn" style={{ background: 'var(--charcoal)' }}>
        Все услуги
      </Link>
    </div>
  );
}

export default ProductDetail;