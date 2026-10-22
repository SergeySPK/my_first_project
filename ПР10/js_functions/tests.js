// Вспомогательная функция для форматирования значений
function formatValue(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

// Вывод одного результата теста в DOM и консоль
function appendResult(testName, actual, expected, isEqual, errorMessage = "") {
  const resultElement = document.createElement("div");
  resultElement.className = `test-result ${isEqual ? "success" : "error"}`;

  let details = `
    Ожидалось: ${formatValue(expected)}<br>
    Получено: ${formatValue(actual)}
  `;

  if (errorMessage) {
    details += `<br>Ошибка: ${errorMessage}`;
  }

  resultElement.innerHTML = `
    <strong>${testName}</strong> - ${isEqual ? "✅ УСПЕХ" : "❌ ОШИБКА"}
    <div class="test-details">${details}</div>
  `;

  document.getElementById("testResults").appendChild(resultElement);

  console.log(`${testName}:`, isEqual ? "✅ УСПЕХ" : "❌ ОШИБКА", {
    expected,
    actual,
    errorMessage,
  });
}

// Сравнение значений
function isEqualValue(actual, expected) {
  if (typeof actual === "object" && actual !== null) {
    return JSON.stringify(actual) === JSON.stringify(expected);
  }

  return actual === expected;
}

// Обычный синхронный тест
function runTest(testName, actual, expected) {
  const isEqual = isEqualValue(actual, expected);
  appendResult(testName, actual, expected, isEqual);
}

// Тест, который ожидает исключение
function runTestThrows(testName, fn, expectedMessagePart) {
  try {
    const actual = fn();
    appendResult(
      testName,
      actual,
      `исключение с текстом "${expectedMessagePart}"`,
      false,
    );
  } catch (error) {
    const isEqual = String(error.message).includes(expectedMessagePart);
    appendResult(
      testName,
      error.message,
      `исключение с текстом "${expectedMessagePart}"`,
      isEqual,
    );
  }
}

// Асинхронный тест
async function runAsyncTest(testName, asyncFn, expected) {
  try {
    const actual = await asyncFn();
    const isEqual = isEqualValue(actual, expected);
    appendResult(testName, actual, expected, isEqual);
  } catch (error) {
    appendResult(testName, error, expected, false, error.message);
  }
}

// Запуск всех тестов
async function runAllTests() {
  console.log("=== ЗАПУСК ТЕСТОВ ПР10 ===");

  // Тесты для Части 2
  runTest("sum(1, 2, 3, 4)", sum(1, 2, 3, 4), 10);
  runTest("sum()", sum(), 0); // Краевой случай: пустые аргументы

  runTest(
    'createUser({name: "Ivan", age: 25})',
    createUser({ name: "Ivan", age: 25 }),
    "Пользователь: Ivan, возраст: 25, email: не указан",
  );

  runTest(
    'createUser({name: "Anna", age: 30, email: "a@test.ru"})',
    createUser({ name: "Anna", age: 30, email: "a@test.ru" }),
    "Пользователь: Anna, возраст: 30, email: a@test.ru",
  );

  const checkSecret = secretMessage("qwerty", "Секретные данные");

  runTest(
    "secretMessage(верный пароль)",
    checkSecret("qwerty"),
    "Секретные данные",
  );

  runTest(
    "secretMessage(неверный пароль)",
    checkSecret("12345"),
    "Доступ запрещен",
  );

  // Тесты для Части 3
  runTest("factorial(0)", factorial(0), 1);
  runTest("factorial(1)", factorial(1), 1);
  runTest("factorial(5)", factorial(5), 120);
  runTestThrows(
    "factorial(-1) - должно быть исключение",
    () => factorial(-1),
    "целых неотрицательных",
  );

  const addOne = (x) => x + 1;
  const double = (x) => x * 2;

  // double(addOne(5)) = double(6) = 12
  runTest("compose(double, addOne)(5)", compose(double, addOne)(5), 12);

  runTest(
    "myMap([1, 2, 3], x => x * 2)",
    myMap([1, 2, 3], (x) => x * 2),
    [2, 4, 6],
  );

  runTest(
    "myMap([], x => x)",
    myMap([], (x) => x),
    [],
  ); // Краевой случай

  runTest(
    "myFilter([1, 2, 3, 4], x => x % 2 === 0)",
    myFilter([1, 2, 3, 4], (x) => x % 2 === 0),
    [2, 4],
  );

  runTest(
    "myReduce([1, 2, 3], (a, b) => a + b)",
    myReduce([1, 2, 3], (a, b) => a + b),
    6,
  );

  runTest(
    "myReduce([1, 2, 3], (a, b) => a + b, 10)",
    myReduce([1, 2, 3], (a, b) => a + b, 10),
    16,
  );

  // Тесты для Части 4
  const addThree = (a, b, c) => a + b + c;
  const curriedAdd = curry(addThree);

  runTest("curry(addThree)(1)(2)(3)", curriedAdd(1)(2)(3), 6);
  runTest("curry(addThree)(1, 2)(3)", curriedAdd(1, 2)(3), 6);

  // Тест мемоизации
  let callCount = 0;

  const slowFunc = (n) => {
    callCount++;
    return n * 2;
  };

  const fastFunc = memoize(slowFunc);

  fastFunc(5); // Первый вызов
  fastFunc(5); // Второй вызов (должен взять из кэша)

  runTest("memoize (количество вызовов)", callCount, 1);

  // Тест валидатора
  const passValidator = createValidator({
    minLength: 5,
    hasDigit: true,
    hasUppercase: true,
  });

  runTest("createValidator (корректный)", passValidator("Hello123"), true);
  runTest("createValidator (нет цифры)", passValidator("Hello"), false);
  runTest("createValidator (короткий)", passValidator("H1"), false);

  // Проверка debounce/throttle на то, что это функции
  runTest("typeof debounce", typeof debounce(() => {}, 100), "function");
  runTest("typeof throttle", typeof throttle(() => {}, 100), "function");

  // Асинхронная проверка debounce:
  // три быстрых вызова должны дать только один фактический вызов
  await runAsyncTest(
    "debounce (3 быстрых вызова → 1)",
    async () => {
      let calls = 0;

      const debounced = debounce(() => {
        calls++;
      }, 30);

      debounced();
      debounced();
      debounced();

      await new Promise((resolve) => setTimeout(resolve, 60));

      return calls;
    },
    1,
  );

  // Асинхронная проверка throttle:
  // первый вызов выполняется сразу, второй игнорируется, после интервала третий вызов снова выполняется
  await runAsyncTest(
    "throttle (2 вызова с интервалом → 2)",
    async () => {
      let calls = 0;

      const throttled = throttle(() => {
        calls++;
      }, 30);

      throttled(); // выполнится
      throttled(); // будет проигнорирован

      await new Promise((resolve) => setTimeout(resolve, 60));

      throttled(); // снова выполнится

      return calls;
    },
    2,
  );

  console.log("=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===");
}

document.addEventListener("DOMContentLoaded", () => {
  runAllTests();
});
