import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2 style={{ color: 'var(--rose-light)', marginBottom: '1rem' }}>Страница не найдена</h2>
      <p style={{ color: 'var(--rose-pale)', marginBottom: '2rem' }}>
        Похоже, вы забрились не туда. Такой страницы не существует.
      </p>
      <Link to="/" className="btn">Вернуться на главную</Link>
    </div>
  );
}

export default NotFound;