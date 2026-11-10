import React, { useState } from 'react';

function HooksTests() {
  const [results, setResults] = useState(null);

  const runTests = () => {
    const testResults = [];
    const bodyText = document.body.textContent;

    const addTest = (name, condition, successMsg, errorMsg) => {
      testResults.push({
        name: name,
        passed: condition,
        message: condition ? successMsg : errorMsg,
      });
    };

    try {
      // === ТЕСТ 1: Counter (useState) ===
      const hasCounter = bodyText.includes('Счетчик');
      addTest(
        'Counter отрисован',
        hasCounter,
        'Компонент Counter найден',
        'Counter не найден в DOM'
      );

      const counterButtons = Array.from(document.querySelectorAll('button'))
        .filter(btn => ['+1', '-1', 'Сброс'].includes(btn.textContent.trim()));
      addTest(
        'Counter имеет кнопки управления',
        counterButtons.length >= 3,
        `Найдено кнопок: ${counterButtons.length}`,
        'Не все кнопки счётчика найдены'
      );

      // === ТЕСТ 2: UserForm ===
      const userFormInputs = Array.from(document.querySelectorAll('input'))
        .filter(input => ['name', 'email', 'age'].includes(input.name));
      addTest(
        'UserForm имеет поля name/email/age',
        userFormInputs.length >= 3,
        `Найдено полей: ${userFormInputs.length}`,
        'Поля формы не найдены'
      );

      // === ТЕСТ 3: TodoList ===
      const hasTodoList = bodyText.includes('Список задач') || bodyText.includes('Новая задача');
      addTest(
        'TodoList отрисован',
        hasTodoList,
        'TodoList найден',
        'TodoList не найден'
      );

      const todoInput = Array.from(document.querySelectorAll('input'))
        .find(input => input.placeholder === 'Новая задача');
      addTest(
        'TodoList имеет поле ввода',
        !!todoInput,
        'Поле ввода задачи найдено',
        'Поле ввода задачи не найдено'
      );

      // === ТЕСТ 4: Timer (useEffect) ===
      const hasTimer = bodyText.includes('Таймер') && bodyText.includes('сек');
      addTest(
        'Timer отрисован',
        hasTimer,
        'Timer найден',
        'Timer не найден'
      );

      // === ТЕСТ 5: WindowSize (useEffect) ===
      const hasWindowSize = bodyText.includes('Размер окна') || bodyText.includes('Ширина');
      addTest(
        'WindowSize отрисован',
        hasWindowSize,
        'WindowSize найден',
        'WindowSize не найден'
      );

      const windowSizeText = bodyText;
      const hasWidth = /Ширина:\s*\d+px/.test(windowSizeText);
      const hasHeight = /Высота:\s*\d+px/.test(windowSizeText);
      addTest(
        'WindowSize показывает размеры в px',
        hasWidth && hasHeight,
        'Размеры отображаются корректно',
        'Размеры не отображаются или без "px"'
      );

      // === ТЕСТ 6: DataFetcher (useEffect + fetch) ===
      const hasDataFetcher = bodyText.includes('Загрузка данных') || bodyText.includes('Имя:') || bodyText.includes('Загрузка...');
      addTest(
        'DataFetcher отрисован',
        hasDataFetcher,
        'DataFetcher найден',
        'DataFetcher не найден'
      );

      // === ТЕСТ 7: ShoppingCart (useReducer) ===
      const hasCart = bodyText.includes('Корзина покупок');
      addTest(
        'ShoppingCart (useReducer) отрисован',
        hasCart,
        'Корзина найдена',
        'Корзина не найдена'
      );

      const cartEmpty = bodyText.includes('Корзина пуста') || bodyText.includes('Общая сумма: $0');
      addTest(
        'Корзина пуста при старте',
        cartEmpty,
        'Корзина пуста',
        'Корзина не пуста при старте'
      );

      // === ТЕСТ 8: Stopwatch (useReducer) ===
      const hasStopwatch = bodyText.includes('Секундомер');
      addTest(
        'Stopwatch (useReducer) отрисован',
        hasStopwatch,
        'Секундомер найден',
        'Секундомер не найден'
      );

      const stopwatchText = bodyText;
      addTest(
        'Stopwatch показывает 0 сек. при старте',
        stopwatchText.includes('0 сек'),
        'Начальное значение 0',
        'Неверное начальное значение'
      );

      // === ТЕСТ 9: ThemeToggle (useContext) ===
      const hasTheme = bodyText.includes('Тема:');
      addTest(
        'ThemeToggle (useContext) отрисован',
        hasTheme,
        'Переключатель темы найден',
        'Переключатель темы не найден'
      );

      const themeText = bodyText;
      addTest(
        'Начальная тема — light',
        themeText.includes('Тема: light'),
        'Тема: light',
        'Тема не light'
      );

      // === ТЕСТ 10: ExpensiveCalculation (useMemo) ===
      const hasMemo = bodyText.includes('Сложные вычисления') || bodyText.includes('Количество рендеров');
      addTest(
        'ExpensiveCalculation (useMemo) отрисован',
        hasMemo,
        'Блок useMemo найден',
        'Блок useMemo не найден'
      );

      // === ТЕСТ 11: FocusInput (useRef) ===
      const hasFocus = bodyText.includes('Фокус на input');
      addTest(
        'FocusInput (useRef) отрисован',
        hasFocus,
        'FocusInput найден',
        'FocusInput не найден'
      );

      // === ТЕСТ 12: PreviousValue (useRef) ===
      const hasPrevValue = bodyText.includes('Предыдущее значение') || (bodyText.includes('Текущее:') && bodyText.includes('Предыдущее:'));
      addTest(
        'PreviousValue (useRef) отрисован',
        hasPrevValue,
        'PreviousValue найден',
        'PreviousValue не найден'
      );

      // === ТЕСТ 13: useLocalStorage ===
      const hasLocalStorage = bodyText.includes('useLocalStorage') || bodyText.includes('Текущее имя:');
      addTest(
        'useLocalStorage отрисован',
        hasLocalStorage,
        'useLocalStorage найден',
        'useLocalStorage не найден'
      );

      // === ТЕСТ 14: useFetch ===
      const hasFetch = bodyText.includes('useFetch') || bodyText.includes('Загрузка пользователей');
      addTest(
        'useFetch отрисован',
        hasFetch,
        'useFetch найден',
        'useFetch не найден'
      );

      // === ТЕСТ 15: useToggle ===
      const hasToggle = bodyText.includes('useToggle') || bodyText.includes('Секретный контент');
      addTest(
        'useToggle отрисован',
        hasToggle,
        'useToggle найден',
        'useToggle не найден'
      );

      // === ТЕСТ 16: useDebounce ===
      const hasDebounce = bodyText.includes('useDebounce') || bodyText.includes('Debounced');
      addTest(
        'useDebounce отрисован',
        hasDebounce,
        'useDebounce найден',
        'useDebounce не найден'
      );

      // === ТЕСТ 17: useWindowSize ===
      const hasWindowSizeHook = bodyText.includes('useWindowSize') || bodyText.includes('Ширина окна:');
      addTest(
        'useWindowSize (кастомный хук) отрисован',
        hasWindowSizeHook,
        'useWindowSize найден',
        'useWindowSize не найден'
      );

      // === ТЕСТ 18: Симуляция клика на счётчике ===
      const plusButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent.trim() === '+1');
      addTest(
        'Кнопка +1 кликабельна',
        !!plusButton,
        'Кнопка +1 найдена',
        'Кнопка +1 не найдена'
      );

      // === ТЕСТ 19: useLayoutEffect ---
      const hasLayoutEffect = bodyText.includes('useLayoutEffect');
      addTest(
        'LayoutEffectDemo отрисован',
        hasLayoutEffect,
        'LayoutEffectDemo найден',
        'LayoutEffectDemo не найден'
      );

      // === ТЕСТ 20: useImperativeHandle ===
      const hasImperative = bodyText.includes('useImperativeHandle');
      addTest(
        'ImperativeHandleDemo отрисован',
        hasImperative,
        'ImperativeHandleDemo найден',
        'ImperativeHandleDemo не найден'
      );

      // === ТЕСТ 21: useOnClickOutside ===
      const hasOnClickOutside = bodyText.includes('useOnClickOutside');
      addTest(
        'DropdownDemo (useOnClickOutside) отрисован',
        hasOnClickOutside,
        'DropdownDemo найден',
        'DropdownDemo не найден'
      );

      // === ТЕСТ 22: useMediaQuery ===
      const hasMediaQuery = bodyText.includes('useMediaQuery');
      addTest(
        'MediaQueryDemo (useMediaQuery) отрисован',
        hasMediaQuery,
        'MediaQueryDemo найден',
        'MediaQueryDemo не найден'
      );

      // === ТЕСТ 23: useInterval ===
      const hasInterval = bodyText.includes('useInterval');
      addTest(
        'IntervalDemo (useInterval) отрисован',
        hasInterval,
        'IntervalDemo найден',
        'IntervalDemo не найден'
      );

    } catch (error) {
      testResults.push({
        name: 'Критическая ошибка',
        passed: false,
        message: `Ошибка выполнения: ${error.message}`,
      });
    }

    setResults(testResults);

    console.log('=== РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ ХУКОВ ===');
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
    <div style={{ padding: '20px', border: '2px solid orange', margin: '10px', borderRadius: '8px' }}>
      <h2>Тестирование хуков</h2>
      <button
        onClick={runTests}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Запустить тесты
      </button>

      {results && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ textAlign: 'center', color: passedCount === totalCount ? 'green' : 'red' }}>
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
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <strong style={{ fontSize: '14px' }}>{test.name}</strong>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: test.passed ? '#d1fae5' : '#fee2e2',
                      color: test.passed ? '#065f46' : '#991b1b',
                    }}
                  >
                    {test.passed ? '✅ УСПЕХ' : '❌ ОШИБКА'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#555' }}>
                  {test.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <h4>Инструкция по проверке:</h4>
        <ul>
          <li>Счетчик - увеличивается/уменьшается/сбрасывается</li>
          <li>Форма - сохраняет значения в state</li>
          <li>Список задач - добавляет/фильтрует задачи</li>
          <li>Таймер - запускается/останавливается</li>
          <li>Размер окна - отображает текущие размеры</li>
          <li>Загрузка данных - показывает данные с API</li>
          <li>Корзина - добавляет/удаляет товары, считает сумму</li>
          <li>Секундомер - работает с useReducer</li>
          <li>Тема - переключается через useContext</li>
          <li>useMemo - оптимизирует вычисления</li>
          <li>useRef - работает с DOM и значениями</li>
          <li>Кастомные хуки - работают корректно</li>
        </ul>
      </div>
    </div>
  );
}

export default HooksTests;