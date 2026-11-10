import React, { useState } from 'react';
import './UserRegistrationForm.css';

function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    subscribe: false,
    age: '',
    about: ''
  });

  const [errors, setErrors] = useState({});

  // Универсальный обработчик изменений - очищает ошибку поля при вводе
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Очищаем ошибку для этого поля сразу при изменении
    setErrors(prev => {
      if (!prev[name]) return prev;
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    // Кастомная валидация совпадения паролей через setCustomValidity
    if (name === 'password' || name === 'confirmPassword') {
      const confirmField = document.getElementById('confirmPassword');
      if (confirmField) {
        const passwordValue = name === 'password' ? value : formData.password;
        const confirmValue = name === 'confirmPassword' ? value : formData.confirmPassword;

        if (confirmValue && passwordValue !== confirmValue) {
          confirmField.setCustomValidity('Пароли не совпадают');
        } else {
          confirmField.setCustomValidity('');
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Введите корректный email (например: user@mail.ru)';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.gender) {
      newErrors.gender = 'Выберите пол';
    }

    if (!formData.age) {
      newErrors.age = 'Выберите возраст';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('✅ Форма отправлена:', formData);
      alert('Форма успешно отправлена! Проверьте консоль.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Задание 1: Управляемая форма регистрации</h2>

      <form onSubmit={handleSubmit} className="registration-form">
        {/* Имя */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">Имя *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите ваше имя"
            required
            className={`form-input ${errors.name ? 'input-error' : ''}`}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@mail.com"
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            title="Введите корректный email, например: user@mail.ru"
            required
            className={`form-input ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        {/* Пароль */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">Пароль *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Минимум 8 символов"
            minLength={8}
            required
            className={`form-input ${errors.password ? 'input-error' : ''}`}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        {/* Подтверждение пароля */}
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">Подтверждение пароля *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Повторите пароль"
            required
            className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
          />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>

        {/* Пол (radio) */}
        <div className="form-group">
          <label className="form-label">Пол *</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
                required
              />
              <span className="radio-custom"></span>
              Мужской
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              <span className="radio-custom"></span>
              Женский
            </label>
          </div>
          {errors.gender && <div className="error-message">{errors.gender}</div>}
        </div>

        {/* Возраст (select) */}
        <div className="form-group">
          <label htmlFor="age" className="form-label">Возраст *</label>
          <select
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            className={`form-input ${errors.age ? 'input-error' : ''}`}
          >
            <option value="">-- Выберите возраст --</option>
            <option value="16-18">16-18 лет</option>
            <option value="19-25">19-25 лет</option>
            <option value="26-35">26-35 лет</option>
            <option value="36-50">36-50 лет</option>
            <option value="50+">50+ лет</option>
          </select>
          {errors.age && <div className="error-message">{errors.age}</div>}
        </div>

        {/* О себе (textarea) */}
        <div className="form-group">
          <label htmlFor="about" className="form-label">О себе</label>
          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Расскажите немного о себе..."
            rows="4"
            maxLength={1000}
            className="form-textarea"
          />
          <div className="char-counter">{formData.about.length}/1000 символов</div>
        </div>

        {/* Подписка (checkbox) */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="subscribe"
              checked={formData.subscribe}
              onChange={handleChange}
            />
            <span className="checkbox-custom"></span>
            Подписаться на рассылку
          </label>
        </div>

        {/* Кнопка отправки */}
        <button type="submit" className="btn-primary">Зарегистрироваться</button>
      </form>

      {/* Отображение текущих значений формы */}
      <div className="form-values">
        <h3 className="values-title">Текущие значения формы:</h3>
        <pre className="values-json">{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
}

export default UserRegistrationForm;