import React, { useState, useEffect } from 'react';

// 1.1. Счетчик
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="demo-block">
      <h4>Счетчик: {count}</h4>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button className="danger" onClick={() => setCount(0)}>Сброс</button>
    </div>
  );
}

// 1.2. Форма пользователя
function UserForm() {
  const [user, setUser] = useState({ name: '', email: '', age: '' });
  
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="demo-block">
      <h4>Форма пользователя</h4>
      <input name="name" placeholder="Имя" value={user.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={user.email} onChange={handleChange} />
      <input name="age" placeholder="Возраст" value={user.age} onChange={handleChange} />
      <div style={{ marginTop: '10px', background: '#e0e7ff', padding: '10px', borderRadius: '6px' }}>
        <strong>Текущие значения:</strong><br/>
        Имя: {user.name} | Email: {user.email} | Возраст: {user.age}
      </div>
    </div>
  );
}

// 1.3. Список задач
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="demo-block">
      <h4>Список задач</h4>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Новая задача" style={{ marginRight: '10px' }} />
      <button onClick={addTodo}>Добавить</button>
      
      <div style={{ margin: '10px 0' }}>
        <button onClick={() => setFilter('all')}>Все</button>
        <button onClick={() => setFilter('active')}>Активные</button>
        <button onClick={() => setFilter('completed')}>Завершенные</button>
      </div>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }}>
            <span onClick={() => toggleTodo(todo.id)}>
              {todo.completed ? '✅' : '⬜'} {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 2.1. Таймер
function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="demo-block">
      <h4>Таймер: {time} сек.</h4>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Пауза' : 'Старт'}
      </button>
      <button className="danger" onClick={() => { setTime(0); setIsRunning(false); }}>Сброс</button>
    </div>
  );
}

// 2.2. Размер окна
function WindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="demo-block">
      <h4>Размер окна</h4>
      <div>Ширина: {size.width}px</div>
      <div>Высота: {size.height}px</div>
    </div>
  );
}

// 2.3. Загрузка данных
function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        if (!response.ok) throw new Error('Ошибка сети');
        const userData = await response.json();
        setData(userData);
      } catch (err) {
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="demo-block">
      <h4>Загрузка данных</h4>
      {loading && <div>Загрузка...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && (
        <div>
          <div>Имя: {data.name}</div>
          <div>Email: {data.email}</div>
          <div>Телефон: {data.phone}</div>
        </div>
      )}
    </div>
  );
}

export default function BasicHooks() {
  return (
    <section className="section-card">
      <h2 className="section-title">Базовые хуки: useState и useEffect</h2>
      
      <div className="demo-block">
        <h3>Задание 1: useState</h3>
        <Counter />
        <UserForm />
        <TodoList />
      </div>

      <div className="demo-block">
        <h3>Задание 2: useEffect</h3>
        <Timer />
        <WindowSize />
        <DataFetcher />
      </div>
    </section>
  );
}