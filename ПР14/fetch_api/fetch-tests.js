const taskAreasToHide = document.querySelectorAll(".task-area");
taskAreasToHide.forEach((el) => {
  el.style.display = "none";
});

function runTest(testName, actual, expected) {
  const isEqual =
    typeof actual === "object" && actual !== null
      ? JSON.stringify(actual) === JSON.stringify(expected)
      : actual === expected;

  const container = document.getElementById("test-container");
  if (!container) {
    console.warn(`[TEST] ${testName}: #test-container не найден`);
    console.log(`${isEqual ? "✅" : "❌"} ${testName}`, { actual, expected });
    return;
  }

  const card = document.createElement("div");
  card.className = `test-card ${isEqual ? "pass" : "fail"}`;
  card.innerHTML = `
        <div class="test-header">
            <span>${testName}</span>
            <span class="test-badge">${isEqual ? "✅ УСПЕХ" : "❌ ОШИБКА"}</span>
        </div>
        <div class="test-details">
            <strong>Ожидалось:</strong> ${JSON.stringify(expected)}<br>
            <strong>Получено:</strong> ${JSON.stringify(actual)}
        </div>
    `;
  container.appendChild(card);
  console.log(`${testName}:`, isEqual ? "✅" : "❌", { expected, actual });
}

async function withMockedFetch(mockFn, testFn) {
  const original = window.fetch;
  window.fetch = mockFn;
  try {
    return await testFn();
  } finally {
    window.fetch = original;
  }
}

async function withTempElement(id, testFn) {
  const el = document.createElement("div");
  el.id = id;
  document.body.appendChild(el);
  try {
    return await testFn(el);
  } finally {
    el.remove();
  }
}

function getText(id) {
  const el = document.getElementById(id);
  return el ? el.textContent : "";
}

window.addEventListener("load", async function () {
  console.log("=== ЗАПУСК ТЕСТОВ ПР14 ===");

  const realFetch = window.fetch.bind(window);

  // Снимок исходного состояния UI-контейнеров (для восстановления после тестов)
  const UI_OUTPUT_IDS = [
    "get-output",
    "get-data",
    "crud-output",
    "headers-output",
    "response-output",
    "response-data",
    "error-output",
    "parallel-output",
    "scenario-output",
    "scenario-data",
  ];
  const uiSnapshots = {};
  for (const id of UI_OUTPUT_IDS) {
    const el = document.getElementById(id);
    if (el) uiSnapshots[id] = { html: el.innerHTML, cls: el.className };
  }
  const buttonSnapshots = {};
  document.querySelectorAll("button").forEach((btn) => {
    buttonSnapshots[btn.id] = { html: btn.innerHTML, disabled: btn.disabled };
  });

  function restoreUI() {
    for (const id of UI_OUTPUT_IDS) {
      const el = document.getElementById(id);
      if (el && uiSnapshots[id]) {
        el.innerHTML = uiSnapshots[id].html;
        el.className = uiSnapshots[id].cls;
      }
    }
    document.querySelectorAll("button").forEach((btn) => {
      if (buttonSnapshots[btn.id]) {
        btn.innerHTML = buttonSnapshots[btn.id].html;
        btn.disabled = buttonSnapshots[btn.id].disabled;
      }
    });
    // Показываем задания обратно
    taskAreasToHide.forEach((el) => {
      el.style.display = "";
    });
    console.log("[TEST] UI восстановлен в исходное состояние");
  }

  try {
    // ГРУППА 1: Вспомогательные функции
    // Тест 1: URL с параметрами (_limit=5)
    const url = new URL(`${API_BASE_URL}/posts`);
    url.searchParams.append("_limit", "5");
    runTest(
      "URL с параметрами (_limit=5)",
      url.toString(),
      "https://jsonplaceholder.typicode.com/posts?_limit=5",
    );

    // Тест 2: URLSearchParams формирует строку запроса
    const params = new URLSearchParams();
    params.append("_limit", "5");
    params.append("_sort", "id");
    params.append("_order", "desc");
    runTest(
      "URLSearchParams формирует строку",
      params.toString(),
      "_limit=5&_sort=id&_order=desc",
    );

    // Тест 3: Headers.get возвращает добавленный заголовок
    const headers = new Headers({ "Content-Type": "application/json" });
    headers.append("X-Custom", "Value");
    runTest(
      "Headers: get возвращает значение",
      headers.get("Content-Type"),
      "application/json",
    );

    // Тест 4: Headers.has возвращает true для добавленного заголовка
    runTest(
      "Headers: has для добавленного = true",
      headers.has("X-Custom"),
      true,
    );

    // Тест 5: displayOutput отображает текст ошибки
    await withTempElement("test-display-output", async (el) => {
      displayOutput("test-display-output", new Error("тестовая ошибка"));
      runTest(
        "displayOutput отображает текст Error",
        el.textContent.includes("Ошибка: тестовая ошибка"),
        true,
      );
    });

    // Тест 6: displayOutput ставит класс success
    await withTempElement("test-display-success", async (el) => {
      displayOutput("test-display-success", "успешный результат");
      runTest(
        "displayOutput: класс success",
        el.classList.contains("success"),
        true,
      );
    });

    // Тест 7: displayOutput ставит класс error при isError=true
    await withTempElement("test-display-error", async (el) => {
      displayOutput("test-display-error", "ошибка", true);
      runTest(
        "displayOutput: класс error при isError=true",
        el.classList.contains("error"),
        true,
      );
    });

    // Тест 8: displayData выводит телефон пользователя
    await withTempElement("test-display-data", async (el) => {
      displayData("test-display-data", [
        { name: "Test", email: "t@t.com", phone: "12345" },
      ]);
      runTest(
        "displayData выводит телефон пользователя",
        el.innerHTML.includes("12345"),
        true,
      );
    });

    // Тест 9: displayData отображает объект как JSON
    await withTempElement("test-display-obj", async (el) => {
      displayData("test-display-obj", { foo: "bar", num: 42 });
      runTest(
        "displayData отображает объект как JSON",
        el.innerHTML.includes('"foo": "bar"'),
        true,
      );
    });

    // ГРУППА 2: Базовые GET-запросы
    // Тест 10: fetchGetRequest выводит заголовок поста
    await withMockedFetch(
      async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({ id: 1, title: "Test Title", body: "Test Body" }),
      }),
      async () => {
        await fetchGetRequest();
      },
    );
    runTest(
      "fetchGetRequest выводит заголовок поста",
      getText("get-output").includes("Test Title"),
      true,
    );

    // Тест 11: fetchGetRequest обрабатывает HTTP 500
    await withMockedFetch(
      async () => ({
        ok: false,
        status: 500,
        statusText: "Server Error",
        json: async () => ({}),
      }),
      async () => {
        await fetchGetRequest();
      },
    );
    runTest(
      "fetchGetRequest обрабатывает HTTP 500",
      getText("get-output").includes("500"),
      true,
    );

    // Тест 12: fetchJsonData сообщает о количестве пользователей
    await withMockedFetch(
      async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => [
          { id: 1, name: "User A", email: "a@a.com", phone: "111" },
          { id: 2, name: "User B", email: "b@b.com", phone: "222" },
        ],
      }),
      async () => {
        await fetchJsonData();
      },
    );
    runTest(
      "fetchJsonData сообщает о 2 пользователях",
      getText("get-output").includes("2 пользователей"),
      true,
    );

    // Тест 13: fetchWithError показывает HTTP-статус 404
    await withMockedFetch(
      async () => ({ ok: false, status: 404, statusText: "Not Found" }),
      async () => {
        await fetchWithError();
      },
    );
    runTest(
      "fetchWithError показывает статус 404",
      getText("get-output").includes("404"),
      true,
    );

    // Тест 14: fetchWithError показывает сетевую ошибку
    await withMockedFetch(
      async () => {
        throw new TypeError("Failed to fetch");
      },
      async () => {
        await fetchWithError();
      },
    );
    runTest(
      "fetchWithError показывает сетевую ошибку",
      getText("get-output").includes("Failed to fetch"),
      true,
    );

    // ГРУППА 3: CRUD-запросы
    // Тест 15: POST - метод, Content-Type и тело запроса
    let capturedOptions = null;
    await withMockedFetch(
      async (u, options) => {
        capturedOptions = options;
        return {
          ok: true,
          status: 201,
          statusText: "Created",
          json: async () => ({ id: 101, title: "Новый пост от студента" }),
        };
      },
      async () => {
        await fetchPostRequest();
      },
    );
    // Тест 15.1: POST: метод = POST
    runTest("POST: метод = POST", capturedOptions.method, "POST");
    // Тест 15.2: POST: Content-Type установлен
    runTest(
      "POST: Content-Type установлен",
      capturedOptions.headers["Content-Type"],
      "application/json; charset=UTF-8",
    );
    // Тест 15.3: POST: тело - валидный JSON
    runTest(
      "POST: тело - валидный JSON",
      JSON.parse(capturedOptions.body).title,
      "Новый пост от студента",
    );

    // Тест 16: PUT - используется метод PUT
    let putOptions = null;
    await withMockedFetch(
      async (u, options) => {
        putOptions = options;
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          json: async () => ({ id: 1, title: "Обновленный заголовок (PUT)" }),
        };
      },
      async () => {
        await fetchPutRequest();
      },
    );
    runTest("PUT: метод = PUT", putOptions.method, "PUT");

    // Тест 17: PATCH - метод PATCH и только поле title в теле
    let patchOptions = null;
    await withMockedFetch(
      async (u, options) => {
        patchOptions = options;
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          json: async () => ({
            id: 1,
            title: "Частично обновленный заголовок (PATCH)",
          }),
        };
      },
      async () => {
        await fetchPatchRequest();
      },
    );
    // Тест 17.1: PATCH: метод = PATCH
    runTest("PATCH: метод = PATCH", patchOptions.method, "PATCH");
    // Тест 17.2: PATCH: тело содержит только title
    runTest(
      "PATCH: тело содержит только title",
      Object.keys(JSON.parse(patchOptions.body)),
      ["title"],
    );

    // Тест 18: DELETE - используется метод DELETE
    let deleteOptions = null;
    await withMockedFetch(
      async (u, options) => {
        deleteOptions = options;
        return { ok: true, status: 200, statusText: "OK" };
      },
      async () => {
        await fetchDeleteRequest();
      },
    );
    runTest("DELETE: метод = DELETE", deleteOptions.method, "DELETE");

    // ГРУППА 4: Заголовки, авторизация, параметры
    // Тест 19: fetchWithHeaders отправляет X-Custom-Header и Authorization
    let headersCaptured = null;
    await withMockedFetch(
      async (u, options) => {
        headersCaptured = options.headers;
        return { ok: true, status: 200, json: async () => [] };
      },
      async () => {
        await fetchWithHeaders();
      },
    );
    // Тест 19.1: X-Custom-Header отправлен
    runTest(
      "fetchWithHeaders: X-Custom-Header отправлен",
      headersCaptured["X-Custom-Header"],
      "MyValue",
    );
    // Тест 19.2: Authorization отправлен
    runTest(
      "fetchWithHeaders: Authorization отправлен",
      headersCaptured.Authorization,
      "Bearer my-secret-token",
    );

    // Тест 20: fetchWithAuth использует Basic и Bearer
    const authHeaders = [];
    await withMockedFetch(
      async (u, options) => {
        authHeaders.push(options?.headers?.Authorization || "");
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          json: async () => ({ name: "Test User" }),
        };
      },
      async () => {
        await fetchWithAuth();
      },
    );
    // Тест 20.1: используется Basic Auth
    runTest(
      "fetchWithAuth: используется Basic Auth",
      authHeaders.some((h) => h.startsWith("Basic ")),
      true,
    );
    // Тест 20.2: используется Bearer Token
    runTest(
      "fetchWithAuth: используется Bearer Token",
      authHeaders.some((h) => h.startsWith("Bearer ")),
      true,
    );

    // Тест 21: fetchWithParams добавляет параметры _limit и _sort в URL
    let paramsUrl = null;
    await withMockedFetch(
      async (u) => {
        paramsUrl = u.toString();
        return { ok: true, status: 200, json: async () => [] };
      },
      async () => {
        await fetchWithParams();
      },
    );
    // Тест 21.1: URL содержит _limit=5
    runTest(
      "fetchWithParams: URL содержит _limit=5",
      paramsUrl.includes("_limit=5"),
      true,
    );
    // Тест 21.2: URL содержит _sort=id
    runTest(
      "fetchWithParams: URL содержит _sort=id",
      paramsUrl.includes("_sort=id"),
      true,
    );

    // Тест 22: fetchWithTimeout - быстрый запрос успевает
    await withMockedFetch(
      async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({ ok: true }),
      }),
      async () => {
        await fetchWithTimeout(200);
      },
    );
    runTest(
      "fetchWithTimeout: быстрый запрос успевает",
      getText("headers-output").includes("успел"),
      true,
    );

    // Тест 23: fetchWithTimeout - долгий запрос отменяется по таймауту
    await withMockedFetch(
      (u, options) =>
        new Promise((_, reject) => {
          if (!options?.signal) return;
          if (options.signal.aborted) {
            return reject(new DOMException("Aborted", "AbortError"));
          }
          options.signal.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        }),
      async () => {
        await fetchWithTimeout(100);
      },
    );
    runTest(
      "fetchWithTimeout: долгий запрос отменяется (ТАЙМАУТ)",
      getText("headers-output").includes("ТАЙМАУТ"),
      true,
    );

    // ГРУППА 5: Обработка ответов
    // Тест 24: fetchAndCheckStatus различает ok и не-ok ответы
    await withMockedFetch(
      async (u) => {
        const uStr = u.toString();
        if (uStr.includes("999999") || uStr.includes("nonexistent")) {
          return { ok: false, status: 404, statusText: "Not Found" };
        }
        return { ok: true, status: 200, statusText: "OK" };
      },
      async () => {
        await fetchAndCheckStatus();
      },
    );
    // Тест 24.1: отображает response.ok=true
    runTest(
      "fetchAndCheckStatus: отображает response.ok=true",
      getText("response-output").includes("response.ok=true"),
      true,
    );
    // Тест 24.2: отображает response.ok=false
    runTest(
      "fetchAndCheckStatus: отображает response.ok=false",
      getText("response-output").includes("response.ok=false"),
      true,
    );

    // Тест 25: fetchAndReadHeaders выводит Content-Type ответа
    await withMockedFetch(
      async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers({
          "Content-Type": "application/json",
          "X-Test-Header": "TestValue",
        }),
      }),
      async () => {
        await fetchAndReadHeaders();
      },
    );
    runTest(
      "fetchAndReadHeaders: выводит Content-Type",
      getText("response-output").includes("content-type: application/json"),
      true,
    );

    // Тест 26: fetchBlobData получает Blob и отображает его
    await withMockedFetch(
      async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        blob: async () => new Blob(["fake image data"], { type: "image/png" }),
      }),
      async () => {
        await fetchBlobData();
      },
    );
    runTest(
      "fetchBlobData: сообщает о загрузке",
      getText("response-output").includes("Изображение загружено"),
      true,
    );

    // Тест 27: fetchWithFormData делает 2 запроса и отправляет FormData
    let formDataRequests = 0;
    let formDataCaptured = null;
    await withMockedFetch(
      async (u, options) => {
        formDataRequests++;
        if (options.body instanceof FormData) formDataCaptured = options.body;
        return {
          ok: true,
          status: 201,
          statusText: "Created",
          json: async () => ({ id: 200 }),
        };
      },
      async () => {
        await fetchWithFormData();
      },
    );
    // Тест 27.1: сделано 2 запроса (JSON + FormData)
    runTest(
      "fetchWithFormData: делает 2 запроса (JSON + FormData)",
      formDataRequests,
      2,
    );
    // Тест 27.2: тело - экземпляр FormData
    runTest(
      "fetchWithFormData: тело - экземпляр FormData",
      formDataCaptured instanceof FormData,
      true,
    );
    // Тест 27.3: FormData содержит name
    runTest(
      "fetchWithFormData: FormData содержит name",
      formDataCaptured.get("name"),
      "Иван",
    );

    // ГРУППА 6: Обработка ошибок
    // Тест 28: fetchNetworkError сообщает о сетевой ошибке
    await withMockedFetch(
      async () => {
        throw new TypeError("Failed to fetch");
      },
      async () => {
        await fetchNetworkError();
      },
    );
    runTest(
      "fetchNetworkError: сообщение о сетевой ошибке",
      getText("error-output").includes("Сетевая ошибка"),
      true,
    );

    // Тест 29: fetchHttpError ловит HTTP 404
    await withMockedFetch(
      async () => ({ ok: false, status: 404, statusText: "Not Found" }),
      async () => {
        await fetchHttpError();
      },
    );
    runTest(
      "fetchHttpError: ловит HTTP 404",
      getText("error-output").includes("404"),
      true,
    );

    // Тест 30: fetchWithAbort + cancelActiveFetch отменяют запрос
    await withMockedFetch(
      (u, options) =>
        new Promise((_, reject) => {
          if (!options?.signal) return;
          options.signal.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        }),
      async () => {
        const startPromise = fetchWithAbort();
        await new Promise((r) => setTimeout(r, 20));
        cancelActiveFetch();
        await startPromise;
      },
    );
    runTest(
      "fetchWithAbort: сообщение об отмене",
      getText("error-output").includes("отменён"),
      true,
    );

    // Тест 31: AbortController.signal.aborted = true после abort()
    const ctrlAbort = new AbortController();
    ctrlAbort.abort();
    runTest(
      "AbortController.signal.aborted = true после abort()",
      ctrlAbort.signal.aborted,
      true,
    );

    // Тест 32: signal.reason сохраняет переданную причину
    const ctrlReason = new AbortController();
    ctrlReason.abort("custom reason");
    runTest(
      "signal.reason сохраняет причину",
      ctrlReason.signal.reason,
      "custom reason",
    );

    // Тест 33: fetchWithRetry повторяет запрос после HTTP 500
    let retryCount = 0;
    await withMockedFetch(
      async () => {
        retryCount++;
        if (retryCount < 2) {
          return { ok: false, status: 500, statusText: "Server Error" };
        }
        return { ok: true, status: 200, json: async () => ({ id: 42 }) };
      },
      async () => {
        const result = await fetchWithRetry("http://test", {}, 2, 10);
        runTest("fetchWithRetry: возвращает данные при успехе", result.id, 42);
      },
    );
    runTest("fetchWithRetry: повторил запрос после 500", retryCount, 2);

    // Тест 34: fetchWithRetry НЕ ретраит HTTP 404
    let notRetryCount = 0;
    await withMockedFetch(
      async () => {
        notRetryCount++;
        return { ok: false, status: 404, statusText: "Not Found" };
      },
      async () => {
        try {
          await fetchWithRetry("http://test", {}, 3, 10);
        } catch (_) {}
      },
    );
    runTest("fetchWithRetry: НЕ ретраит 404 (1 попытка)", notRetryCount, 1);

    // Тест 35: fetchWithRetry ретраит сетевую ошибку
    let netRetryCount = 0;
    await withMockedFetch(
      async () => {
        netRetryCount++;
        if (netRetryCount < 3) throw new TypeError("Network error");
        return { ok: true, status: 200, json: async () => ({ id: 1 }) };
      },
      async () => {
        await fetchWithRetry("http://test", {}, 3, 10);
      },
    );
    runTest(
      "fetchWithRetry: ретраит сетевую ошибку (3 попытки)",
      netRetryCount,
      3,
    );

    // ГРУППА 7: Параллельные запросы
    // Тест 36: fetchWithPromiseAll отображает результаты Promise.all
    await withMockedFetch(
      async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => [1, 2, 3],
      }),
      async () => {
        await fetchWithPromiseAll();
      },
    );
    runTest(
      "fetchWithPromiseAll: отображает результаты",
      getText("parallel-output").includes("Promise.all выполнен"),
      true,
    );

    // Тест 37: fetchWithPromiseRace - быстрый запрос побеждает
    await withMockedFetch(
      async (u) => {
        if (u.toString().includes("/users/")) {
          await new Promise((r) => setTimeout(r, 30));
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: 1, name: "Test" }),
        };
      },
      async () => {
        await fetchWithPromiseRace();
      },
    );
    // Тест 37.1: победил быстрый запрос
    runTest(
      "fetchWithPromiseRace: победил быстрый запрос",
      getText("parallel-output").includes("Пост 1"),
      true,
    );
    // Тест 37.2: таймаут не сработал
    runTest(
      "fetchWithPromiseRace: таймаут не сработал",
      getText("parallel-output").includes("запрос успел"),
      true,
    );

    // Тест 38: fetchSequentialRequests выполняет цепочку запросов
    await withMockedFetch(
      async (u) => {
        if (u.toString().includes("/users/")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ id: 1, name: "Test User" }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => [{ id: 1 }, { id: 2 }],
        };
      },
      async () => {
        await fetchSequentialRequests();
      },
    );
    runTest(
      "fetchSequentialRequests: сообщает пользователя и посты",
      getText("parallel-output").includes("Test User"),
      true,
    );

    // ГРУППА 8: Реальные сценарии
    // Тест 39: fetchUserWithPosts получает пользователя и его посты
    await withMockedFetch(
      async (u) => {
        if (u.toString().includes("/users/")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ id: 1, name: "Leanne Graham" }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => [{ id: 1, title: "Post 1", body: "Body 1" }],
        };
      },
      async () => {
        await fetchUserWithPosts();
      },
    );
    runTest(
      "fetchUserWithPosts: отображает пользователя",
      getText("scenario-output").includes("Leanne Graham"),
      true,
    );

    // Тест 40: fetchWithSearch находит посты по подстроке
    await withMockedFetch(
      async () => ({
        ok: true,
        status: 200,
        json: async () => [
          { id: 1, title: "qui dolorem", body: "..." },
          { id: 2, title: "other", body: "..." },
        ],
      }),
      async () => {
        await fetchWithSearch();
      },
    );
    runTest(
      "fetchWithSearch: находит 1 совпадение по 'qui'",
      getText("scenario-output").includes("Найдено 1"),
      true,
    );

    // ГРУППА 9: Кэширование
    // Тест 41: createFetchCache кэширует повторный запрос
    {
      let cacheFetchCount = 0;
      const testCache = createFetchCache();
      await withMockedFetch(
        async () => {
          cacheFetchCount++;
          return {
            ok: true,
            status: 200,
            headers: new Headers({ "Content-Type": "application/json" }),
            json: async () => ({ id: 1, title: "Cached" }),
          };
        },
        async () => {
          await testCache("http://example.com/data");
          await testCache("http://example.com/data");
        },
      );
      runTest(
        "createFetchCache: повторный запрос из кэша (1 fetch)",
        cacheFetchCount,
        1,
      );
    }

    // Тест 42: createFetchCache различает запросы по методу и body
    {
      let cacheFetchCount2 = 0;
      const testCache2 = createFetchCache();
      await withMockedFetch(
        async (u, opts) => {
          cacheFetchCount2++;
          return {
            ok: true,
            status: 200,
            headers: new Headers({ "Content-Type": "application/json" }),
            json: async () => ({ method: opts?.method || "GET" }),
          };
        },
        async () => {
          await testCache2("http://x", { method: "GET" });
          await testCache2("http://x", { method: "GET" });
          await testCache2("http://x", { method: "POST", body: "{}" });
        },
      );
      runTest(
        "createFetchCache: ключ учитывает метод и body (2 fetch)",
        cacheFetchCount2,
        2,
      );
    }

    // Тест 43: createFetchCache возвращает null для 204 No Content
    {
      const testCache204 = createFetchCache();
      let result;
      await withMockedFetch(
        async () => ({
          ok: true,
          status: 204,
          statusText: "No Content",
          headers: new Headers(),
        }),
        async () => {
          result = await testCache204("http://example.com/204");
        },
      );
      runTest("createFetchCache: 204 возвращает null без ошибки", result, null);
    }

    // ГРУППА 10: Интеграционный тест (реальная сеть)
    // Тест 44: реальный GET-запрос к /posts/1
    try {
      const res = await realFetch(`${API_BASE_URL}/posts/1`);
      // Тест 44.1: статус 200
      runTest("Реальный GET /posts/1: статус 200", res.status, 200);
      // Тест 44.2: response.ok = true
      runTest("Реальный GET /posts/1: response.ok = true", res.ok, true);
    } catch (e) {
      console.warn(
        "[TEST] Реальная сеть недоступна - интеграционный тест пропущен:",
        e.message,
      );
      // Тест 44: пропущен из-за отсутствия сети
      runTest(
        "Реальный GET /posts/1 (сеть недоступна - пропущено)",
        true,
        true,
      );
    }
  } finally {
    restoreUI();
    console.log("=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===");
  }
});
