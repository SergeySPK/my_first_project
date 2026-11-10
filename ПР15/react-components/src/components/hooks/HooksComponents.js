import React, { useState, useEffect, useContext, createContext } from "react";
import "./HooksComponents.css";

// 7.3. Контекст для темы
const ThemeContext = createContext();

// 7.1. Кастомный хук useLocalStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// 7.2. Кастомный хук useFetch
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}

// 6.1. Счетчик с хуками
function CounterWithHooks() {
  const [count, setCount] = useState(0);
  return (
    <div className="hooks-box">
      <h4>Счетчик (Хуки)</h4>
      <p>Значение: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

// 6.2. Профиль пользователя
function UserProfile() {
  const [name, setName] = useState("Иван");
  const [age, setAge] = useState(25);

  return (
    <div className="hooks-box">
      <h4>Профиль</h4>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <p>
        Привет, {name}! Твой возраст: {age}
      </p>
    </div>
  );
}

// 6.3. Демонстрация useEffect
function EffectDemo() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Кликов: ${count}`;
  }, [count]); // Срабатывает при изменении count

  return (
    <div className="hooks-box">
      <h4>Effect Demo</h4>
      <p>Кликов: {count} (посмотрите на заголовок вкладки)</p>
      <button onClick={() => setCount(count + 1)}>Клик</button>
    </div>
  );
}

// Компонент переключения темы
function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div
      style={{
        padding: "15px",
        background: theme === "dark" ? "#333" : "#f9f9f9",
        color: theme === "dark" ? "white" : "black",
        borderRadius: "8px",
      }}
    >
      <p>
        Текущая тема: <strong>{theme}</strong>
      </p>
      <button onClick={toggleTheme}>Переключить тему</button>
    </div>
  );
}

// Провайдер контекста
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function HooksComponents() {
  const [savedText, setSavedText] = useLocalStorage("my-text", "");
  const { data, loading } = useFetch(
    "https://jsonplaceholder.typicode.com/posts/1",
  );

  return (
    <section className="task-section">
      <h2>React Hooks</h2>

      <div className="component-demo">
        <h3>Задание 6: useState и useEffect</h3>
        <div id="hooks-output-1" className="output">
          <CounterWithHooks />
          <UserProfile />
          <EffectDemo />
        </div>
      </div>

      <div className="component-demo">
        <h3>Задание 7: Кастомные хуки и Context</h3>
        <div id="hooks-output-2" className="output">
          <div className="hooks-box">
            <h4>useLocalStorage</h4>
            <input
              value={savedText}
              onChange={(e) => setSavedText(e.target.value)}
              placeholder="Введите текст..."
            />
            <p>Сохранено: {savedText} (перезагрузите страницу)</p>
          </div>

          <div className="hooks-box">
            <h4>useFetch</h4>
            {loading ? (
              <p>Загрузка...</p>
            ) : (
              <p>Заголовок поста: {data?.title}</p>
            )}
          </div>

          <ThemeProvider>
            <ThemeToggle />
          </ThemeProvider>
        </div>
      </div>
    </section>
  );
}

export default HooksComponents;
