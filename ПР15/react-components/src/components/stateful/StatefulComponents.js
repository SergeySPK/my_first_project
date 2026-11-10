import React, { Component } from "react";
import "./StatefulComponents.css";

// 3.1. Счетчик (классовый)
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: props.initialValue || 0 };
  }
  render() {
    return (
      <div className="stateful-box">
        <div className="counter-display">{this.state.count}</div>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          +
        </button>
        <button onClick={() => this.setState({ count: this.state.count - 1 })}>
          -
        </button>
      </div>
    );
  }
}

// 3.2. Форма входа (классовый)
class LoginForm extends Component {
  state = { email: "", password: "", error: "" };

  handleSubmit = (e) => {
    e.preventDefault();

    // Браузер уже проверит email и required поля благодаря атрибутам в JSX.
    // Нам остается проверить только пароль.
    if (this.state.password.length < 5) {
      this.setState({ error: "Пароль должен содержать минимум 5 символов" });
    } else {
      this.setState({ error: "", email: "", password: "" });
      alert("Успешный вход!");
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="stateful-box">
        <h4>Вход в систему</h4>
        {this.state.error && <p className="error-text">{this.state.error}</p>}

        <input
          type="email"
          placeholder="Email (user@mail.ru)"
          value={this.state.email}
          onChange={(e) => this.setState({ email: e.target.value })}
          required // Запрещает отправку пустого поля
          pattern="[^\s@]+@[^\s@]+\.[^\s@]+" // Требует наличие @ и точки с доменом
          title="Введите полный email с доменом, например: user@mail.ru" // Текст подсказки браузера
        />

        <input
          type="password"
          placeholder="Пароль (мин. 5 символов)"
          value={this.state.password}
          onChange={(e) => this.setState({ password: e.target.value })}
          required
        />
        <button type="submit">Войти</button>
      </form>
    );
  }
}

// 3.3. Выбор цвета (классовый)
class ColorPicker extends Component {
  state = { color: "#14b8a6" };
  render() {
    return (
      <div className="stateful-box">
        <div
          style={{
            width: "50px",
            height: "50px",
            background: this.state.color,
            borderRadius: "50%",
          }}
        ></div>
        <p>Выбранный цвет: {this.state.color}</p>
        <div>
          {this.props.colors.map((c) => (
            <button
              key={c}
              style={{ background: c }}
              onClick={() => this.setState({ color: c })}
            ></button>
          ))}
        </div>
      </div>
    );
  }
}

// 4.1. Список задач (классовый)
class TodoList extends Component {
  state = { tasks: [], input: "" };

  addTask = () => {
    if (this.state.input.trim()) {
      this.setState({
        tasks: [...this.state.tasks, { text: this.state.input, done: false }],
        input: "",
      });
    }
  };

  toggleTask = (index) => {
    const newTasks = [...this.state.tasks];
    newTasks[index].done = !newTasks[index].done;
    this.setState({ tasks: newTasks });
  };

  removeTask = (index) => {
    this.setState({ tasks: this.state.tasks.filter((_, i) => i !== index) });
  };

  render() {
    return (
      <div className="stateful-box">
        <h4>Список задач</h4>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={this.state.input}
            onChange={(e) => this.setState({ input: e.target.value })}
            placeholder="Новая задача..."
          />
          <button onClick={this.addTask}>Добавить</button>
        </div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {this.state.tasks.map((task, i) => (
            <li
              key={i}
              style={{
                textDecoration: task.done ? "line-through" : "none",
                margin: "10px 0",
                background: "#f8fafc",
                padding: "5px",
              }}
            >
              <span
                onClick={() => this.toggleTask(i)}
                style={{ cursor: "pointer", flex: 1 }}
              >
                {task.text}
              </span>
              <button
                onClick={() => this.removeTask(i)}
                style={{ background: "#ef4444" }}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

// 4.2. Поле поиска (классовый)
class SearchBox extends Component {
  state = { query: "" };

  render() {
    const filteredItems = this.props.items.filter((item) =>
      item.toLowerCase().includes(this.state.query.toLowerCase()),
    );

    return (
      <div className="stateful-box">
        <h4>Поиск</h4>
        <input
          type="text"
          placeholder="Поиск..."
          value={this.state.query}
          onChange={(e) => this.setState({ query: e.target.value })}
        />
        <button onClick={() => this.setState({ query: "" })}>Очистить</button>
        <ul>
          {filteredItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }
}

class StatefulComponents extends Component {
  render() {
    return (
      <section className="task-section">
        <h2>Компоненты с состоянием</h2>

        <div className="component-demo">
          <h3>Задание 3: Классовые компоненты</h3>
          <div id="stateful-output-1" className="output">
            <Counter initialValue={0} />
            <LoginForm />
            <ColorPicker colors={["#ef4444", "#10b981", "#3b82f6"]} />
          </div>
        </div>

        <div className="component-demo">
          <h3>Задание 4: Обработка событий</h3>
          <div id="stateful-output-2" className="output">
            <TodoList />
            <SearchBox
              items={["React", "JavaScript", "HTML", "CSS", "Node.js"]}
            />
          </div>
        </div>
      </section>
    );
  }
}

export default StatefulComponents;
