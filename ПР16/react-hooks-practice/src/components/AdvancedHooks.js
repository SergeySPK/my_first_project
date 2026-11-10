import React, { useState, useEffect, useReducer, useContext, useImperativeHandle, useCallback, useMemo, useRef, createContext, useLayoutEffect, forwardRef } from 'react';

// --- КОНТЕКСТ ДЛЯ ПРИМЕРА ---
const ThemeContext = createContext();

// --- ЗАДАНИЕ 3: useReducer ---

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const sampleItems = [
    { id: 1, name: 'Товар 1', price: 100 },
    { id: 2, name: 'Товар 2', price: 200 },
    { id: 3, name: 'Товар 3', price: 300 }
  ];

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '8px' }}>
      <h3>Корзина покупок (useReducer)</h3>
      <div>
        <h4>Добавить товары:</h4>
        {sampleItems.map(item => (
          <button key={item.id} onClick={() => addItem(item)}>
            Добавить {item.name} (${item.price})
          </button>
        ))}
      </div>
      <div>
        <h4>Товары в корзине:</h4>
        {state.items.length === 0 && <p>Корзина пуста</p>}
        {state.items.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
            <span>{item.name}</span>
            <span>${item.price}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            <button onClick={() => removeItem(item.id)}>Удалить</button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
        Общая сумма: ${total}
      </div>
      <button onClick={() => dispatch({ type: 'CLEAR_CART' })} style={{ marginTop: '10px' }}>
        Очистить корзину
      </button>
    </div>
  );
}

const stopwatchReducer = (state, action) => {
  switch (action.type) {
    case 'START': return { ...state, isRunning: true };
    case 'STOP': return { ...state, isRunning: false };
    case 'RESET': return { isRunning: false, time: 0, laps: [] };
    case 'TICK': return { ...state, time: state.time + 1 };
    case 'LAP': return { ...state, laps: [...state.laps, state.time] };
    default: return state;
  }
};

function Stopwatch() {
  const [state, dispatch] = useReducer(stopwatchReducer, { isRunning: false, time: 0, laps: [] });

  useEffect(() => {
    let interval;
    if (state.isRunning) {
      interval = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    }
    return () => clearInterval(interval);
  }, [state.isRunning]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '8px' }}>
      <h3>Секундомер: {state.time} сек.</h3>
      <button onClick={() => dispatch({ type: state.isRunning ? 'STOP' : 'START' })}>
        {state.isRunning ? 'Стоп' : 'Старт'}
      </button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Сброс</button>
      <button onClick={() => dispatch({ type: 'LAP' })}>Круг</button>
      {state.laps.length > 0 && (
        <div>
          <h4>Круги:</h4>
          <ul>
            {state.laps.map((lap, index) => (
              <li key={index}>Круг {index + 1}: {lap} сек.</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- ЗАДАНИЕ 4: useContext ---

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '20px',
      margin: '10px',
      borderRadius: '8px',
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000'
    }}>
      <h3>Тема: {theme}</h3>
      <button onClick={toggleTheme}>Переключить тему</button>
    </div>
  );
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// --- ЗАДАНИЕ 5: useMemo и useCallback ---

function ExpensiveCalculation() {
  const [number, setNumber] = useState(1);
  const [renderCount, setRenderCount] = useState(0);
  const [dummy, setDummy] = useState(0);

  // useMemo предотвращает пересчёт при каждом рендере
  const expensiveResult = useMemo(() => {
    console.log('Выполняются сложные вычисления...');
    let result = 0;
    for (let i = 0; i < 10000000; i++) {
      result += number;
    }
    return result;
  }, [number]);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '8px' }}>
      <h3>useMemo (Сложные вычисления)</h3>
      <div>Число: {number}</div>
      <div>Результат: {expensiveResult}</div>
      <div>Количество рендеров: {renderCount}</div>
      <button onClick={() => setNumber(prev => prev + 1)}>Увеличить число</button>
      <button onClick={() => setDummy(dummy + 1)}>Вызвать рендер (без изменения числа)</button>
    </div>
  );
}

// --- ЗАДАНИЕ 6: useRef ---

function FocusInput() {
  const inputRef = useRef(null);
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '8px' }}>
      <h3>useRef (Фокус на input)</h3>
      <input ref={inputRef} placeholder="Нажмите кнопку для фокуса" style={{ marginRight: '10px' }} />
      <button onClick={() => inputRef.current.focus()}>Фокус на input</button>
    </div>
  );
}

function PreviousValue() {
  const [value, setValue] = useState('');
  const previousValue = useRef('');

  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '8px' }}>
      <h3>useRef (Предыдущее значение)</h3>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Введите текст"
      />
      <div>Текущее: {value}</div>
      <div>Предыдущее: {previousValue.current}</div>
    </div>
  );
}

// --- ЗАДАНИЕ 7: useLayoutEffect ---
function LayoutEffectDemo() {
  const [width, setWidth] = useState(0);
  const boxRef = useRef(null);

  // useLayoutEffect выполняется СИНХРОННО после DOM-мутаций, но ДО отрисовки
  // useEffect выполняется АСИНХРОННО ПОСЛЕ отрисовки
  useLayoutEffect(() => {
    // Измеряем ширину элемента сразу после монтирования
    setWidth(boxRef.current.offsetWidth);
    console.log('useLayoutEffect: ширина измерена ДО отрисовки');
  }, []);

  useEffect(() => {
    console.log('useEffect: выполнился ПОСЛЕ отрисовки');
  }, []);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '8px' }}>
      <h3>useLayoutEffect (синхронное измерение)</h3>
      <div ref={boxRef} style={{ background: '#e0e7ff', padding: '20px', borderRadius: '8px' }}>
        Ширина этого блока: {width}px
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        useLayoutEffect измеряет DOM до того, как браузер отрисует изменения. 
        Это полезно для измерений, анимаций и предотвращения мерцания.
      </p>
    </div>
  );
}

// --- ЗАДАНИЕ 8: useImperativeHandle + forwardRef ---
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    },
    getValue: () => {
      return inputRef.current?.value || '';
    }
  }), []);

  return (
    <input
      ref={inputRef}
      {...props}
      style={{ 
        padding: '8px 12px', 
        border: '1px solid #ccc', 
        borderRadius: '4px',
        fontSize: '14px'
      }}
    />
  );
});

function ImperativeHandleDemo() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      console.log('✅ Фокус установлен на input');
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.clear();
      console.log('✅ Input очищен');
    }
  };

  const handleGetValue = () => {
    if (inputRef.current) {
      const value = inputRef.current.getValue();
      alert(`Значение input: ${value}`);
      console.log('✅ Получено значение:', value);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '8px' }}>
      <h3>useImperativeHandle + forwardRef</h3>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
        <CustomInput ref={inputRef} placeholder="Введите текст" />
        <button onClick={handleFocus}>Фокус</button>
        <button onClick={handleClear}>Очистить</button>
        <button onClick={handleGetValue}>Получить значение</button>
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Родительский компонент получает контроль над методами дочернего через ref.
        Это полезно для создания переиспользуемых компонентов с кастомным API.
      </p>
    </div>
  );
}

// --- ОСНОВНОЙ КОМПОНЕНТ РАЗДЕЛА ---

export default function AdvancedHooks() {
  return (
    <ThemeProvider>
      <div style={{ padding: '20px', border: '2px solid green', margin: '10px', borderRadius: '8px' }}>
        <h2>Продвинутые хуки</h2>
        <div>
          <h3>Задание 3: useReducer</h3>
          <ShoppingCart />
          <Stopwatch />
        </div>
        <div>
          <h3>Задание 4: useContext</h3>
          <ThemeToggle />
        </div>
        <div>
          <h3>Задание 5 и 6: Оптимизация (useMemo, useRef)</h3>
          <ExpensiveCalculation />
          <FocusInput />
          <PreviousValue />
        </div>
        <div>
          <h3>Задание 7: useLayoutEffect</h3>
          <LayoutEffectDemo />
        </div>
        <div>
          <h3>Задание 8: useImperativeHandle + forwardRef</h3>
          <ImperativeHandleDemo />
        </div>
      </div>
    </ThemeProvider>
  );
}