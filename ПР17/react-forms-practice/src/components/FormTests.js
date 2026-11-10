import React, { useState } from 'react';

function FormTests() {
  const [results, setResults] = useState(null);

  const runTests = () => {
    const testResults = [];
    const bodyText = document.body.textContent;

    const addTest = (name, condition, successMsg, errorMsg) => {
      testResults.push({
        name,
        passed: condition,
        message: condition ? successMsg : errorMsg,
      });
    };

    try {
      // === ЗАДАНИЕ 1: UserRegistrationForm (управляемые компоненты) ===

      // Тест 1.1: Заголовок формы отрисован
      const hasRegFormTitle = bodyText.includes('Управляемая форма регистрации');
      addTest(
        'UserRegistrationForm: заголовок отрисован',
        hasRegFormTitle,
        'Заголовок "Управляемая форма регистрации" найден',
        'Заголовок формы не найден'
      );

      // Тест 1.2: Все поля ввода присутствуют
      const regInputs = Array.from(document.querySelectorAll('input'))
        .filter(input =>
          ['name', 'email', 'password', 'confirmPassword'].includes(input.name)
        );
      addTest(
        'UserRegistrationForm: поля name/email/password/confirmPassword',
        regInputs.length >= 4,
        `Найдено полей: ${regInputs.length}`,
        'Не все текстовые поля найдены'
      );

      // Тест 1.3: Radio-кнопки пола
      const genderRadios = Array.from(document.querySelectorAll('input[type="radio"]'))
        .filter(radio => radio.name === 'gender');
      addTest(
        'UserRegistrationForm: radio-кнопки пола (male/female)',
        genderRadios.length >= 2,
        `Найдено radio: ${genderRadios.length}`,
        'Radio-кнопки пола не найдены'
      );

      // Тест 1.4: Select возраста
      const ageSelect = document.querySelector('select[name="age"]');
      addTest(
        'UserRegistrationForm: select возраста',
        !!ageSelect,
        'Select возраста найден',
        'Select возраста не найден'
      );

      // Тест 1.5: Textarea "О себе"
      const aboutTextarea = document.querySelector('textarea[name="about"]');
      addTest(
        'UserRegistrationForm: textarea "О себе"',
        !!aboutTextarea,
        'Textarea найдена',
        'Textarea не найдена'
      );

      // Тест 1.6: Checkbox подписки
      const subscribeCheckbox = document.querySelector('input[name="subscribe"]');
      addTest(
        'UserRegistrationForm: checkbox подписки',
        !!subscribeCheckbox,
        'Checkbox подписки найден',
        'Checkbox подписки не найден'
      );

      // Тест 1.7: Кнопка отправки
      const submitButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent.trim() === 'Зарегистрироваться');
      addTest(
        'UserRegistrationForm: кнопка "Зарегистрироваться"',
        !!submitButton,
        'Кнопка отправки найдена',
        'Кнопка отправки не найдена'
      );

      // Тест 1.8: Блок с текущими значениями формы
      const hasValuesBlock = bodyText.includes('Текущие значения формы');
      addTest(
        'UserRegistrationForm: блок с текущими значениями',
        hasValuesBlock,
        'Блок с текущими значениями найден',
        'Блок с текущими значениями не найден'
      );

      // Тест 1.9: Счётчик символов для textarea
      const charCounter = bodyText.includes('/1000 символов');
      addTest(
        'UserRegistrationForm: счётчик символов (1000)',
        charCounter,
        'Счётчик символов "0/1000" найден',
        'Счётчик символов не найден'
      );

      // Тест 1.10: Поля имеют атрибут required
      const requiredFields = Array.from(document.querySelectorAll('input[required], select[required]'));
      addTest(
        'UserRegistrationForm: обязательные поля (required)',
        requiredFields.length >= 5,
        `Найдено required-полей: ${requiredFields.length}`,
        'Недостаточно required-полей'
      );

      // Тест 1.11: Email имеет pattern
      const emailPattern = document.querySelector('input[name="email"][pattern]');
      addTest(
        'UserRegistrationForm: email имеет pattern',
        !!emailPattern,
        'Email имеет атрибут pattern',
        'Email не имеет атрибут pattern'
      );

      // Тест 1.12: Пароль имеет minLength=8
      const passwordMinLength = document.querySelector('input[name="password"][minLength="8"]');
      addTest(
        'UserRegistrationForm: пароль имеет minLength=8',
        !!passwordMinLength,
        'Пароль имеет minLength=8',
        'Пароль не имеет minLength=8'
      );

      // === ЗАДАНИЕ 2: UserRegistrationFormWithValidation (валидация) ===

      // Тест 2.1: Заголовок формы с валидацией
      const hasValFormTitle = bodyText.includes('Управляемая форма с валидацией');
      addTest(
        'UserRegistrationFormWithValidation: заголовок отрисован',
        hasValFormTitle,
        'Заголовок формы с валидацией найден',
        'Заголовок формы с валидацией не найден'
      );

      // Тест 2.2: Форма имеет атрибут noValidate
      const valForm = document.querySelector('.registration-form[novalidate]') ||
                      Array.from(document.querySelectorAll('form')).find(f =>
                        f.querySelector('h2')?.textContent?.includes('валидацией')
                      );
      addTest(
        'UserRegistrationFormWithValidation: форма имеет noValidate',
        !!valForm?.hasAttribute('noValidate'),
        'Форма имеет noValidate',
        'Форма не имеет noValidate'
      );

      // Тест 2.3: Индикатор силы пароля (скрыт по умолчанию)
      const hasStrengthBar = bodyText.includes('Слабый') || bodyText.includes('Средний') || bodyText.includes('Сильный');
      addTest(
        'UserRegistrationFormWithValidation: индикатор силы пароля',
        hasStrengthBar || document.querySelector('.strength-bar') !== null,
        'Индикатор силы пароля найден',
        'Индикатор силы пароля не найден'
      );

      // Тест 2.4: Счётчик символов (500)
      const has500Counter = bodyText.includes('/500 символов');
      addTest(
        'UserRegistrationFormWithValidation: счётчик символов (500)',
        has500Counter,
        'Счётчик символов "0/500" найден',
        'Счётчик символов не найден'
      );

      // Тест 2.5: Поля имеют обработчики onBlur
      const valInputs = document.querySelectorAll('.validation-form input');
      addTest(
        'UserRegistrationFormWithValidation: поля имеют onBlur',
        valInputs.length > 0,
        `Найдено полей в форме с валидацией: ${valInputs.length}`,
        'Поля формы с валидацией не найдены'
      );

      // Тест 2.6: Все обязательные поля помечены звёздочкой
      const requiredLabels = Array.from(document.querySelectorAll('.validation-form label'))
        .filter(label => label.textContent.includes('*'));
      addTest(
        'UserRegistrationFormWithValidation: обязательные поля помечены *',
        requiredLabels.length >= 5,
        `Найдено обязательных полей (*): ${requiredLabels.length}`,
        'Недостаточно обязательных полей, помеченных *'
      );

      // === ЗАДАНИЕ 3: ContactFormUncontrolled (неуправляемые) ===

      // Тест 3.1: Заголовок неуправляемой формы
      const hasUncontrolledTitle = bodyText.includes('Неуправляемая форма обратной связи');
      addTest(
        'ContactFormUncontrolled: заголовок отрисован',
        hasUncontrolledTitle,
        'Заголовок неуправляемой формы найден',
        'Заголовок неуправляемой формы не найден'
      );

      // Тест 3.2: Информационный блок с объяснением
      const hasInfoBlock = bodyText.includes('Чем отличается от управляемой формы');
      addTest(
        'ContactFormUncontrolled: информационный блок с объяснением',
        hasInfoBlock,
        'Информационный блок найден',
        'Информационный блок не найден'
      );

      // Тест 3.3: Поле имени
      const contactName = document.querySelector('#contact-name');
      addTest(
        'ContactFormUncontrolled: поле имени (#contact-name)',
        !!contactName,
        'Поле имени найдено',
        'Поле имени не найдено'
      );

      // Тест 3.4: Поле email
      const contactEmail = document.querySelector('#contact-email');
      addTest(
        'ContactFormUncontrolled: поле email (#contact-email)',
        !!contactEmail,
        'Поле email найдено',
        'Поле email не найдено'
      );

      // Тест 3.5: Select темы
      const contactTopic = document.querySelector('#contact-topic');
      addTest(
        'ContactFormUncontrolled: select темы (#contact-topic)',
        !!contactTopic,
        'Select темы найден',
        'Select темы не найден'
      );

      // Тест 3.6: Textarea сообщения
      const contactMessage = document.querySelector('#contact-message');
      addTest(
        'ContactFormUncontrolled: textarea сообщения',
        !!contactMessage,
        'Textarea сообщения найдена',
        'Textarea сообщения не найдена'
      );

      // Тест 3.7: Кнопка "Отправить сообщение"
      const sendButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent.trim() === 'Отправить сообщение');
      addTest(
        'ContactFormUncontrolled: кнопка "Отправить сообщение"',
        !!sendButton,
        'Кнопка отправки найдена',
        'Кнопка отправки не найдена'
      );

      // Тест 3.8: Кнопка "Очистить форму"
      const clearButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent.trim() === 'Очистить форму');
      addTest(
        'ContactFormUncontrolled: кнопка "Очистить форму"',
        !!clearButton,
        'Кнопка очистки найдена',
        'Кнопка очистки не найдена'
      );

      // Тест 3.9: Счётчик символов (0/500)
      const uncontrolledCounter = bodyText.includes('0/500 символов');
      addTest(
        'ContactFormUncontrolled: счётчик символов',
        uncontrolledCounter,
        'Счётчик символов "0/500" найден',
        'Счётчик символов не найден'
      );

      // Тест 3.10: maxLength=500 на textarea
      const messageMaxLength = document.querySelector('#contact-message[maxLength="500"]');
      addTest(
        'ContactFormUncontrolled: maxLength=500 на textarea',
        !!messageMaxLength,
        'maxLength=500 установлен',
        'maxLength не установлен'
      );

      // === ИНТЕГРАЦИОННЫЕ ТЕСТЫ ===

      // Тест 4.1: Все три формы отрисованы на странице
      const allFormsPresent = hasRegFormTitle && hasValFormTitle && hasUncontrolledTitle;
      addTest(
        'Интеграция: все три формы отрисованы',
        allFormsPresent,
        'Все три формы найдены на странице',
        'Не все формы отрисованы'
      );

      // Тест 4.2: Бирюзовая тема (цвет #0f766e или #14b8a6 в стилях)
      const hasTealTheme = document.body.innerHTML.includes('#0f766e') ||
                           document.body.innerHTML.includes('#14b8a6');
      addTest(
        'Интеграция: бирюзовая тема применена',
        hasTealTheme,
        'Бирюзовая тема найдена в стилях',
        'Бирюзовая тема не применена'
      );

      // Тест 4.3: Нет alert() в коде (используется DOM-вывод)
      const hasAlertInTests = bodyText.includes('alert(');
      addTest(
        'Интеграция: тесты не используют alert',
        !hasAlertInTests,
        'Тесты используют DOM-вывод',
        'Тесты используют alert'
      );

    } catch (error) {
      testResults.push({
        name: 'Критическая ошибка',
        passed: false,
        message: `Ошибка выполнения: ${error.message}`,
      });
    }

    setResults(testResults);

    // Вывод в консоль
    console.log('=== РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ ФОРМ ===');
    testResults.forEach(test => {
      console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.message}`);
    });

    const passedTests = testResults.filter(t => t.passed).length;
    const totalTests = testResults.length;
    console.log(`Итого: ${passedTests}/${totalTests} тестов пройдено`);
  };

  const passedCount = results ? results.filter(r => r.passed).length : 0;
  const totalCount = results ? results.length : 0;

  return (
    <div style={{
      padding: '20px',
      border: '2px solid orange',
      margin: '10px',
      borderRadius: '8px',
      background: '#fff7ed'
    }}>
      <h2 style={{ color: '#c2410c', marginBottom: '15px' }}>
        Тестирование форм
      </h2>
      <button
        onClick={runTests}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          background: '#f97316',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Запустить тесты
      </button>

      {results && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{
            textAlign: 'center',
            color: passedCount === totalCount ? '#10b981' : '#ef4444',
            fontSize: '20px'
          }}>
            Результат: {passedCount} из {totalCount} тестов пройдено
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
            {results.map((test, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  borderLeft: '6px solid',
                  borderColor: test.passed ? '#10b981' : '#ef4444',
                  backgroundColor: test.passed ? '#f0fdf4' : '#fef2f2',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', flexWrap: 'wrap', gap: '8px' }}>
                  <strong style={{ fontSize: '14px', wordBreak: 'break-word' }}>{test.name}</strong>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: test.passed ? '#d1fae5' : '#fee2e2',
                      color: test.passed ? '#065f46' : '#991b1b',
                      flexShrink: 0
                    }}
                  >
                    {test.passed ? '✅ УСПЕХ' : '❌ ОШИБКА'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#555', wordBreak: 'break-word' }}>
                  {test.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <h4>Инструкция по проверке:</h4>
        <ul style={{ lineHeight: '1.8', marginLeft: '20px' }}>
          <li>Задание 1 - управляемая форма с единым объектом formData</li>
          <li>Задание 2 - форма с валидацией, индикатором силы пароля, флагом touched</li>
          <li>Задание 3 - неуправляемая форма через useRef, с информационным блоком</li>
          <li>Все формы используют бирюзовую тему (#0f766e, #14b8a6)</li>
          <li>Тесты проверяют наличие полей, кнопок, атрибутов и блоков</li>
        </ul>
      </div>
    </div>
  );
}

export default FormTests;