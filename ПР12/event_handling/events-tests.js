function runTest(testName, actual, expected) {
  let isEqual =
    typeof actual === "object" && actual !== null
      ? JSON.stringify(actual) === JSON.stringify(expected)
      : actual === expected;

  const container = document.getElementById("test-container");
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

window.addEventListener("load", function () {
  console.log("=== ЗАПУСК ТЕСТОВ ПР12 ===");

  // Тест 1: Проверка создания кастомного события
  const customEvent = new CustomEvent("testEvent", { detail: { test: true } });
  runTest("CustomEvent создается с detail", customEvent.detail.test, true);

  // Тест 2: Проверка createDebounce (Асинхронный)
  let debounceCallCount = 0;
  const debouncedFn = createDebounce(() => {
    debounceCallCount++;
  }, 100);

  // Имитируем 3 быстрых клика
  debouncedFn();
  debouncedFn();
  debouncedFn();

  // Сразу после вызова флаг должен быть 0 (debounce ждет)
  runTest("Debounce не вызывает функцию сразу", debounceCallCount, 0);

  // Проверяем через 150мс (больше задержки в 100мс)
  setTimeout(() => {
    runTest(
      "Debounce срабатывает 1 раз после серии кликов",
      debounceCallCount,
      1,
    );
  }, 150);

  // Тест 3: Проверка createThrottle
  let throttleCount = 0;
  const throttledFn = createThrottle(() => {
    throttleCount++;
  }, 100);

  throttledFn(); // Первый вызов - сработает
  throttledFn(); // Второй - заблокирован
  throttledFn(); // Третий - заблокирован

  runTest("Throttle срабатывает только 1 раз за интервал", throttleCount, 1);

  // Тест 4: Проверка логики добавления элемента (симуляция)
  const initialItems = document.querySelectorAll("#item-list .item").length;
  addNewItem();
  const afterAddItems = document.querySelectorAll("#item-list .item").length;
  runTest(
    "addNewItem увеличивает количество элементов",
    afterAddItems,
    initialItems + 1,
  );

  // Тест 5: Проверка preventFormSubmit (симуляция)
  // Создаем фейковый объект события
  let preventDefaultCalled = false;
  const fakeEvent = {
    preventDefault: () => {
      preventDefaultCalled = true;
    },
  };
  const input = document.getElementById("form-input");
  input.value = "Тест";

  preventFormSubmit(fakeEvent);
  runTest(
    "preventFormSubmit вызывает preventDefault",
    preventDefaultCalled,
    true,
  );
  runTest("preventFormSubmit очищает поле после успеха", input.value, "");

  document.getElementById("prevention-output").innerHTML =
    "Здесь будет результат";
  document.getElementById("prevent-link").href = "https://example.com";

  console.log("=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===");
});
