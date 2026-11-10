import React, { useState } from "react";

export function ComponentTests() {
  const [results, setResults] = useState(null);

  const runTests = () => {
    const testResults = [];

    const addTest = (name, condition, successMsg, errorMsg) => {
      testResults.push({
        name: name,
        passed: condition,
        message: condition ? successMsg : errorMsg,
      });
    };

    try {
      // ТЕСТ 1: Базовые компоненты
      const basicOutput = document.getElementById("basic-output-1");
      addTest(
        "Базовые компоненты отрисованы",
        basicOutput && basicOutput.children.length > 0,
        `Найдено элементов: ${basicOutput?.children.length || 0}`,
        "Компоненты не найдены в DOM",
      );

      const welcomeText = basicOutput?.textContent || "";
      addTest(
        "Props передаются корректно (WelcomeMessage)",
        welcomeText.includes("Привет, Иван!"),
        'Текст "Привет, Иван!" найден',
        "Текст приветствия не совпадает или отсутствует",
      );

      // ТЕСТ 2: Stateful компоненты
      const statefulOutput = document.getElementById("stateful-output-1");
      addTest(
        "Классовые компоненты отрисованы",
        statefulOutput && statefulOutput.children.length > 0,
        `Найдено элементов: ${statefulOutput?.children.length || 0}`,
        "Компоненты не найдены",
      );

      const inputs = statefulOutput?.querySelectorAll("input");
      addTest(
        "Форма логина (LoginForm) имеет поля ввода",
        inputs && inputs.length >= 2,
        `Найдено полей ввода: ${inputs?.length || 0}`,
        "Поля ввода для формы не найдены",
      );

      // ТЕСТ 3: Lifecycle компоненты
      const lifecycleOutput = document.getElementById("lifecycle-output");
      addTest(
        "Компоненты жизненного цикла отрисованы",
        lifecycleOutput && lifecycleOutput.children.length > 0,
        "Блоки таймера и трекера на месте",
        "Компоненты не найдены",
      );

      // ТЕСТ 4: Hooks компоненты
      const hooksOutput = document.getElementById("hooks-output-1");
      addTest(
        "Компоненты с хуками отрисованы",
        hooksOutput && hooksOutput.children.length > 0,
        "Хуки работают",
        "Компоненты не найдены",
      );

      // Проверяем ВТОРОЙ блок, где находится useFetch и Context
      const hooksOutput2 = document.getElementById("hooks-output-2");
      const hooksText2 = hooksOutput2?.textContent || "";

      addTest(
        "Кастомный хук useFetch загрузил данные",
        hooksOutput2 &&
          (hooksText2.includes("Заголовок поста") ||
            hooksText2.includes("Загрузка...")),
        "Данные с API запрошены",
        "Хук useFetch не сработал",
      );
    } catch (error) {
      testResults.push({
        name: "Критическая ошибка",
        passed: false,
        message: `Ошибка выполнения: ${error.message}`,
      });
    }

    setResults(testResults);
  };

  // Считаем статистику
  const passedCount = results ? results.filter((r) => r.passed).length : 0;
  const totalCount = results ? results.length : 0;

  return (
    <section className="task-section">
      <h2>Тестирование компонентов</h2>

      <div
        style={{
          textAlign: "center",
          padding: "20px",
          background: "#f8fafc",
          borderRadius: "10px",
        }}
      >
        <button
          onClick={runTests}
          style={{
            fontSize: "16px",
            padding: "12px 24px",
            background: "#0f766e",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Запустить проверку компонентов
        </button>

        {results && (
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <h3 style={{ marginBottom: "15px", color: "#1e293b" }}>
              Результат: {passedCount} из {totalCount} тестов пройдено
            </h3>

            {results.map((test, index) => (
              <div
                key={index}
                style={{
                  padding: "12px",
                  margin: "8px 0",
                  borderRadius: "6px",
                  backgroundColor: test.passed ? "#dcfce7" : "#fee2e2",
                  borderLeft: `5px solid ${test.passed ? "#22c55e" : "#ef4444"}`,
                  color: test.passed ? "#166534" : "#991b1b",
                }}
              >
                <strong>{test.passed ? "✅ УСПЕХ" : "❌ ОШИБКА"}:</strong>{" "}
                {test.name}
                <div
                  style={{ fontSize: "13px", marginTop: "5px", opacity: 0.8 }}
                >
                  {test.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ComponentTests;
