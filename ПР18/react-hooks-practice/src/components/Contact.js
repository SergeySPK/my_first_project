import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// === КАСТОМНЫЙ КАЛЕНДАРЬ ===
function Calendar({ selectedDate, onSelect, minDate, maxDate }) {
  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date();
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const months = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
  ];

  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const min = minDate ? new Date(minDate + 'T00:00:00') : null;
  const max = maxDate ? new Date(maxDate + 'T00:00:00') : null;

  const days = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    let disabled = false;
    if (min && date < min) disabled = true;
    if (max && date > max) disabled = true;

    const isToday = date.getTime() === today.getTime();
    const isSelected = dateStr === selectedDate;

    days.push({ day: d, dateStr, disabled, isToday, isSelected });
  }

  const prevMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    if (min && newDate < new Date(min.getFullYear(), min.getMonth(), 1)) return;
    setViewDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    if (max && newDate > new Date(max.getFullYear(), max.getMonth(), 1)) return;
    setViewDate(newDate);
  };

  const canGoPrev = min ? new Date(year, month - 1, 1) >= new Date(min.getFullYear(), min.getMonth(), 1) : true;
  const canGoNext = max ? new Date(year, month + 1, 1) <= new Date(max.getFullYear(), max.getMonth(), 1) : true;

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="calendar-nav-btn"
          aria-label="Предыдущий месяц"
        >
          ‹
        </button>
        <span className="calendar-title">
          {months[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canGoNext}
          className="calendar-nav-btn"
          aria-label="Следующий месяц"
        >
          ›
        </button>
      </div>

      <div className="calendar-weekdays">
        {weekdays.map(d => (
          <div key={d} className="weekday">{d}</div>
        ))}
      </div>

      <div className="calendar-days">
        {days.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="calendar-day empty"></div>;
          }
          return (
            <button
              key={day.dateStr}
              type="button"
              disabled={day.disabled}
              className={`calendar-day ${day.isSelected ? 'selected' : ''} ${day.isToday ? 'today' : ''}`}
              onClick={() => onSelect(day.dateStr)}
              aria-label={`${day.day} ${months[month]} ${year}`}
            >
              {day.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// === ОСНОВНОЙ КОМПОНЕНТ ===
function Contact() {
  const navigate = useNavigate();
  const location = useLocation();
  const calendarRef = useRef(null);

  const serviceIdFromState = location.state?.serviceId;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: serviceIdFromState || '',
    date: '',
    time: '',
    comment: ''
  });

  const [errors, setErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);

  // Текущая дата и следующий год
  const [today, setToday] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    setToday(todayStr);
    setCurrentYear(yyyy);

    // Максимум - конец следующего года
    const nextYear = yyyy + 1;
    setMaxDate(`${nextYear}-12-31`);

    // Устанавливаем текущую дату и время по умолчанию
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    setFormData(prev => ({
      ...prev,
      date: todayStr,
      time: `${hours}:${minutes}`,
      service: serviceIdFromState || prev.service
    }));
  }, [serviceIdFromState]);

  // Закрытие календаря при клике вне и при скролле (мобильные)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };

    const handleTouchOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };

    const handleScroll = () => {
      setShowCalendar(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1);
    }
    if (!digits.startsWith('7')) {
      digits = '7' + digits;
    }
    digits = digits.slice(0, 11);

    let formatted = '+7';
    if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
    if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
    if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);

    return formatted;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const formatted = formatPhone(value);
      setFormData(prev => ({ ...prev, phone: formatted }));
      if (errors.phone) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.phone;
          return newErrors;
        });
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateSelect = (dateStr) => {
  setFormData(prev => ({ ...prev, date: dateStr }));
  if (errors.date) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.date;
      return newErrors;
    });
  }
};

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else if (phoneDigits.length !== 11 || !phoneDigits.startsWith('7')) {
      newErrors.phone = 'Введите корректный номер: +7 (XXX) XXX-XX-XX';
    }

    if (!formData.service) {
      newErrors.service = 'Выберите услугу';
    }

    if (!formData.date) {
      newErrors.date = 'Выберите дату';
    } else {
      // Проверка года - только текущий или следующий
      const selectedYear = parseInt(formData.date.split('-')[0]);
      if (selectedYear !== currentYear && selectedYear !== currentYear + 1) {
        newErrors.date = `Доступны только ${currentYear} и ${currentYear + 1} год`;
      } else if (formData.date < today) {
        newErrors.date = 'Дата не может быть в прошлом';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Выберите время';
    } else {
      if (formData.date === today) {
        const now = new Date();
        const [hours, minutes] = formData.time.split(':').map(Number);
        const selectedTime = hours * 60 + minutes;
        const currentTime = now.getHours() * 60 + now.getMinutes();
        if (selectedTime <= currentTime) {
          newErrors.time = 'Выберите время позже текущего';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) el.focus();
      return;
    }

    localStorage.setItem('contactData', JSON.stringify(formData));
    navigate('/contact/success');
  };

  const getMinTime = () => {
    if (formData.date === today) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30);
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    }
    return '09:00';
  };

  return (
    <div className="section">
      <h2>Записаться на стрижку</h2>
      <p style={{ color: 'var(--rose-pale)', marginBottom: '2rem' }}>
        Заполните форму ниже, и мы свяжемся с вами для подтверждения записи
      </p>

      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        {/* Имя */}
        <div className="form-group">
          <label htmlFor="name">Ваше имя *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Иван Иванов"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        {/* Телефон */}
        <div className="form-group">
          <label htmlFor="phone">Телефон *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7 (999) 999-99-99"
            maxLength={18}
            className={errors.phone ? 'input-error' : ''}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>

        {/* Услуга */}
        <div className="form-group">
          <label htmlFor="service">Выберите услугу *</label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={errors.service ? 'input-error' : ''}
          >
            <option value="">-- Выберите услугу --</option>
            <option value="1">Мужская стрижка (1500 ₽)</option>
            <option value="2">Бритье опасной бритвой (1200 ₽)</option>
            <option value="3">Стрижка бороды (1000 ₽)</option>
            <option value="4">Комплекс "Полный уход от тревог" (3500 ₽)</option>
            <option value="5">Детская стрижка (1000 ₽)</option>
            <option value="6">Отец + сын (2200 ₽)</option>
          </select>
          {errors.service && <div className="error-message">{errors.service}</div>}
        </div>

        {/* Дата с календарём */}
        <div className="form-group" ref={calendarRef}>
          <label htmlFor="date">Желаемая дата *</label>
          <div className="date-input-wrapper">
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              max={maxDate}
              className={`date-native ${errors.date ? 'input-error' : ''}`}
            />
            <button
              type="button"
              className="calendar-toggle-btn"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              📅
            </button>
          </div>

          {showCalendar && (
            <div className="calendar-popup">
              <Calendar
                selectedDate={formData.date}
                onSelect={handleDateSelect}
                minDate={today}
                maxDate={maxDate}
              />
            </div>
          )}

          {errors.date && <div className="error-message">{errors.date}</div>}
        </div>

        {/* Время */}
        <div className="form-group">
          <label htmlFor="time">Желаемое время *</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            min={formData.date ? getMinTime() : '09:00'}
            max="21:00"
            className={errors.time ? 'input-error' : ''}
          />
          {errors.time && <div className="error-message">{errors.time}</div>}
        </div>

        {/* Комментарий */}
        <div className="form-group">
          <label htmlFor="comment">Комментарий (необязательно)</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Особые пожелания, предпочтения по мастеру и т.д."
          />
        </div>

        <button type="submit" className="btn" style={{ width: '100%' }}>
          Записаться
        </button>

        <p style={{
          color: 'var(--rose-pale)',
          fontSize: '0.9rem',
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          * Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
        </p>
      </form>
    </div>
  );
}

export default Contact;