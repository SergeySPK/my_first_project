import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ContactSuccess() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('contactData');
    if (savedData) {
      setData(JSON.parse(savedData));
      localStorage.removeItem('contactData');
    }
  }, []);

  const services = {
    1: 'Мужская стрижка',
    2: 'Бритье опасной бритвой',
    3: 'Стрижка бороды',
    4: 'Комплекс "Полный уход от тревог"',
    5: 'Детская стрижка',
    6: 'Отец + сын'
  };

  if (!data) {
    return (
      <div className="success-container">
        <div className="success-icon">❌</div>
        <h1>Ошибка</h1>
        <p>Данные записи не найдены</p>
        <Link to="/contact" className="btn">Вернуться к форме</Link>
      </div>
    );
  }

  return (
    <div className="success-container">
      <div className="success-icon">✅</div>
      <h1>Запись принята!</h1>
      <p>Спасибо, {data.name || 'гость'}! Мы получили вашу заявку.</p>
      
      <div style={{ 
        background: 'var(--charcoal)', 
        padding: '2rem', 
        borderRadius: '10px', 
        margin: '2rem 0',
        textAlign: 'left'
      }}>
        <h3 style={{ color: 'var(--rose-light)', marginBottom: '1rem' }}>Детали записи:</h3>
        <p><strong>Услуга:</strong> {services[data.service] || 'Не выбрана'}</p>
        <p><strong>Дата:</strong> {data.date}</p>
        <p><strong>Время:</strong> {data.time}</p>
        <p><strong>Телефон:</strong> {data.phone}</p>
        {data.comment && (
          <p><strong>Комментарий:</strong> {data.comment}</p>
        )}
      </div>

      <p style={{ color: 'var(--rose-pale)', marginBottom: '2rem' }}>
        Мы перезвоним вам в ближайшее время для подтверждения записи.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn">На главную</Link>
        <Link to="/services" className="btn" style={{ background: 'var(--charcoal)' }}>
          Другие услуги
        </Link>
      </div>
    </div>
  );
}

export default ContactSuccess;