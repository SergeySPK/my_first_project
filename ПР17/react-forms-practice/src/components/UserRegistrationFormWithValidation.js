import React, { useState } from 'react';
import './UserRegistrationFormWithValidation.css';

function UserRegistrationFormWithValidation() {
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

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Универсальный обработчик изменений
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Если поле уже трогали - валидируем сразу
    if (touched[name]) {
      const newErrors = validateField(name, type === 'checkbox' ? checked : value);
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
    }
  };

  // Отмечаем поле как "троннутое" при blur
  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const newErrors = validateField(name, type === 'checkbox' ? checked : value);
    setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
  };

  // Валидация одного поля
  const validateField = (name, value) => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (name) {
      case 'name':
        if (!value.trim()) newErrors.name = 'Имя обязательно для заполнения';
        else if (value.trim().length < 2) newErrors.name = 'Имя должно содержать минимум 2 символа';
        break;
      case 'email':
        if (!value) newErrors.email = 'Email обязателен для заполнения';
        else if (!emailRegex.test(value)) newErrors.email = 'Введите корректный email (например: user@mail.ru)';
        break;
      case 'password':
        if (!value) newErrors.password = 'Пароль обязателен для заполнения';
        else if (value.length < 8) newErrors.password = 'Пароль должен содержать минимум 8 символов';
        break;
      case 'confirmPassword':
        if (!value) newErrors.confirmPassword = 'Подтверждение пароля обязательно';
        else if (value !== formData.password) newErrors.confirmPassword = 'Пароли не совпадают';
        break;
      case 'gender':
        if (!value) newErrors.gender = 'Выберите пол';
        break;
      case 'age':
        if (!value) newErrors.age = 'Выберите возраст';
        break;
      default:
        break;
    }
    return newErrors;
  };

  // Полная валидация формы
  const validateAll = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = 'Имя обязательно для заполнения';
    else if (formData.name.trim().length < 2) newErrors.name = 'Имя должно содержать минимум 2 символа';

    if (!formData.email) newErrors.email = 'Email обязателен для заполнения';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Введите корректный email';

    if (!formData.password) newErrors.password = 'Пароль обязателен для заполнения';
    else if (formData.password.length < 8) newErrors.password = 'Пароль должен содержать минимум 8 символов';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';

    if (!formData.gender) newErrors.gender = 'Выберите пол';
    if (!formData.age) newErrors.age = 'Выберите возраст';

    return newErrors;
  };

  // Индикатор силы пароля
  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return { level: 0, label: '', color: '' };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 1, label: 'Слабый', color: '#ef4444' };
    if (score <= 3) return { level: 2, label: 'Средний', color: '#f59e0b' };
    return { level: 3, label: 'Сильный', color: '#10b981' };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateAll();

    // Помечаем все поля как тронутые
    const allTouched = {};
    Object.keys(formData).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log('✅ Форма с валидацией отправлена:', formData);
    }
  };

  if (submitted) {
    return (
      <div className="form-container validation-form">
        <h2 className="form-title">Задание 2: Управляемая форма с валидацией</h2>
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h3>Регистрация успешна!</h3>
          <p>Данные формы: {formData.name} ({formData.email})</p>
          <button className="btn-secondary" onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', password: '', confirmPassword: '', gender: '', subscribe: false, age: '', about: '' });
            setTouched({});
            setErrors({});
          }}>
            Заполнить ещё раз
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container validation-form">
      <h2 className="form-title">Задание 2: Управляемая форма с валидацией</h2>

      <form onSubmit={handleSubmit} className="registration-form" noValidate>
        {/* Имя */}
        <div className="form-group">
          <label htmlFor="val-name" className="form-label">Имя *</label>
          <input
            type="text"
            id="val-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Введите ваше имя"
            className={`form-input ${touched.name && errors.name ? 'input-error' : ''}`}
          />
          {touched.name && errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="val-email" className="form-label">Email *</label>
          <input
            type="email"
            id="val-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="example@mail.com"
            className={`form-input ${touched.email && errors.email ? 'input-error' : ''}`}
          />
          {touched.email && errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        {/* Пароль */}
        <div className="form-group">
          <label htmlFor="val-password" className="form-label">Пароль *</label>
          <input
            type="password"
            id="val-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Минимум 8 символов"
            className={`form-input ${touched.password && errors.password ? 'input-error' : ''}`}
          />
          {touched.password && errors.password && <div className="error-message">{errors.password}</div>}

          {/* Индикатор силы пароля */}
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{
                    width: `${(passwordStrength.level / 3) * 100}%`,
                    backgroundColor: passwordStrength.color
                  }}
                />
              </div>
              <span className="strength-label" style={{ color: passwordStrength.color }}>
                {passwordStrength.label}
              </span>
            </div>
          )}
        </div>

        {/* Подтверждение пароля */}
        <div className="form-group">
          <label htmlFor="val-confirmPassword" className="form-label">Подтверждение пароля *</label>
          <input
            type="password"
            id="val-confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Повторите пароль"
            className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}`}
          />
          {touched.confirmPassword && errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
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
                onBlur={handleBlur}
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
                onBlur={handleBlur}
              />
              <span className="radio-custom"></span>
              Женский
            </label>
          </div>
          {touched.gender && errors.gender && <div className="error-message">{errors.gender}</div>}
        </div>

        {/* Возраст (select) */}
        <div className="form-group">
          <label htmlFor="val-age" className="form-label">Возраст *</label>
          <select
            id="val-age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${touched.age && errors.age ? 'input-error' : ''}`}
          >
            <option value="">-- Выберите возраст --</option>
            <option value="16-18">16-18 лет</option>
            <option value="19-25">19-25 лет</option>
            <option value="26-35">26-35 лет</option>
            <option value="36-50">36-50 лет</option>
            <option value="50+">50+ лет</option>
          </select>
          {touched.age && errors.age && <div className="error-message">{errors.age}</div>}
        </div>

        {/* О себе (textarea) */}
        <div className="form-group">
          <label htmlFor="val-about" className="form-label">О себе</label>
          <textarea
            id="val-about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Расскажите немного о себе..."
            rows="4"
            maxLength={500}
            className="form-textarea"
          />
          <div className="char-counter">{formData.about.length}/500 символов</div>
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
    </div>
  );
}

export default UserRegistrationFormWithValidation;