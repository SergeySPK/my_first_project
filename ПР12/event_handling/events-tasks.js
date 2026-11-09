// ЗАДАНИЕ 1: Базовые обработчики событий
function handleBasicClick(event) {
  const output = document.getElementById("basic-output");
  const btn = event.target;

  output.innerHTML = `
        <strong>Событие:</strong> ${event.type}<br>
        <strong>Координаты:</strong> X: ${event.clientX}, Y: ${event.clientY}<br>
        <strong>Target:</strong> ${event.target.tagName} (id: ${event.target.id})
    `;

  // Добавляем анимацию
  btn.classList.add("pulse");
  setTimeout(() => btn.classList.remove("pulse"), 500);
}

function handleMouseEvents(event) {
  const colorBox = document.getElementById("color-box");
  const mouseOutput = document.getElementById("mouse-output");

  if (event.type === "mouseenter") {
    colorBox.style.background = "#e74c3c";
  } else if (event.type === "mouseleave") {
    colorBox.style.background = "#3498db";
  } else if (event.type === "mousemove") {
    mouseOutput.textContent = `Координаты мыши: X: ${event.offsetX}, Y: ${event.offsetY}`;
  }
}

function setupBasicEvents() {
  document
    .getElementById("basic-btn")
    .addEventListener("click", handleBasicClick);

  const colorBox = document.getElementById("color-box");
  colorBox.addEventListener("mouseenter", handleMouseEvents);
  colorBox.addEventListener("mouseleave", handleMouseEvents);
  colorBox.addEventListener("mousemove", handleMouseEvents);
}

// ЗАДАНИЕ 2: События клавиатуры
function handleKeyEvents(event) {
  const output = document.getElementById("key-output");

  // Предотвращение стандартных действий
  if (
    (event.ctrlKey && event.code === "KeyS") ||
    (event.altKey && event.code === "KeyC") ||
    (event.shiftKey && event.code === "KeyA")
  ) {
    event.preventDefault();
    output.innerHTML = `<span style="color: #e74c3c; font-weight: bold;">Перехвачена комбинация: ${event.ctrlKey ? "Ctrl+" : ""}${event.altKey ? "Alt+" : ""}${event.shiftKey ? "Shift+" : ""}${event.key}</span>`;
    return;
  }

  output.innerHTML = `
        <strong>Клавиша:</strong> ${event.key} | 
        <strong>Код:</strong> ${event.code} | 
        <strong>Ctrl:</strong> ${event.ctrlKey} | 
        <strong>Alt:</strong> ${event.altKey} | 
        <strong>Shift:</strong> ${event.shiftKey}
    `;
}

function setupKeyboardEvents() {
  const input = document.getElementById("key-input");
  input.addEventListener("keydown", handleKeyEvents);
  input.addEventListener("keyup", () => {
    const output = document.getElementById("key-output");
    // Если это не было перехваченной комбинацией, сбрасываем текст
    if (!output.innerHTML.includes("Перехвачена")) {
      output.innerHTML = `<span style="color: #888;">Клавиша отпущена. Ожидание ввода...</span>`;
    }
  });
}

// ЗАДАНИЕ 3: Делегирование событий
function handleDelegationClick(event) {
  const target = event.target;
  const item = target.closest(".item");

  // Если кликнули на кнопку удаления
  if (target.classList.contains("delete")) {
    if (item) item.remove();
  }
  // Если кликнули на сам элемент
  else if (item) {
    item.classList.toggle("selected");
  }

  // Обновляем счетчик выбранных
  const selectedCount = document.querySelectorAll(".item.selected").length;
  document.getElementById("delegation-output").textContent =
    `Выбрано элементов: ${selectedCount}`;
}

function addNewItem() {
  const list = document.getElementById("item-list");
  const newId = Date.now(); // Уникальный ID

  const item = document.createElement("div");
  item.className = "item";
  item.dataset.id = newId;

  item.innerHTML = `
        <span>Элемент ${newId.toString().slice(-4)}</span>
        <span class="delete">Удалить</span>
    `;

  list.appendChild(item);
}

function setupDelegationEvents() {
  const list = document.getElementById("item-list");
  list.addEventListener("click", handleDelegationClick);

  document.getElementById("add-item-btn").addEventListener("click", addNewItem);
}

// ЗАДАНИЕ 4: Предотвращение поведения
function preventLinkDefault(event) {
  event.preventDefault(); // Отменяем переход

  document.getElementById("prevention-output").innerHTML = `
        <span style="color: #e74c3c;">Переход по ссылке отменен!</span><br>
        <small style="color: #555;">Текущий адрес в href: <strong>${event.target.href}</strong></small>
    `;

  event.target.classList.add("shake");
  setTimeout(() => event.target.classList.remove("shake"), 300);
}

function preventFormSubmit(event) {
  event.preventDefault(); // Отменяем отправку формы

  const input = document.getElementById("form-input");
  const output = document.getElementById("prevention-output");
  const link = document.getElementById("prevent-link");
  const inputValue = input.value.trim();

  // Проверяем только на пустоту
  if (inputValue === "") {
    output.innerHTML = `<span style="color: #e74c3c;">Ошибка: Поле не должно быть пустым!</span>`;
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 300);
  } else {
    // Просто записываем то, что ввел пользователь, прямо в href
    link.href = inputValue;

    output.innerHTML = `<span style="color: #28a745;">Успех! Атрибут href обновлен на: <strong>${inputValue}</strong></span>`;
    input.value = ""; // Очищаем поле
  }
}

function setupPreventionEvents() {
  document
    .getElementById("prevent-link")
    .addEventListener("click", preventLinkDefault);
  document
    .getElementById("prevent-form")
    .addEventListener("submit", preventFormSubmit);
}

// ЗАДАНИЕ 5: Кастомные события
function triggerCustomEvent() {
  const event = new CustomEvent("customAction", {
    detail: { message: "Привет от кастомного события!" },
  });
  document.dispatchEvent(event);
}

function handleCustomEvent(event) {
  const output = document.getElementById("custom-output");
  output.textContent = `Получено: ${event.detail.message}`;

  const btn = document.getElementById("trigger-custom");
  btn.classList.add("pulse");
  setTimeout(() => btn.classList.remove("pulse"), 500);
}

function setupMultipleListeners() {
  // Добавляем 3 слушателя для одного события
  document.addEventListener("customAction", () =>
    console.log("Слушатель 1: Событие поймано!"),
  );
  document.addEventListener("customAction", () =>
    console.log("Слушатель 2: Данные получены."),
  );
  document.addEventListener("customAction", () =>
    console.log("Слушатель 3: Работа завершена."),
  );

  // Вместо alert выводим сообщение в интерфейс
  document.getElementById("custom-output").innerHTML =
    "Добавлено 3 слушателя. Нажмите 'Запустить кастомное событие' и посмотрите в консоль (F12).";
}

function setupCustomEvents() {
  document.addEventListener("customAction", handleCustomEvent);
  document
    .getElementById("trigger-custom")
    .addEventListener("click", triggerCustomEvent);
  document
    .getElementById("multiple-listeners")
    .addEventListener("click", setupMultipleListeners);
}

// ЗАДАНИЕ 6: Загрузка и ошибки
function loadImageWithEvents() {
  const container = document.getElementById("image-container");
  const output = document.getElementById("loading-output");

  container.innerHTML = ""; // Очистка
  output.textContent = "Статус загрузки: Начало...";

  const img = document.createElement("img");

  img.addEventListener(
    "loadstart",
    () => (output.textContent = "Статус загрузки: Загрузка..."),
  );
  img.addEventListener(
    "load",
    () => (output.textContent = "Статус загрузки: Успешно загружено!"),
  );
  img.addEventListener(
    "error",
    () => (output.textContent = "Статус загрузки: Ошибка загрузки!"),
  );
  img.addEventListener("loadend", () =>
    console.log("Процесс загрузки завершен (успех или ошибка)."),
  );

  // Используем сервис для случайных картинок
  img.src = "https://picsum.photos/300/200?random=" + Date.now();

  container.appendChild(img);
}

function simulateLoadError() {
  const container = document.getElementById("image-container");
  const output = document.getElementById("loading-output");

  container.innerHTML = "";
  output.textContent = "Статус загрузки: Попытка загрузить битую ссылку...";

  const img = document.createElement("img");
  img.addEventListener(
    "load",
    () => (output.textContent = "Статус загрузки: Успешно (неожиданно)"),
  );
  img.addEventListener(
    "error",
    () =>
      (output.textContent = "Статус загрузки: Ошибка! (как и планировалось)"),
  );

  img.src = "https://invalid-url-for-testing.com/image.jpg";
  container.appendChild(img);
}

function setupLoadingEvents() {
  document
    .getElementById("load-image")
    .addEventListener("click", loadImageWithEvents);
  document
    .getElementById("load-error")
    .addEventListener("click", simulateLoadError);
}

// ЗАДАНИЕ 7: Таймеры и оптимизация
let timerInterval;
let timerValue = 0;

function startTimer() {
  if (timerInterval) return; // Защита от множественного запуска

  timerInterval = setInterval(() => {
    timerValue++;
    document.getElementById("timer-output").textContent =
      `Таймер: ${timerValue}с`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerValue = 0;
  document.getElementById("timer-output").textContent = `Таймер: 0с`;
}

function createDebounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function createThrottle(func, interval) {
  let isWaiting = false;
  return function (...args) {
    if (!isWaiting) {
      func.apply(this, args);
      isWaiting = true;
      setTimeout(() => (isWaiting = false), interval);
    }
  };
}

const debouncedUpdate = createDebounce(() => {
  document.getElementById("async-output").textContent =
    "Debounce: Выполнено! (Прошло 1 сек после последнего клика)";
}, 1000);

const throttledUpdate = createThrottle(() => {
  document.getElementById("async-output").textContent =
    `Throttle: Выполнено! (Время: ${new Date().toLocaleTimeString()})`;
}, 1000);

function testDebounce() {
  document.getElementById("async-output").textContent =
    "Debounce: Нажмите кнопку несколько раз быстро...";
  debouncedUpdate(); // Вызываем уже созданную функцию
}

function testThrottle() {
  document.getElementById("async-output").textContent =
    "Throttle: Нажмите кнопку несколько раз быстро...";
  throttledUpdate(); // Вызываем уже созданную функцию
}

function setupTimerEvents() {
  document.getElementById("start-timer").addEventListener("click", startTimer);
  document.getElementById("stop-timer").addEventListener("click", stopTimer);
  document
    .getElementById("debounce-btn")
    .addEventListener("click", testDebounce);
  document
    .getElementById("throttle-btn")
    .addEventListener("click", testThrottle);
}

// ИНИЦИАЛИЗАЦИЯ
function initializeEventHandler() {
  setupBasicEvents();
  setupKeyboardEvents();
  setupDelegationEvents();
  setupPreventionEvents();
  setupCustomEvents();
  setupLoadingEvents();
  setupTimerEvents();
  console.log("Все обработчики событий инициализированы!");
}

document.addEventListener("DOMContentLoaded", initializeEventHandler);
