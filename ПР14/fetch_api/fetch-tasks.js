// Базовый URL для JSONPlaceholder API
const API_BASE_URL = "https://jsonplaceholder.typicode.com";

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function displayOutput(elementId, data, isError = false) {
  const output = document.getElementById(elementId);
  if (!output) return;
  const timestamp = new Date().toLocaleTimeString();
  let content;

  if (data instanceof Error) {
    content = `Ошибка: ${data.message}`;
  } else if (typeof data === "object" && data !== null) {
    content = JSON.stringify(data, null, 2);
  } else {
    content = String(data);
  }

  output.textContent = `[${timestamp}] ${content}`;
  output.className = `output ${isError ? "error" : "success"}`;
}

function displayData(elementId, data) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = "";
  if (Array.isArray(data)) {
    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "user-card";
      card.innerHTML = `
                <h4>${item.name || item.title || "Без названия"}</h4>
                <p>Email: ${item.email || "Нет"}</p>
                <p>Телефон: ${item.phone || "Нет"}</p>
                <p>${item.body || item.description || ""}</p>
            `;
      container.appendChild(card);
    });
  } else if (typeof data === "object" && data !== null) {
    container.innerHTML = `<div class="user-card"><pre>${JSON.stringify(data, null, 2)}</pre></div>`;
  } else {
    container.innerHTML = `<p>${String(data)}</p>`;
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

// ЗАДАНИЕ 1: Базовые GET запросы
async function fetchGetRequest() {
  setLoadingState("fetch-get", true);
  displayOutput("get-output", "Загрузка...");

  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`);
    if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);

    const data = await response.json();
    displayOutput("get-output", `Пост #1: ${data.title}\n\n${data.body}`);
  } catch (error) {
    displayOutput("get-output", error, true);
  } finally {
    setLoadingState("fetch-get", false);
  }
}

async function fetchJsonData() {
  setLoadingState("fetch-json", true);
  displayOutput("get-output", "Загрузка пользователей...");

  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);

    const users = await response.json();
    displayOutput(
      "get-output",
      `Успешно загружено ${users.length} пользователей.`,
    );
    displayData("get-data", users);
  } catch (error) {
    displayOutput("get-output", error, true);
  } finally {
    setLoadingState("fetch-json", false);
  }
}

async function fetchWithError() {
  displayOutput("get-output", "Попытка запроса к несуществующему URL...");

  try {
    const response = await fetch(`${API_BASE_URL}/invalid-url-404`);
    if (!response.ok) {
      throw new Error(
        `Сервер вернул статус ${response.status} (${response.statusText})`,
      );
    }
  } catch (error) {
    displayOutput("get-output", error, true);
  }
}

function setupGetRequests() {
  document
    .getElementById("fetch-get")
    .addEventListener("click", fetchGetRequest);
  document
    .getElementById("fetch-json")
    .addEventListener("click", fetchJsonData);
  document
    .getElementById("fetch-error")
    .addEventListener("click", fetchWithError);
}

// ЗАДАНИЕ 2: POST, PUT, PATCH, DELETE
async function fetchPostRequest() {
  setLoadingState("fetch-post", true);

  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        title: "Новый пост от студента",
        body: "Этот пост был создан с помощью Fetch API.",
        userId: 1,
      }),
    });
    if (!response.ok)
      throw new Error(`HTTP ${response.status} ${response.statusText}`);

    const data = await response.json();
    displayOutput(
      "crud-output",
      `Создан пост с ID: ${data.id}\nЗаголовок: ${data.title}`,
    );
  } catch (error) {
    displayOutput("crud-output", error, true);
  } finally {
    setLoadingState("fetch-post", false);
  }
}

async function fetchPutRequest() {
  setLoadingState("fetch-put", true);

  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        id: 1,
        title: "Обновленный заголовок (PUT)",
        body: "Полностью новый текст поста.",
        userId: 1,
      }),
    });
    if (!response.ok)
      throw new Error(`HTTP ${response.status} ${response.statusText}`);

    const data = await response.json();
    displayOutput(
      "crud-output",
      `Пост обновлен (PUT).\nНовый заголовок: ${data.title}`,
    );
  } catch (error) {
    displayOutput("crud-output", error, true);
  } finally {
    setLoadingState("fetch-put", false);
  }
}

async function fetchPatchRequest() {
  setLoadingState("fetch-patch", true);

  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ title: "Частично обновленный заголовок (PATCH)" }),
    });
    if (!response.ok)
      throw new Error(`HTTP ${response.status} ${response.statusText}`);

    const data = await response.json();
    displayOutput(
      "crud-output",
      `Заголовок обновлен (PATCH).\nНовый заголовок: ${data.title}`,
    );
  } catch (error) {
    displayOutput("crud-output", error, true);
  } finally {
    setLoadingState("fetch-patch", false);
  }
}

async function fetchDeleteRequest() {
  setLoadingState("fetch-delete", true);

  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      method: "DELETE",
    });
    if (!response.ok)
      throw new Error(`Не удалось удалить. Статус: ${response.status}`);

    displayOutput("crud-output", "Пост с ID 1 успешно удален (статус 200 OK).");
  } catch (error) {
    displayOutput("crud-output", error, true);
  } finally {
    setLoadingState("fetch-delete", false);
  }
}

function setupCrudRequests() {
  document
    .getElementById("fetch-post")
    .addEventListener("click", fetchPostRequest);
  document
    .getElementById("fetch-put")
    .addEventListener("click", fetchPutRequest);
  document
    .getElementById("fetch-patch")
    .addEventListener("click", fetchPatchRequest);
  document
    .getElementById("fetch-delete")
    .addEventListener("click", fetchDeleteRequest);
}

// ЗАДАНИЕ 3: Заголовки и параметры
async function fetchWithHeaders() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      headers: {
        "X-Custom-Header": "MyValue",
        Authorization: "Bearer my-secret-token",
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    displayOutput(
      "headers-output",
      "Запрос выполнен.\nОтправлены заголовки:\nX-Custom-Header: MyValue\nAuthorization: Bearer my-secret-token",
    );
  } catch (error) {
    displayOutput("headers-output", error, true);
  }
}

async function fetchWithAuth() {
  const results = [];

  // 1. Basic Auth - верные данные
  try {
    const res = await fetch("https://httpbin.org/basic-auth/user/pass", {
      headers: { Authorization: `Basic ${btoa("user:pass")}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    results.push("✅ Basic Auth (верные данные): 200 OK");
  } catch (e) {
    results.push(`❌ Basic Auth (верные данные): ${e.message}`);
  }

  // 2. Basic Auth - неверные данные
  try {
    const res = await fetch("https://httpbin.org/basic-auth/user/pass", {
      headers: { Authorization: `Basic ${btoa("wrong:creds")}` },
    });
    if (!res.ok)
      throw new Error(`Сервер отклонил: ${res.status} ${res.statusText}`);
    results.push("⚠️ Basic Auth (неверные данные): неожиданно принят");
  } catch (e) {
    results.push(`❌ Basic Auth (неверные данные): ${e.message}`);
  }

  // 3. Bearer token
  try {
    const res = await fetch(`${API_BASE_URL}/users/1`, {
      headers: { Authorization: "Bearer fake-jwt-token-12345" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    results.push(`✅ Bearer token: успех (${data.name})`);
  } catch (e) {
    results.push(`❌ Bearer token: ${e.message}`);
  }

  displayOutput("headers-output", results.join("\n"));
}

async function fetchWithParams() {
  try {
    const url = new URL(`${API_BASE_URL}/posts`);
    url.searchParams.append("_limit", "5");
    url.searchParams.append("_sort", "id");
    url.searchParams.append("_order", "desc");

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    displayOutput(
      "headers-output",
      `Получено постов: ${data.length}.\nID: ${data.map((p) => p.id).join(", ")}`,
    );
  } catch (error) {
    displayOutput("headers-output", error, true);
  }
}

async function fetchWithTimeout(timeoutMs = 3000) {
  const ms = Number.isFinite(timeoutMs) ? timeoutMs : 3000;
  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort("timeout");
  }, ms);

  try {
    const response = await fetch("https://httpbin.org/delay/10", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    displayOutput(
      "headers-output",
      "Запрос успел выполниться (таймаут не сработал).",
    );
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      if (timedOut || controller.signal.reason === "timeout") {
        displayOutput(
          "headers-output",
          "❌ ТАЙМАУТ: сервер не ответил вовремя (автоматическая отмена)",
          true,
        );
      } else {
        displayOutput(
          "headers-output",
          "⚠️ Ручная отмена: controller.abort() без указания причины",
          true,
        );
      }
    } else {
      displayOutput("headers-output", error, true);
    }
  }
}

function setupHeadersAndParams() {
  document
    .getElementById("fetch-headers")
    .addEventListener("click", fetchWithHeaders);
  document
    .getElementById("fetch-auth")
    .addEventListener("click", fetchWithAuth);
  document
    .getElementById("fetch-params")
    .addEventListener("click", fetchWithParams);
  document
    .getElementById("fetch-timeout")
    .addEventListener("click", () => fetchWithTimeout());
}

// ЗАДАНИЕ 4: Обработка ответов
async function fetchAndCheckStatus() {
  const tests = [
    { url: `${API_BASE_URL}/posts/1`, label: "Существующий ресурс (/posts/1)" },
    {
      url: `${API_BASE_URL}/posts/999999`,
      label: "Несуществующий ресурс (/posts/999999)",
    },
    {
      url: `${API_BASE_URL}/nonexistent-endpoint`,
      label: "Несуществующий endpoint",
    },
  ];
  const results = [];

  for (const t of tests) {
    try {
      const res = await fetch(t.url);
      if (res.ok) {
        results.push(
          `✅ ${t.label}: ${res.status} ${res.statusText} (response.ok=true)`,
        );
      } else {
        results.push(
          `⚠️ ${t.label}: ${res.status} ${res.statusText} (response.ok=false)`,
        );
      }
    } catch (e) {
      results.push(`❌ ${t.label}: сетевая ошибка (${e.message})`);
    }
  }

  displayOutput("response-output", results.join("\n"));
}

async function fetchAndReadHeaders() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    let output = "Заголовки ответа:\n";
    response.headers.forEach((value, key) => {
      output += `${key}: ${value}\n`;
    });
    displayOutput("response-output", output);
  } catch (error) {
    displayOutput("response-output", error, true);
  }
}

let lastBlobUrl = null;
async function fetchBlobData() {
  displayOutput("response-output", "Загрузка изображения...");
  try {
    const response = await fetch("https://picsum.photos/200/300");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blob = await response.blob();
    if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);
    const imgUrl = URL.createObjectURL(blob);
    lastBlobUrl = imgUrl;

    const container = document.getElementById("response-data");
    container.innerHTML = `<img src="${imgUrl}" alt="Blob Image" style="max-width: 100%; border-radius: 8px;">`;
    displayOutput(
      "response-output",
      `Изображение загружено. Размер: ${blob.size} байт. Тип: ${blob.type}`,
    );
  } catch (error) {
    displayOutput("response-output", error, true);
  }
}

async function fetchWithFormData() {
  const results = [];

  // 1. JSON
  try {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Иван", email: "ivan@example.com" }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    results.push(
      `JSON: Content-Type=application/json, body - строка. Сервер вернул ID=${data.id}`,
    );
  } catch (e) {
    results.push(`JSON: ошибка ${e.message}`);
  }

  // 2. FormData
  try {
    const formData = new FormData();
    formData.append("name", "Иван");
    formData.append("email", "ivan@example.com");
    formData.append(
      "avatar",
      new Blob(["fake image data"], { type: "image/jpeg" }),
      "avatar.jpg",
    );

    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    results.push(
      `FormData: Content-Type=multipart/form-data с boundary, body - объект FormData (поддерживает файлы). Сервер вернул ID=${data.id}`,
    );
  } catch (e) {
    results.push(`FormData: ошибка ${e.message}`);
  }

  results.push(
    "\nРазница: JSON → сериализованная строка, Content-Type: application/json. FormData → multipart/form-data с boundary, поддерживает файлы, Content-Type ставится браузером.",
  );
  displayOutput("response-output", results.join("\n"));
}

function setupResponseHandling() {
  document
    .getElementById("fetch-status")
    .addEventListener("click", fetchAndCheckStatus);
  document
    .getElementById("fetch-headers-response")
    .addEventListener("click", fetchAndReadHeaders);
  document
    .getElementById("fetch-blob")
    .addEventListener("click", fetchBlobData);
  document
    .getElementById("fetch-formdata")
    .addEventListener("click", fetchWithFormData);
}

// ЗАДАНИЕ 5: Обработка ошибок
async function fetchNetworkError() {
  try {
    await fetch("https://this-domain-does-not-exist-12345.com/data");
  } catch (error) {
    displayOutput(
      "error-output",
      `Сетевая ошибка (TypeError): ${error.message}`,
      true,
    );
  }
}

async function fetchHttpError() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/9999999`);
    if (!response.ok) {
      throw new Error(`HTTP Ошибка: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    displayOutput(
      "error-output",
      `Поймана HTTP ошибка: ${error.message}`,
      true,
    );
  }
}

let activeAbortController = null;

async function fetchWithAbort() {
  if (activeAbortController) {
    displayOutput(
      "error-output",
      "Уже есть активный запрос - нажмите «Отменить активный запрос».",
    );
    return;
  }
  activeAbortController = new AbortController();
  displayOutput(
    "error-output",
    "Запрос отправлен к httpbin.org/delay/10. Нажмите «Отменить активный запрос».",
  );

  try {
    const res = await fetch("https://httpbin.org/delay/10", {
      signal: activeAbortController.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    displayOutput("error-output", "Запрос выполнен полностью (не отменён).");
  } catch (error) {
    if (error.name === "AbortError") {
      const reason = activeAbortController?.signal?.reason;
      const reasonText = typeof reason === "string" ? ` (${reason})` : "";
      displayOutput(
        "error-output",
        `Запрос отменён пользователем${reasonText}`,
        true,
      );
    } else {
      displayOutput("error-output", error, true);
    }
  } finally {
    activeAbortController = null;
  }
}

function cancelActiveFetch() {
  if (activeAbortController) {
    activeAbortController.abort("Отменено пользователем");
  } else {
    displayOutput("error-output", "Нет активного запроса для отмены.");
  }
}

// Ретраит только сетевые ошибки (TypeError) и retryable-статусы.
async function fetchWithRetry(
  url,
  options = {},
  retries = 3,
  baseDelayMs = 1000,
) {
  const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) return await response.json();

      const httpError = new Error(
        `Статус: ${response.status} ${response.statusText || ""}`.trim(),
      );
      httpError.status = response.status;

      // Не-retryable HTTP-статус - бросаем сразу наружу
      if (!RETRYABLE_STATUSES.has(response.status)) {
        throw httpError;
      }

      lastError = httpError;
    } catch (error) {
      // Сетевая ошибка - retryable
      if (error instanceof TypeError) {
        lastError = error;
        if (i === retries - 1) throw lastError;
        const delay = Math.pow(2, i) * baseDelayMs;
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }
      // Не-retryable ошибка (наш httpError с 4xx или неизвестная) - бросаем
      throw error;
    }

    // Сюда попадаем только для retryable HTTP-статусов
    if (i === retries - 1) throw lastError;
    const delay = Math.pow(2, i) * baseDelayMs;
    await new Promise((res) => setTimeout(res, delay));
  }

  if (lastError) throw lastError;
}

async function testRetry() {
  displayOutput(
    "error-output",
    "Запуск Retry Pattern (3 попытки, экспоненциальная задержка)...",
  );
  try {
    await fetchWithRetry(`${API_BASE_URL}/invalid-retry-url`, {}, 3);
  } catch (error) {
    displayOutput(
      "error-output",
      `Все попытки провалились: ${error.message}`,
      true,
    );
  }
}

function setupErrorHandling() {
  document
    .getElementById("fetch-network-error")
    .addEventListener("click", fetchNetworkError);
  document
    .getElementById("fetch-http-error")
    .addEventListener("click", fetchHttpError);
  document
    .getElementById("fetch-abort")
    .addEventListener("click", fetchWithAbort);
  document
    .getElementById("fetch-abort-cancel")
    .addEventListener("click", cancelActiveFetch);
  document.getElementById("fetch-retry").addEventListener("click", testRetry);
}

// ЗАДАНИЕ 6: Параллельные запросы
async function fetchWithPromiseAll() {
  const start = Date.now();
  displayOutput("parallel-output", "Загрузка...");

  try {
    const [users, posts, comments] = await Promise.all([
      fetch(`${API_BASE_URL}/users`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
      fetch(`${API_BASE_URL}/posts`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
      fetch(`${API_BASE_URL}/comments`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    ]);

    const elapsed = Date.now() - start;
    displayOutput(
      "parallel-output",
      `Promise.all выполнен за ${elapsed}мс.\nПользователей: ${users.length}\nПостов: ${posts.length}\nКомментариев: ${comments.length}`,
    );
  } catch (error) {
    displayOutput("parallel-output", error, true);
  }
}

async function fetchWithPromiseRace() {
  const results = [];

  // Демонстрация 1: гонка двух запросов
  try {
    const fast = fetch(`${API_BASE_URL}/posts/1`)
      .then((r) => r.json())
      .then((d) => ({ name: "Пост 1", data: d }));
    const slow = fetch(`${API_BASE_URL}/users/1`)
      .then((r) => r.json())
      .then((d) => ({ name: "Юзер 1", data: d }));

    const winner = await Promise.race([fast, slow]);
    results.push(`Гонка запросов: победил ${winner.name}`);
  } catch (e) {
    results.push(`Гонка запросов: ошибка ${e.message}`);
  }

  // Демонстрация 2: таймаут через гонку с таймером (с очисткой setTimeout)
  try {
    let timeoutId;
    const timeoutPromise = new Promise((_, rej) => {
      timeoutId = setTimeout(
        () => rej(new Error("Timeout: 2 секунды истекли")),
        2000,
      );
    });
    const fetchPromise = fetch(`${API_BASE_URL}/posts/1`).then((r) => r.json());
    try {
      const result = await Promise.race([fetchPromise, timeoutPromise]);
      clearTimeout(timeoutId);
      results.push(`Гонка с таймаутом: запрос успел, ID=${result.id}`);
    } catch (e) {
      clearTimeout(timeoutId);
      results.push(`Гонка с таймаутом: ${e.message}`);
    }
  } catch (e) {
    results.push(`Гонка с таймаутом: ошибка ${e.message}`);
  }

  displayOutput("parallel-output", results.join("\n\n"));
}

async function fetchSequentialRequests() {
  const start = Date.now();
  displayOutput("parallel-output", "Загрузка...");

  try {
    const res1 = await fetch(`${API_BASE_URL}/users/1`);
    if (!res1.ok) throw new Error(`HTTP ${res1.status}`);
    const user = await res1.json();

    const res2 = await fetch(`${API_BASE_URL}/posts?userId=${user.id}`);
    if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
    const posts = await res2.json();

    const elapsed = Date.now() - start;
    displayOutput(
      "parallel-output",
      `Последовательные запросы выполнены за ${elapsed}мс.\nПользователь: ${user.name}\nЕго постов: ${posts.length}`,
    );
  } catch (error) {
    displayOutput("parallel-output", error, true);
  }
}

function setupParallelRequests() {
  document
    .getElementById("fetch-all")
    .addEventListener("click", fetchWithPromiseAll);
  document
    .getElementById("fetch-race")
    .addEventListener("click", fetchWithPromiseRace);
  document
    .getElementById("fetch-sequential")
    .addEventListener("click", fetchSequentialRequests);
}

// ЗАДАНИЕ 7: Реальные сценарии
async function fetchUserWithPosts() {
  displayOutput("scenario-output", "Загрузка...");
  try {
    const userRes = await fetch(`${API_BASE_URL}/users/1`);
    if (!userRes.ok) throw new Error(`HTTP ${userRes.status}`);
    const user = await userRes.json();

    const postsRes = await fetch(`${API_BASE_URL}/posts?userId=${user.id}`);
    if (!postsRes.ok) throw new Error(`HTTP ${postsRes.status}`);
    const posts = await postsRes.json();

    displayOutput(
      "scenario-output",
      `Пользователь: ${user.name}\nВсего постов: ${posts.length}`,
    );
    displayData("scenario-data", posts.slice(0, 3));
  } catch (error) {
    displayOutput("scenario-output", error, true);
  }
}

async function fetchWithSearch() {
  displayOutput("scenario-output", "Поиск...");
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const posts = await response.json();

    const query = "qui";
    const results = posts.filter(
      (p) => p.title.includes(query) || p.body.includes(query),
    );

    displayOutput(
      "scenario-output",
      `Найдено ${results.length} совпадений по слову "${query}".`,
    );
    displayData("scenario-data", results.slice(0, 5));
  } catch (error) {
    displayOutput("scenario-output", error, true);
  }
}

async function simulateFileUpload() {
  const progressFill = document.getElementById("progress-fill");
  progressFill.style.width = "0%";
  displayOutput("scenario-output", "Начало загрузки...");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${API_BASE_URL}/posts`, true);

  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      progressFill.style.width = percentComplete + "%";
    }
  };

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      progressFill.style.width = "100%";
      displayOutput("scenario-output", "Файл успешно загружен (симуляция)!");
    } else {
      displayOutput("scenario-output", `HTTP ${xhr.status} при загрузке`, true);
    }
  };

  xhr.onerror = function () {
    displayOutput("scenario-output", "Ошибка при загрузке файла.", true);
  };

  const formData = new FormData();
  formData.append(
    "file",
    new Blob(["test file content"], { type: "text/plain" }),
    "test.txt",
  );
  xhr.send(formData);
}

// Кэш: TTL 60с, ключ = URL + method + body
function createFetchCache() {
  const cache = new Map();
  const TTL = 60000;

  return async function cachedFetch(url, options = {}) {
    const cacheKey = `${url}::${options.method || "GET"}::${options.body || ""}`;
    const now = Date.now();

    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (now - cached.timestamp < TTL) {
        console.log(`💾 [CACHE] ${cacheKey} из кэша`);
        return cached.data;
      }
      cache.delete(cacheKey);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    // 204 No Content не имеет тела; json() на нём бросит SyntaxError
    let data = null;
    if (response.status !== 204) {
      try {
        data = await response.json();
      } catch (_) {
        data = null;
      }
    }

    cache.set(cacheKey, { data, timestamp: now });
    return data;
  };
}

const cachedFetchInstance = createFetchCache();

async function testCache() {
  displayOutput("scenario-output", "Тест кэширования (см. консоль)...");
  const data1 = await cachedFetchInstance(`${API_BASE_URL}/todos/1`);
  const data2 = await cachedFetchInstance(`${API_BASE_URL}/todos/1`);
  displayOutput(
    "scenario-output",
    `Кэширование работает!\nЗаголовок: "${data1.title}"`,
  );
}

function setupRealScenarios() {
  document
    .getElementById("fetch-user-posts")
    .addEventListener("click", fetchUserWithPosts);
  document
    .getElementById("fetch-search")
    .addEventListener("click", fetchWithSearch);
  document
    .getElementById("fetch-upload")
    .addEventListener("click", simulateFileUpload);
  document.getElementById("fetch-cache").addEventListener("click", testCache);
}

// ИНИЦИАЛИЗАЦИЯ
function initializeFetchAPI() {
  setupGetRequests();
  setupCrudRequests();
  setupHeadersAndParams();
  setupResponseHandling();
  setupErrorHandling();
  setupParallelRequests();
  setupRealScenarios();

  document.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (button) {
      let btnText = button.textContent.trim();
      if (button.innerHTML.includes("spinner")) {
        btnText = button.dataset.originalText || "Загрузка...";
      }
      console.log(
        `%c[КЛИК]%c Нажата кнопка: "${btnText}" (ID: ${button.id || "без ID"})`,
        "color: #f97316; font-weight: bold;",
        "color: #334155;",
      );
    }
  });

  console.log("✅ Все обработчики Fetch API инициализированы!");
}

document.addEventListener("DOMContentLoaded", initializeFetchAPI);
