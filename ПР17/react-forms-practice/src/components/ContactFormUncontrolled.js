import React, { useRef, useState, useEffect } from 'react';
import './ContactFormUncontrolled.css';

function ContactFormUncontrolled() {
  const formRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const topicRef = useRef(null);
  const messageRef = useRef(null);
  const charCounterRef = useRef(null);

  const [submittedData, setSubmittedData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Состояние для визуальной валидации
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const handleMessageInput = () => {
    if (messageRef.current && charCounterRef.current) {
      charCounterRef.current.textContent = messageRef.current.value.length;
    }
  };

  // Валидация формы с визуальной подсветкой
  const validateForm = () => {
    const newErrors = {};

    if (!nameRef.current.value.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    } else if (nameRef.current.value.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRef.current.value.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!emailRegex.test(emailRef.current.value)) {
      newErrors.email = 'Введите корректный email (например: user@mail.ru)';
    }

    if (!topicRef.current.value) {
      newErrors.topic = 'Выберите тему обращения';
    }

    if (!messageRef.current.value.trim()) {
      newErrors.message = 'Сообщение обязательно для заполнения';
    } else if (messageRef.current.value.trim().length < 10) {
      newErrors.message = 'Сообщение должно содержать минимум 10 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Сброс ошибок при вводе
  const handleFieldInput = (fieldRef, fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    if (fieldName === 'message') {
      handleMessageInput();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Фокус на первое поле с ошибкой
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField === 'name' && nameRef.current) nameRef.current.focus();
      else if (firstErrorField === 'email' && emailRef.current) emailRef.current.focus();
      else if (firstErrorField === 'topic' && topicRef.current) topicRef.current.focus();
      else if (firstErrorField === 'message' && messageRef.current) messageRef.current.focus();
      return;
    }

    const formData = {
      name: nameRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      topic: topicRef.current.value,
      message: messageRef.current.value.trim(),
      sentAt: new Date().toLocaleString('ru-RU')
    };

    console.log('✅ Данные неуправляемой формы:', formData);
    setSubmittedData(formData);
    setShowSuccess(true);

    if (formRef.current) {
      formRef.current.reset();
      if (charCounterRef.current) {
        charCounterRef.current.textContent = '0';
      }
    }

    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  return (
    <div className="uncontrolled-container">
      <h2 className="form-title">Задание 3: Неуправляемая форма обратной связи</h2>

      <div className="info-block">
        <h3>💡 Чем отличается от управляемой формы?</h3>
        <ul>
          <li><strong>Управляемая:</strong> значения полей хранятся в <code>useState</code>, React контролирует каждое изменение через <code>onChange</code>.</li>
          <li><strong>Неуправляемая:</strong> значения хранятся в самом DOM, доступ получаем через <code>useRef</code> в момент submit.</li>
          <li>Неуправляемые формы проще для быстрых прототипов и интеграции со сторонними библиотеками.</li>
          <li>Управляемые формы удобнее для валидации в реальном времени и сложных сценариев.</li>
        </ul>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="contact-form"
      >
        {/* Имя */}
        <div className="form-group">
          <label htmlFor="contact-name" className="form-label">
            Ваше имя *
          </label>
          <input
            ref={nameRef}
            type="text"
            id="contact-name"
            name="name"
            placeholder="Иван Иванов"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            onInput={() => handleFieldInput(nameRef, 'name')}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="contact-email" className="form-label">
            Email *
          </label>
          <input
            ref={emailRef}
            type="email"
            id="contact-email"
            name="email"
            placeholder="example@mail.com"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            onInput={() => handleFieldInput(emailRef, 'email')}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        {/* Тема (select) */}
        <div className="form-group">
          <label htmlFor="contact-topic" className="form-label">
            Тема обращения *
          </label>
          <select
            ref={topicRef}
            id="contact-topic"
            name="topic"
            className={`form-input ${errors.topic ? 'input-error' : ''}`}
            onInput={() => handleFieldInput(topicRef, 'topic')}
          >
            <option value="">-- Выберите тему --</option>
            <option value="question">Общий вопрос</option>
            <option value="support">Техническая поддержка</option>
            <option value="cooperation">Сотрудничество</option>
            <option value="complaint">Жалоба</option>
            <option value="other">Другое</option>
          </select>
          {errors.topic && <div className="error-message">{errors.topic}</div>}
        </div>

        {/* Сообщение (textarea) */}
        <div className="form-group">
          <label htmlFor="contact-message" className="form-label">
            Сообщение *
          </label>
          <textarea
            ref={messageRef}
            id="contact-message"
            name="message"
            placeholder="Опишите ваш вопрос подробно..."
            rows="5"
            maxLength={500}
            className={`form-textarea ${errors.message ? 'input-error' : ''}`}
            onInput={() => handleFieldInput(messageRef, 'message')}
          />
          <div className="char-counter">
            <span ref={charCounterRef}>0</span>/500 символов
          </div>
          {errors.message && <div className="error-message">{errors.message}</div>}
        </div>

        {/* Кнопки */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Отправить сообщение
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              if (formRef.current) {
                formRef.current.reset();
                if (charCounterRef.current) {
                  charCounterRef.current.textContent = '0';
                }
              }
              setErrors({});
              setSubmittedData(null);
              setShowSuccess(false);
            }}
          >
            Очистить форму
          </button>
        </div>
      </form>

      {/* Сообщение об успехе */}
      {showSuccess && submittedData && (
        <div className="success-block">
          <div className="success-icon">✓</div>
          <h3>Сообщение отправлено!</h3>
          <div className="submitted-data">
            <div className="data-row">
              <span className="data-label">Имя:</span>
              <span className="data-value">{submittedData.name}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Email:</span>
              <span className="data-value">{submittedData.email}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Тема:</span>
              <span className="data-value">{submittedData.topic}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Сообщение:</span>
              <span className="data-value">{submittedData.message}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Отправлено:</span>
              <span className="data-value">{submittedData.sentAt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactFormUncontrolled;