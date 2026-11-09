(function () {
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };
  const originalDisplayOutput = window.displayOutput;
  const originalUpdateProgress = window.updateProgress;
  const originalSetLoadingState = window.setLoadingState;
  const originalGetElementById = document.getElementById;

  const results = [];

  function record(testName, actual, expected) {
    const isEqual =
      typeof actual === "object" && actual !== null
        ? JSON.stringify(actual) === JSON.stringify(expected)
        : actual === expected;

    results.push({ testName, isEqual, actual, expected });
  }

  async function runTests() {
    // Показываем сообщение, что тесты пошли (объявляем testContainer ОДИН раз тут)
    const testContainer = document.getElementById("test-container");
    if (testContainer) {
      testContainer.innerHTML =
        '<p style="text-align:center; color:#6b7280; font-weight:bold;">⏳ Выполнение тестов (ожидание асинхронных операций)...</p>';
    }

    // На время тестов подавляем весь вывод в консоль и в UI
    console.log = console.warn = console.error = () => {};
    window.displayOutput = () => {};
    window.updateProgress = () => {};
    window.setLoadingState = () => {};

    // Для fetchUsers подменяем #api-data на отсоединённый контейнер,
    // чтобы карточки не появлялись на экране
    const detachedApiData = document.createElement("div");
    document.getElementById = function (id) {
      if (id === "api-data") return detachedApiData;
      return originalGetElementById.call(document, id);
    };

    const originalFetch = window.fetch;

    try {
      // 1. createBasicPromise(true)
      try {
        const promiseRes = await createBasicPromise(true);
        record(
          'createBasicPromise(true) возвращает "Успех!"',
          promiseRes,
          "Успех!",
        );
      } catch (e) {
        record(
          'createBasicPromise(true) возвращает "Успех!"',
          e.message,
          "Успех!",
        );
      }

      // 2. createBasicPromise(false)
      try {
        await createBasicPromise(false);
        record("createBasicPromise(false) выбрасывает ошибку", false, true);
      } catch (error) {
        record(
          "createBasicPromise(false) выбрасывает ошибку",
          error.message,
          "Ошибка!",
        );
      }

      // 3. createPromiseChain
      try {
        const chainRes = await createPromiseChain();
        record(
          "createPromiseChain возвращает результат с Шагом 3",
          typeof chainRes === "string" && chainRes.includes("Шаг 3"),
          true,
        );
      } catch (e) {
        record(
          "createPromiseChain возвращает результат с Шагом 3",
          e.message,
          true,
        );
      }

      // 4. delayWithPromise
      const start = Date.now();
      await delayWithPromise(200);
      const duration = Date.now() - start;
      record(
        "delayWithPromise(200) ждет ~200мс",
        duration >= 180 && duration < 500,
        true,
      );

      // 5. Promise.allSettled
      const promises = [Promise.resolve(1), Promise.reject(2)];
      const settled = await Promise.allSettled(promises);
      record("Promise.allSettled возвращает 2 результата", settled.length, 2);
      record("Первый промис fulfilled", settled[0].status, "fulfilled");
      record("Второй промис rejected", settled[1].status, "rejected");

      // 6. createRequestCache
      let fetchCount = 0;
      window.fetch = async (url) => {
        fetchCount++;
        return {
          ok: true,
          json: async () => ({ url, data: "test" }),
        };
      };

      try {
        const cachedRequest = createRequestCache();
        const r1 = await cachedRequest("https://example.com/test");
        const r2 = await cachedRequest("https://example.com/test");
        record(
          "createRequestCache делает только 1 сетевой запрос",
          fetchCount,
          1,
        );
        record(
          "createRequestCache возвращает одинаковые данные",
          JSON.stringify(r1) === JSON.stringify(r2),
          true,
        );
      } catch (e) {
        record(
          "createRequestCache делает только 1 сетевой запрос",
          e.message,
          1,
        );
      } finally {
        window.fetch = originalFetch;
      }

      // 7. retryWithBackoff: успех после 2 ошибок
      let attempts = 0;
      try {
        const retryResult = await retryWithBackoff(
          async () => {
            attempts++;
            if (attempts < 3) throw new Error("Временная ошибка");
            return "OK";
          },
          3,
          10,
        );
        record(
          "retryWithBackoff возвращает успех после повторов",
          retryResult,
          "OK",
        );
        record("retryWithBackoff сделал 3 попытки", attempts, 3);
      } catch (e) {
        record(
          "retryWithBackoff возвращает успех после повторов",
          e.message,
          "OK",
        );
      }

      // 8. retryWithBackoff: исчерпание попыток
      let failAttempts = 0;
      try {
        await retryWithBackoff(
          async () => {
            failAttempts++;
            throw new Error("Постоянная ошибка");
          },
          2,
          10,
        );
        record("retryWithBackoff бросает ошибку после maxRetries", false, true);
      } catch (e) {
        record(
          "retryWithBackoff бросает ошибку после maxRetries",
          e.message,
          "Постоянная ошибка",
        );
        record("retryWithBackoff сделал 2 попытки", failAttempts, 2);
      }

      // 9. demonstratePromiseAll
      try {
        const allResults = await demonstratePromiseAll();
        record(
          "demonstratePromiseAll возвращает 5 результатов",
          allResults.length,
          5,
        );
      } catch (e) {
        record("demonstratePromiseAll возвращает 5 результатов", e.message, 5);
      }

      // 10. demonstratePromiseRace
      try {
        const raceWinner = await demonstratePromiseRace();
        record(
          "Promise.race возвращает быстрый промис",
          typeof raceWinner === "string" && raceWinner.includes("Быстрый"),
          true,
        );
      } catch (e) {
        record("Promise.race возвращает быстрый промис", e.message, true);
      }

      // 11. demonstratePromiseAllSettled
      try {
        const settledResults = await demonstratePromiseAllSettled();
        record(
          "allSettled: первый fulfilled",
          settledResults[0].status,
          "fulfilled",
        );
        record(
          "allSettled: второй rejected",
          settledResults[1].status,
          "rejected",
        );
      } catch (e) {
        record("allSettled: первый fulfilled", e.message, "fulfilled");
      }

      // 12. parallelAsyncExecution
      try {
        const parallelResults = await parallelAsyncExecution();
        record(
          "parallelAsyncExecution возвращает 3 результата",
          parallelResults.length,
          3,
        );
      } catch (e) {
        record("parallelAsyncExecution возвращает 3 результата", e.message, 3);
      }

      // 13. fetchUsers с замоканным fetch и отсоединённым контейнером
      window.fetch = async (url) => {
        if (url.includes("/users")) {
          return {
            ok: true,
            json: async () => [
              {
                id: 1,
                name: "Test User",
                email: "test@example.com",
                address: { city: "Test City" },
              },
            ],
          };
        }
        return { ok: false, status: 404, statusText: "Not Found" };
      };

      try {
        await fetchUsers();
        record(
          "fetchUsers отрисовывает 1 карточку",
          detachedApiData.children.length,
          1,
        );
        record(
          "fetchUsers содержит имя пользователя",
          detachedApiData.textContent.includes("Test User"),
          true,
        );
      } catch (e) {
        record("fetchUsers отрисовывает 1 карточку", e.message, 1);
      } finally {
        window.fetch = originalFetch;
      }

      // 14. testApiError с сетевой ошибкой
      let capturedApiError = null;
      window.displayOutput = (id, data, isError) => {
        if (id === "api-output") capturedApiError = { data, isError };
      };
      window.fetch = async () => {
        throw new Error("Network error");
      };

      try {
        await testApiError();
        record(
          "testApiError перехватывает сетевую ошибку",
          capturedApiError && capturedApiError.isError === true,
          true,
        );
      } catch (e) {
        record("testApiError перехватывает сетевую ошибку", e.message, true);
      } finally {
        window.fetch = originalFetch;
        window.displayOutput = () => {};
      }
    } finally {
      // Возвращаем всё как было
      document.getElementById = originalGetElementById;
      window.displayOutput = originalDisplayOutput;
      window.updateProgress = originalUpdateProgress;
      window.setLoadingState = originalSetLoadingState;
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
    }

    // Рендер результатов в UI (используем переменную testContainer, объявленную в начале)
    if (testContainer) {
      testContainer.innerHTML = ""; // Очищаем контейнер перед выводом

      results.forEach((r) => {
        const card = document.createElement("div");
        card.className = `test-card ${r.isEqual ? "pass" : "fail"}`;

        const header = document.createElement("div");
        header.className = "test-header";

        const title = document.createElement("span");
        title.textContent = r.testName;

        const badge = document.createElement("span");
        badge.className = "test-badge";
        badge.textContent = r.isEqual ? "PASS" : "FAIL";

        header.appendChild(title);
        header.appendChild(badge);
        card.appendChild(header);

        // Если тест провален, показываем детали (что ожидали, что получили)
        if (!r.isEqual) {
          const details = document.createElement("div");
          details.className = "test-details";
          const actualStr =
            typeof r.actual === "object"
              ? JSON.stringify(r.actual)
              : String(r.actual);
          const expectedStr =
            typeof r.expected === "object"
              ? JSON.stringify(r.expected)
              : String(r.expected);

          details.innerHTML = `<strong>Ожидалось:</strong> ${expectedStr}<br><strong>Получено:</strong> ${actualStr}`;
          card.appendChild(details);
        }

        testContainer.appendChild(card);
      });

      // Добавляем общий итог
      const passed = results.filter((r) => r.isEqual).length;
      const summary = document.createElement("h3");
      summary.textContent = `Итого: ${passed}/${results.length} тестов пройдено`;
      summary.style.textAlign = "center";
      summary.style.marginTop = "20px";
      summary.style.color = passed === results.length ? "#10b981" : "#ef4444";
      testContainer.appendChild(summary);
    }

    // Вывод в консоль (работает, так как finally уже восстановил оригинальный console.log)
    console.log("--- РЕЗУЛЬТАТЫ ТЕСТОВ ---");
    results.forEach((r) => {
      const status = r.isEqual ? "✅ PASS" : "❌ FAIL";
      console.log(`${status} | ${r.testName}`);

      if (!r.isEqual) {
        console.log(`   ⚠️ Ожидалось:`, r.expected);
        console.log(`   ❌ Получено:`, r.actual);
      }
    });
    const passedCount = results.filter((r) => r.isEqual).length;
    console.log(`\n📊 Итого: ${passedCount}/${results.length} тестов пройдено`);
  }

  window.addEventListener("load", runTests);
})();
