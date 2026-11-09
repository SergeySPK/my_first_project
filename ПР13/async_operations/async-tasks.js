// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function displayOutput(elementId, data, isError = false) {
  const output = document.getElementById(elementId);
  if (!output) return;

  const timestamp = new Date().toLocaleTimeString();
  const content =
    typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);

  output.innerHTML = `[${timestamp}] ${content}`;
  output.className = `output ${isError ? "error" : "success"}`;
}

function updateProgress(percentage) {
  const progressFill = document.getElementById("progress-fill");
  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }
}

function setLoadingState(buttonId, isLoading) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = '<span class="spinner"></span> Загрузка...';
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || button.textContent;
  }
}

// ЗАДАНИЕ 1: Основы промисов
function createBasicPromise(shouldResolve = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) resolve("Успех!");
      else reject(new Error("Ошибка!"));
    }, 1000);
  });
}

function handleBasicPromise() {
  console.log("⏳ [ДЕЙСТВИЕ] Запуск базового промиса (ожидание 1 секунду)...");
  displayOutput("promise-output", "Загрузка...");

  return createBasicPromise(true)
    .then((result) => {
      console.log("✅ [РЕЗУЛЬТАТ] Базовый промис успешно завершен.");
      displayOutput("promise-output", `Результат: ${result}`);
      return result;
    })
    .catch((error) => {
      console.error(`❌ [ОШИБКА ПРОМИСА] ${error.message}`);
      displayOutput("promise-output", error.message, true);
      throw error;
    });
}

function createPromiseChain() {
  console.log("⏳ [ДЕЙСТВИЕ] Запуск цепочки из 3 промисов по 0.5с...");
  displayOutput("promise-output", "Запуск цепочки...");

  const step = (prev, n) =>
    delayWithPromise(500).then(() => `${prev} → Шаг ${n} выполнен`);

  return Promise.resolve("Старт")
    .then((prev) => step(prev, 1))
    .then((res1) => {
      console.log(`✅ [ШАГ 1] ${res1}`);
      displayOutput("promise-output", `Шаг 1: ${res1}`);
      return step(res1, 2);
    })
    .then((res2) => {
      console.log(`✅ [ШАГ 2] ${res2}`);
      displayOutput("promise-output", `Шаг 2: ${res2}`);
      return step(res2, 3);
    })
    .then((res3) => {
      console.log(`✅ [ШАГ 3] ${res3}`);
      displayOutput("promise-output", `Шаг 3: ${res3}`);
      return res3;
    })
    .catch((err) => {
      console.error(`❌ [ОШИБКА ЦЕПОЧКИ] ${err.message}`);
      displayOutput("promise-output", err.message, true);
      throw err;
    });
}

function handlePromiseError() {
  console.log("⚠️ [ДЕЙСТВИЕ] Запуск промиса, который завершится ошибкой...");
  displayOutput("promise-output", "Запуск промиса с ошибкой...");

  return createBasicPromise(false)
    .then((res) => displayOutput("promise-output", res))
    .catch((error) => {
      console.error(`❌ [ПЕРЕХВАЧЕНА ОШИБКА] ${error.message}`);
      displayOutput(
        "promise-output",
        `Перехвачена ошибка: ${error.message}`,
        true,
      );
      throw error;
    });
}

function setupPromiseEvents() {
  document
    .getElementById("basic-promise")
    .addEventListener("click", handleBasicPromise);
  document
    .getElementById("promise-chain")
    .addEventListener("click", createPromiseChain);
  document
    .getElementById("promise-error")
    .addEventListener("click", handlePromiseError);
}

// ЗАДАНИЕ 2: Async/Await
async function basicAsyncAwait() {
  console.log("⏳ [ДЕЙСТВИЕ] Запуск базового async/await...");
  displayOutput("async-output", "Загрузка...");

  try {
    const result = await createBasicPromise(true);
    await delayWithPromise(500);
    console.log(`✅ [ASYNC/AWAIT] Получен результат: ${result}`);
    displayOutput("async-output", `Получено: ${result}`);
    return result;
  } catch (error) {
    console.error(`❌ [ОШИБКА ASYNC/AWAIT] ${error.message}`);
    displayOutput("async-output", error.message, true);
    throw error;
  }
}

async function handleAsyncError() {
  console.log("⚠️ [ДЕЙСТВИЕ] Демонстрация обработки ошибки в async/await...");
  try {
    displayOutput("async-output", "Попытка выполнить промис с ошибкой...");
    await createBasicPromise(false);
  } catch (error) {
    console.error(`❌ [TRY/CATCH] Поймана ошибка: ${error.message}`);
    displayOutput(
      "async-output",
      `Поймана ошибка в try/catch: ${error.message}`,
      true,
    );
  }
}

async function parallelAsyncExecution() {
  console.log("⏳ [ДЕЙСТВИЕ] Запуск параллельного выполнения (Promise.all)...");
  const startTime = Date.now();
  displayOutput("async-output", "Запуск параллельных промисов...");

  try {
    const results = await Promise.all([
      createBasicPromise(true),
      createBasicPromise(true),
      createBasicPromise(true),
    ]);
    const endTime = Date.now();
    console.log(
      `✅ [ПАРАЛЛЕЛЬНО] Все промисы выполнены за ${endTime - startTime}мс.`,
    );
    displayOutput(
      "async-output",
      `Все выполнено за ${endTime - startTime}мс.\nРезультаты: ${results.join(", ")}`,
    );
    return results;
  } catch (error) {
    console.error(`❌ [ОШИБКА ПАРАЛЛЕЛЬНОСТИ] ${error.message}`);
    displayOutput("async-output", error.message, true);
    throw error;
  }
}

function setupAsyncEvents() {
  document
    .getElementById("basic-async")
    .addEventListener("click", basicAsyncAwait);
  document
    .getElementById("async-error")
    .addEventListener("click", handleAsyncError);
  document
    .getElementById("async-parallel")
    .addEventListener("click", parallelAsyncExecution);
}

// ЗАДАНИЕ 3: Работа с API
async function fetchUsers() {
  console.log("🌐 [API] Запрос списка пользователей с JSONPlaceholder...");
  const btnId = "fetch-users";
  setLoadingState(btnId, true);
  const container = document.getElementById("api-data");
  container.innerHTML = "Загрузка данных...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);
    const users = await response.json();

    console.log(`✅ [API] Успешно загружено ${users.length} пользователей.`);
    displayOutput(
      "api-output",
      `Успешно загружено ${users.length} пользователей.`,
    );

    container.innerHTML = "";
    users.forEach((user) => {
      const card = document.createElement("div");
      card.className = "user-card";
      card.innerHTML = `<strong>${user.name}</strong><br>Email: ${user.email}<br>Город: ${user.address.city}`;
      container.appendChild(card);
    });
    return users;
  } catch (error) {
    console.error(
      `❌ [API ОШИБКА] Не удалось загрузить пользователей: ${error.message}`,
    );
    displayOutput("api-output", `Ошибка загрузки: ${error.message}`, true);
    container.innerHTML =
      '<span style="color: red;">Не удалось загрузить данные</span>';
    throw error;
  } finally {
    setLoadingState(btnId, false);
  }
}

async function createPost() {
  console.log("🌐 [API] Отправка POST-запроса (создание поста)...");
  const btnId = "fetch-post";
  setLoadingState(btnId, true);
  displayOutput("api-output", "Отправка POST запроса...");

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        title: "Мой новый пост",
        body: "Это текст поста, созданный через API.",
        userId: 1,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);
    const data = await response.json();

    console.log(`✅ [API] Пост успешно создан с ID: ${data.id}`);
    displayOutput(
      "api-output",
      `Пост создан с ID: ${data.id}\nЗаголовок: ${data.title}`,
    );
    return data;
  } catch (error) {
    console.error(`❌ [API ОШИБКА] Не удалось создать пост: ${error.message}`);
    displayOutput("api-output", `Ошибка: ${error.message}`, true);
    throw error;
  } finally {
    setLoadingState(btnId, false);
  }
}

async function testApiError() {
  console.log("🌐 [API] Тестирование ошибки (запрос к несуществующему URL)...");
  displayOutput("api-output", "Запрос к несуществующему URL...");

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/invalid-url-404",
    );
    if (!response.ok) {
      throw new Error(
        `Сервер вернул ошибку: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error(
      `❌ [API ТЕСТ] Ожидаемая ошибка перехвачена: ${error.message}`,
    );
    displayOutput("api-output", `Перехвачена ошибка: ${error.message}`, true);
  }
}

function setupApiEvents() {
  document.getElementById("fetch-users").addEventListener("click", fetchUsers);
  document.getElementById("fetch-post").addEventListener("click", createPost);
  document
    .getElementById("fetch-error")
    .addEventListener("click", testApiError);
}

// ЗАДАНИЕ 4: Асинхронные таймеры
let intervalId = null;
let intervalCounter = 0;

function startAsyncInterval() {
  if (intervalId) {
    console.warn("⚠️ [ТАЙМЕР] Интервал уже запущен!");
    return;
  }
  console.log("⏱️ [ТАЙМЕР] Запуск интервала (счет с нуля)...");

  intervalCounter = 0;
  document.getElementById("interval-output").textContent =
    `Интервал: ${intervalCounter}с`;

  intervalId = setInterval(() => {
    intervalCounter++;
    document.getElementById("interval-output").textContent =
      `Интервал: ${intervalCounter}с`;
  }, 1000);
}

function stopAsyncInterval() {
  if (!intervalId) {
    console.warn("⚠️ [ТАЙМЕР] Интервал уже остановлен.");
    return;
  }

  clearInterval(intervalId);
  intervalId = null;
  console.log(`⏸️ [ТАЙМЕР] Интервал остановлен. Счетчик сброшен.`);

  intervalCounter = 0;
  document.getElementById("interval-output").textContent =
    `Интервал: ${intervalCounter}с (Остановлен, счетчик сброшен)`;
}

function delayWithPromise(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testDelay() {
  console.log("⏱️ [ТАЙМЕР] Запуск теста задержки (2 секунды)...");
  displayOutput("timer-output", "Начало теста задержки...");

  await delayWithPromise(1000);
  console.log("⏱️ [ТАЙМЕР] Прошла 1 секунда...");
  displayOutput("timer-output", "Прошло 1 секунда...");

  await delayWithPromise(1000);
  console.log("⏱️ [ТАЙМЕР] Прошло 2 секунды. Тест завершен.");
  displayOutput("timer-output", "Прошло 2 секунды. Завершено!");
}

function setupTimerEvents() {
  document
    .getElementById("start-interval")
    .addEventListener("click", startAsyncInterval);
  document
    .getElementById("stop-interval")
    .addEventListener("click", stopAsyncInterval);
  document.getElementById("delay-promise").addEventListener("click", testDelay);
}

// ЗАДАНИЕ 5: Обработка ошибок
async function asyncTryCatch() {
  console.log("🛡️ [ОШИБКИ] Запуск демонстрации вложенных try/catch...");
  displayOutput("error-output", "Запуск вложенных try/catch...");

  try {
    try {
      throw new Error("Внутренняя ошибка");
    } catch (inner) {
      console.warn(`⚠️ [ОШИБКИ] Поймана внутренняя ошибка: ${inner.message}`);
      displayOutput(
        "error-output",
        `Поймана внутренняя ошибка: ${inner.message}`,
        true,
      );
      throw new Error("Ошибка проброшена наружу");
    }
  } catch (outer) {
    console.error(`❌ [ОШИБКИ] Поймана внешняя ошибка: ${outer.message}`);
    displayOutput(
      "error-output",
      `Поймана внешняя ошибка: ${outer.message}`,
      true,
    );
  }
}

async function handleMultipleErrors() {
  console.log(
    "🛡️ [ОШИБКИ] Запуск Promise.allSettled (анализ успехов и ошибок)...",
  );
  displayOutput("error-output", "Запуск Promise.allSettled...");

  const promises = [
    Promise.resolve("Успех 1"),
    Promise.reject(new Error("Ошибка 1")),
    Promise.resolve("Успех 2"),
    Promise.reject(new Error("Ошибка 2")),
  ];

  const results = await Promise.allSettled(promises);
  let successCount = 0;
  let failCount = 0;

  results.forEach((result) => {
    if (result.status === "fulfilled") successCount++;
    else failCount++;
  });

  console.log(
    `✅ [ОШИБКИ] allSettled завершен. Успешно: ${successCount}, Ошибок: ${failCount}`,
  );
  displayOutput(
    "error-output",
    `Завершено. Успешно: ${successCount}, Ошибок: ${failCount}`,
  );
  return results;
}

async function retryWithBackoff(operation, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(
        `⚠️ [RETRY] Попытка ${attempt} не удалась. Ждем ${delay}мс...`,
      );
      displayOutput(
        "error-output",
        `Попытка ${attempt} не удалась. Ждем ${delay}мс...`,
        true,
      );
      await delayWithPromise(delay);
    }
  }
}

async function testRetry() {
  console.log("🔄 [ОШИБКИ] Запуск Retry Pattern (повторные попытки)...");
  let attempts = 0;
  const unstableOperation = async () => {
    attempts++;
    if (attempts < 3) throw new Error("Временная ошибка сети");
    return "Данные успешно получены!";
  };

  displayOutput("error-output", "Запуск Retry Pattern...");
  try {
    const result = await retryWithBackoff(unstableOperation, 3);
    console.log(`✅ [RETRY] Успех после ${attempts} попыток: ${result}`);
    displayOutput("error-output", `Успех после нескольких попыток: ${result}`);
    return result;
  } catch (error) {
    console.error(`❌ [RETRY] Все попытки провалились: ${error.message}`);
    displayOutput(
      "error-output",
      `Все попытки провалились: ${error.message}`,
      true,
    );
    throw error;
  }
}

function setupErrorEvents() {
  document.getElementById("try-catch").addEventListener("click", asyncTryCatch);
  document
    .getElementById("multiple-errors")
    .addEventListener("click", handleMultipleErrors);
  document.getElementById("retry-pattern").addEventListener("click", testRetry);
}

// ЗАДАНИЕ 6: Параллельные операции
async function demonstratePromiseAll() {
  console.log(
    "⚡ [ПАРАЛЛЕЛЬНО] Запуск Promise.all (5 промисов разной длительности)...",
  );
  displayOutput("parallel-output", "Запуск Promise.all...");
  const start = Date.now();

  const p1 = delayWithPromise(200).then(() => "200мс");
  const p2 = delayWithPromise(400).then(() => "400мс");
  const p3 = delayWithPromise(600).then(() => "600мс");
  const p4 = delayWithPromise(800).then(() => "800мс");
  const p5 = delayWithPromise(1000).then(() => "1000мс");

  const results = await Promise.all([p1, p2, p3, p4, p5]);
  const end = Date.now();

  console.log(
    `✅ [ПАРАЛЛЕЛЬНО] Promise.all завершен за ${end - start}мс. Результаты: ${results.join(", ")}`,
  );
  displayOutput(
    "parallel-output",
    `Promise.all завершен за ${end - start}мс.\nРезультаты: ${results.join(", ")}`,
  );
  return results;
}

async function demonstratePromiseRace() {
  console.log("⚡ [ПАРАЛЛЕЛЬНО] Запуск Promise.race (0.3с и 1.2с)...");
  displayOutput("parallel-output", "Запуск Promise.race...");

  const fast = delayWithPromise(300).then(() => "Быстрый промис (0.3с)");
  const slow = delayWithPromise(1200).then(() => "Медленный промис (1.2с)");

  const result = await Promise.race([fast, slow]);
  console.log(`✅ [ПАРАЛЛЕЛЬНО] Promise.race победитель: ${result}`);
  displayOutput("parallel-output", `Promise.race победитель: ${result}`);
  return result;
}

async function demonstratePromiseAllSettled() {
  console.log("⚡ [ПАРАЛЛЕЛЬНО] Запуск Promise.allSettled (успех + ошибка)...");
  displayOutput("parallel-output", "Запуск Promise.allSettled...");

  const p1 = Promise.resolve("Успешно");
  const p2 = Promise.reject(new Error("Сбой"));

  const results = await Promise.allSettled([p1, p2]);
  let outputStr = "";

  results.forEach((r) => {
    if (r.status === "fulfilled") outputStr += `[Fulfilled]: ${r.value}\n`;
    else outputStr += `[Rejected]: ${r.reason.message}\n`;
  });

  console.log("✅ [ПАРАЛЛЕЛЬНО] allSettled обработал все результаты.");
  displayOutput("parallel-output", outputStr);
  return results;
}

function setupParallelEvents() {
  document
    .getElementById("promise-all")
    .addEventListener("click", demonstratePromiseAll);
  document
    .getElementById("promise-race")
    .addEventListener("click", demonstratePromiseRace);
  document
    .getElementById("promise-allSettled")
    .addEventListener("click", demonstratePromiseAllSettled);
}

// ЗАДАНИЕ 7: Реальные сценарии
async function sequentialApiRequests() {
  console.log("🌐 [СЦЕНАРИЙ] Запуск последовательных запросов к API...");
  displayOutput("scenario-output", "Запуск последовательных запросов...");

  try {
    const userRes = await fetch("https://jsonplaceholder.typicode.com/users/1");
    if (!userRes.ok) throw new Error(`HTTP ошибка: ${userRes.status}`);
    const user = await userRes.json();
    console.log(`✅ [СЦЕНАРИЙ] 1. Пользователь: ${user.name}`);
    displayOutput("scenario-output", `1. Получен пользователь: ${user.name}`);

    const postsRes = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`,
    );
    if (!postsRes.ok) throw new Error(`HTTP ошибка: ${postsRes.status}`);
    const posts = await postsRes.json();
    console.log(`✅ [СЦЕНАРИЙ] 2. Постов найдено: ${posts.length}`);
    displayOutput("scenario-output", `2. Получено постов: ${posts.length}`);

    if (posts.length > 0) {
      const commentsRes = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${posts[0].id}/comments`,
      );
      if (!commentsRes.ok)
        throw new Error(`HTTP ошибка: ${commentsRes.status}`);
      const comments = await commentsRes.json();
      console.log(
        `✅ [СЦЕНАРИЙ] 3. Комментариев: ${comments.length}. Цепочка завершена.`,
      );
      displayOutput(
        "scenario-output",
        `3. Получено комментариев к посту 1: ${comments.length}\nЦепочка завершена успешно!`,
      );
      return { user, posts, comments };
    }
    return { user, posts };
  } catch (error) {
    console.error(`❌ [СЦЕНАРИЙ] Ошибка: ${error.message}`);
    displayOutput("scenario-output", `Ошибка: ${error.message}`, true);
    throw error;
  }
}

async function simulateFileUpload() {
  console.log("📤 [СЦЕНАРИЙ] Симуляция загрузки файла (прогресс-бар)...");
  displayOutput("scenario-output", "Симуляция загрузки файла...");
  updateProgress(0);

  try {
    for (let i = 0; i <= 100; i += 10) {
      updateProgress(i);
      await delayWithPromise(100);
    }
    console.log("✅ [СЦЕНАРИЙ] Файл успешно загружен.");
    displayOutput("scenario-output", "Файл успешно загружен (100%)");
  } catch (error) {
    displayOutput("scenario-output", `Ошибка загрузки: ${error.message}`, true);
  }
}

function createRequestCache() {
  const cache = new Map();
  return async function cachedRequest(url) {
    if (cache.has(url)) {
      console.log(`💾 [КЭШ] Данные для ${url} взяты из кэша.`);
      displayOutput(
        "scenario-output",
        `[КЭШ] Данные для ${url} взяты из кэша.`,
      );
      return cache.get(url);
    }

    console.log(`🌐 [КЭШ] Выполняется сетевой запрос к ${url}...`);
    displayOutput("scenario-output", `[СЕТЬ] Выполняется запрос к ${url}...`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);
    const data = await response.json();
    cache.set(url, data);
    return data;
  };
}

async function testCache() {
  console.log("💾 [СЦЕНАРИЙ] Тестирование кэширования запросов...");
  const getCachedData = createRequestCache();
  const testUrl = "https://jsonplaceholder.typicode.com/todos/1";

  displayOutput("scenario-output", "Первый запрос (должен пойти в сеть)...");
  const res1 = await getCachedData(testUrl);

  displayOutput("scenario-output", "Второй запрос (должен взяться из кэша)...");
  const res2 = await getCachedData(testUrl);

  console.log(`✅ [КЭШ] Тест завершен. Данные: "${res1.title}"`);
  displayOutput("scenario-output", `Готово! Данные: "${res1.title}"`);
  return { res1, res2 };
}

function setupRealScenarioEvents() {
  document
    .getElementById("sequential-requests")
    .addEventListener("click", sequentialApiRequests);
  document
    .getElementById("upload-simulation")
    .addEventListener("click", simulateFileUpload);
  document
    .getElementById("cache-requests")
    .addEventListener("click", testCache);
}

// ИНИЦИАЛИЗАЦИЯ И ЛОГИРОВАНИЕ КЛИКОВ
function initializeAsyncOperations() {
  setupPromiseEvents();
  setupAsyncEvents();
  setupApiEvents();
  setupTimerEvents();
  setupErrorEvents();
  setupParallelEvents();
  setupRealScenarioEvents();

  document.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (button) {
      let btnText = button.textContent.trim();
      if (button.innerHTML.includes("spinner")) {
        btnText = button.dataset.originalText || "Загрузка...";
      }

      console.log(
        `%c[КЛИК]%c Нажата кнопка: "${btnText}" (ID: ${button.id || "без ID"})`,
        "color: #10b981; font-weight: bold;",
        "color: #374151;",
      );
    }
  });

  console.log("✅ Все асинхронные обработчики инициализированы!");
}

document.addEventListener("DOMContentLoaded", initializeAsyncOperations);
