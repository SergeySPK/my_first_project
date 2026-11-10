import React, { useState, useEffect, useCallback, useRef } from 'react';

// 7.1. useLocalStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Ошибка записи в localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue];
}

// 7.2. useFetch
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка сети');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
}

// 7.3. useToggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);
  return [value, toggle];
}

// 7.4. useDebounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// 7.5. useWindowSize
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// --- ДЕМОНСТРАЦИОННЫЕ КОМПОНЕНТЫ ---

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage('username', '');
  return (
    <div className="demo-block">
      <h4>useLocalStorage</h4>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Введите имя" />
      <div>Текущее имя: {name}</div>
      <button className="danger" onClick={() => setName('')}>Очистить</button>
    </div>
  );
}

function FetchDemo() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');
  return (
    <div className="demo-block">
      <h4>useFetch</h4>
      {loading && <div>Загрузка пользователей...</div>}
      {error && <div style={{ color: 'red' }}>Ошибка: {error}</div>}
      {data && (
        <ul>
          {data.slice(0, 3).map(user => (
            <li key={user.id}>{user.name} ({user.email})</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ToggleDemo() {
  const [isVisible, toggleVisible] = useToggle(false);
  return (
    <div className="demo-block">
      <h4>useToggle</h4>
      <button onClick={toggleVisible}>{isVisible ? 'Скрыть' : 'Показать'}</button>
      {isVisible && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#e0e7ff', borderRadius: '4px' }}>
          Секретный контент!
        </div>
      )}
    </div>
  );
}

function DebounceDemo() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (debouncedSearch) {
      // Имитация запроса
      const mockResults = [
        `Результат 1 для "${debouncedSearch}"`,
        `Результат 2 для "${debouncedSearch}"`,
        `Результат 3 для "${debouncedSearch}"`
      ];
      setResults(mockResults);
    } else {
      setResults([]);
    }
  }, [debouncedSearch]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '8px' }}>
      <h3>useDebounce (задержка 500мс)</h3>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск (с debounce 500ms)"
      />
      <div>Текущий поиск: {search}</div>
      <div>Debounced поиск: {debouncedSearch}</div>
      {results.length > 0 && (
        <div>
          <h4>Результаты:</h4>
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function WindowSizeDemo() {
  const { width, height } = useWindowSize();
  return (
    <div className="demo-block">
      <h4>useWindowSize</h4>
      <div>Ширина окна: {width}px</div>
      <div>Высота окна: {height}px</div>
    </div>
  );
}

// 7.6. useOnClickOutside - закрытие при клике вне элемента
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Если клик был внутри элемента - ничего не делаем
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Иначе вызываем обработчик
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

function DropdownDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Закрываем dropdown при клике вне
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '8px' }}>
      <h3>useOnClickOutside</h3>
      <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Закрыть' : 'Открыть меню'}
        </button>
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            marginTop: '5px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 100
          }}>
            <div style={{ padding: '5px 0' }}>Пункт 1</div>
            <div style={{ padding: '5px 0' }}>Пункт 2</div>
            <div style={{ padding: '5px 0' }}>Пункт 3</div>
          </div>
        )}
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Кликните вне dropdown - он закроется автоматически.
      </p>
    </div>
  );
}

// 7.7. useMediaQuery - отслеживание медиа-запросов
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

function MediaQueryDemo() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '8px' }}>
      <h3>useMediaQuery</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{
          padding: '10px',
          background: isMobile ? '#10b981' : '#e5e7eb',
          color: isMobile ? 'white' : 'black',
          borderRadius: '4px'
        }}>
          📱 Мобильный: {isMobile ? '✅' : '❌'}
        </div>
        <div style={{
          padding: '10px',
          background: isTablet ? '#3b82f6' : '#e5e7eb',
          color: isTablet ? 'white' : 'black',
          borderRadius: '4px'
        }}>
          📱 Планшет: {isTablet ? '✅' : '❌'}
        </div>
        <div style={{
          padding: '10px',
          background: isDesktop ? '#8b5cf6' : '#e5e7eb',
          color: isDesktop ? 'white' : 'black',
          borderRadius: '4px'
        }}>
          🖥️ Десктоп: {isDesktop ? '✅' : '❌'}
        </div>
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Измените размер окна браузера - индикаторы обновятся автоматически.
      </p>
    </div>
  );
}

// 7.8. useInterval - интервал с паузой и очисткой
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Запоминаем последний callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Настраиваем интервал
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function IntervalDemo() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [delay, setDelay] = useState(1000);
  const [delayInput, setDelayInput] = useState('1000');

  useInterval(
    () => {
      setCount(count + 1);
    },
    isRunning ? delay : null
  );

  const handleDelayChange = (e) => {
    let value = e.target.value;
    
    // Разрешаем пустую строку или только цифры
    if (value !== '' && !/^\d+$/.test(value)) {
      return;
    }
    
    // Убираем ведущие нули (кроме случая, когда вводится только "0")
    if (value.length > 1 && value.startsWith('0')) {
      value = value.replace(/^0+/, '') || '0';
    }
    
    setDelayInput(value);
    
    // Если значение валидно и в диапазоне, обновляем delay
    if (value !== '') {
      const numValue = parseInt(value);
      if (numValue >= 0 && numValue <= 10**10) {
        setDelay(numValue);
      }
    }
  };

  const handleDelayBlur = () => {
    // Нормализуем значение при потере фокуса
    const numValue = parseInt(delayInput) || 0;
    const normalizedValue = Math.max(0, Math.min(10**10, numValue));
    setDelay(normalizedValue);
    setDelayInput(String(normalizedValue));
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '8px' }}>
      <h3>useInterval</h3>
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
        Счётчик: {count}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Задержка (мс): </label>
        <input
          type="text"
          value={delayInput}
          onChange={handleDelayChange}
          onBlur={handleDelayBlur}
          style={{ width: '80px', padding: '5px' }}
        />
      </div>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Пауза' : 'Старт'}
      </button>
      <button onClick={() => { setCount(0); setIsRunning(false); }}>Сброс</button>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Интервал автоматически очищается при размонтировании или изменении задержки.
        Допустимый диапазон: 100-10**10 мс
      </p>
    </div>
  );
}

export default function CustomHooks() {
  return (
    <div style={{ padding: '20px', border: '2px solid purple', margin: '10px', borderRadius: '8px' }}>
      <h2>Кастомные хуки</h2>
      <p>Создайте и используйте собственные хуки для повторного использования логики</p>
      <div>
        <h3>Задание 7: Создание кастомных хуков</h3>
        <LocalStorageDemo />
        <FetchDemo />
        <ToggleDemo />
        <DebounceDemo />
        <WindowSizeDemo />
      </div>
      <div>
        <h3>Задание 10: Дополнительные кастомные хуки</h3>
        <DropdownDemo />
        <MediaQueryDemo />
        <IntervalDemo />
      </div>
    </div>
  );
}