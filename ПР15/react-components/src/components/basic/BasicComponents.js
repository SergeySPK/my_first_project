import React, { useState } from "react";
import "./BasicComponents.css";

// 1.1. Компонент приветствия
function WelcomeMessage({ name, age }) {
  return (
    <div className="welcome-msg">
      Привет, {name}! Тебе {age} лет.
    </div>
  );
}

// 1.2. Карточка пользователя
function UserCard({ user }) {
  return (
    <div className="user-card">
      <img
        src={user.avatar}
        alt={user.name}
        style={{ borderRadius: "50%", width: "60px" }}
      />
      <div>
        <h4>
          {user.name} {user.isOnline ? "🟢" : "⚪"}
        </h4>
        <p>{user.email}</p>
      </div>
    </div>
  );
}

// 1.3. Кастомная кнопка
function Button({ variant = "primary", size = "medium", onClick, children }) {
  return (
    <button className={`btn-${variant} btn-${size}`} onClick={onClick}>
      {children}
    </button>
  );
}

// 2.1. Карточка с children
function Card({ title, children }) {
  return (
    <div className="custom-card">
      <h4>{title}</h4>
      <div className="card-content">{children}</div>
    </div>
  );
}

// 2.2. Переключатель видимости
function Toggle({ buttonText, children }) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>{buttonText}</button>
      {isVisible && (
        <div
          style={{ marginTop: "10px", padding: "10px", background: "#e0f2fe" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// 2.3. Условное сообщение
function ConditionalMessage({ status }) {
  const colors = {
    success: { bg: "#dcfce7", color: "#166534", text: "Успешно выполнено!" },
    error: { bg: "#fee2e2", color: "#991b1b", text: "Произошла ошибка!" },
    warning: {
      bg: "#fef3c7",
      color: "#92400e",
      text: "Внимание! Есть предупреждение.",
    },
  };
  const current = colors[status] || colors.warning;

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: current.bg,
        color: current.color,
        borderRadius: "5px",
      }}
    >
      {current.text}
    </div>
  );
}

function BasicComponents() {
  const userData = {
    name: "Анна Иванова",
    email: "anna@example.com",
    avatar: "https://i.pravatar.cc/100",
    isOnline: true,
  };

  return (
    <section className="task-section">
      <h2>Базовые компоненты</h2>

      <div className="component-demo">
        <h3>Задание 1: Компоненты с props</h3>
        <div id="basic-output-1" className="output">
          <WelcomeMessage name="Иван" age={25} />
          <UserCard user={userData} />
          <Button variant="primary" onClick={() => alert("Клик!")}>
            Нажми меня
          </Button>
        </div>
      </div>

      <div className="component-demo">
        <h3>Задание 2: Children и условный рендеринг</h3>
        <div id="basic-output-2" className="output">
          <Card title="Пример карточки">
            <p>Это содержимое карточки, переданное через children.</p>
          </Card>

          <Toggle buttonText="Показать/скрыть секрет">
            <p>Секретный контент!</p>
          </Toggle>

          <ConditionalMessage status="success" />
        </div>
      </div>
    </section>
  );
}

export default BasicComponents;
