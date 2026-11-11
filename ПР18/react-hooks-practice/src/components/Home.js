import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <section className="hero">
        <h1>ROSE & BLADE</h1>
        <p>Премиум барбершоп для настоящих мужчин. Стиль, который говорит за тебя.</p>
        <Link to="/contact" className="btn">Записаться онлайн</Link>
      </section>

      <section className="section">
        <h2>Наши услуги</h2>
        <div className="cards-grid">
          <div className="card">
            <div className="card-icon">✂</div>
            <h3>Мужская стрижка</h3>
            <p>Классические и современные стрижки любой сложности с консультацией стилиста</p>
            <div className="card-price">от 1500 ₽</div>
            <Link to="/services/1" className="btn">Подробнее</Link>
          </div>

          <div className="card">
            <div className="card-icon">🪒</div>
            <h3>Бритье опасной бритвой</h3>
            <p>Традиционное бритье с распариванием, горячим полотенцем и уходом за кожей</p>
            <div className="card-price">от 1200 ₽</div>
            <Link to="/services/2" className="btn">Подробнее</Link>
          </div>

          <div className="card">
            <div className="card-icon"></div>
            <h3>Стрижка бороды</h3>
            <p>Моделирование и оформление бороды, уход и рекомендации по стилю</p>
            <div className="card-price">от 1000 ₽</div>
            <Link to="/services/3" className="btn">Подробнее</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Почему выбирают нас</h2>
        <div className="cards-grid">
          <div className="card">
            <h3> Индивидуальный подход</h3>
            <p>Подбираем стрижку под ваш тип лица, стиль жизни и предпочтения</p>
          </div>

          <div className="card">
            <h3> Опытные мастера</h3>
            <p>Наши барберы - профессионалы с опытом от 5 лет и постоянным обучением</p>
          </div>

          <div className="card">
            <h3> Премиум косметика</h3>
            <p>Работаем только с проверенными брендами: American Crew, Baxter of California</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;