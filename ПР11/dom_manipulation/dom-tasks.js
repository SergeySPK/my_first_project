// ЗАДАНИЕ 1: Создание и вставка элементов
function createCard(title, content) {
    const target = document.getElementById('target1');
    
    // Создаём контейнер
    const card = document.createElement('div');
    card.className = 'card';
    card.style.border = '1px solid #ccc';
    card.style.padding = '10px';
    card.style.margin = '10px 0';
    
    // Создаём заголовок
    const h4 = document.createElement('h4');
    h4.textContent = title;
    
    // Создаём текст
    const p = document.createElement('p');
    p.textContent = content;
    
    // Собираем карточку
    card.appendChild(h4);
    card.appendChild(p);
    
    // Добавляем в target1
    target.appendChild(card);
}

function createList(items) {
    const target = document.getElementById('target1');
    
    const ol = document.createElement('ol');
    ol.className = 'created-list';
    
    for (let i = 0; i < items.length; i++) {
        const li = document.createElement('li');
        li.textContent = items[i];
        ol.appendChild(li);
    }
    
    target.appendChild(ol);
}


// ЗАДАНИЕ 2: Навигация по DOM
function countChildren() {
    const parent = document.getElementById('parent-element');
    return parent.children.length;
}

function findSpecialChild() {
    const special = document.querySelector('#parent-element .special');
    return special ? special.textContent.trim() : "Не найдено";
}

function getParentBackground() {
    const child = document.querySelector('.child');
    // Получаем цвет фона родителя
    return child.parentElement.style.backgroundColor;
}


// ЗАДАНИЕ 3: Работа с классами и стилями
function setupStyleToggle() {
    const btn = document.getElementById('toggle-style');
    const target = document.getElementById('style-target');
    
    btn.addEventListener('click', function() {
        target.classList.toggle('active-style');
    });
}

function changeHeaderColor() {
    const header = document.getElementById('main-header');
    // Генерируем случайный цвет
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    header.style.background = randomColor;
}

function animateElement() {
    const target = document.getElementById('style-target');
    // Добавляем класс с анимацией
    target.classList.add('animated');
    
    // Убираем класс через 2 секунды, чтобы можно было анимировать снова
    setTimeout(function() {
        target.classList.remove('animated');
    }, 2000);
}


// ЗАДАНИЕ 4: Обработка событий
function setupClickCounter() {
    const btn = document.getElementById('click-btn');
    const counterDisplay = document.getElementById('click-counter');
    let count = 0;
    
    btn.addEventListener('click', function() {
        count++;
        counterDisplay.textContent = count;
    });
}

function setupInputDisplay() {
    const input = document.getElementById('text-input');
    const display = document.getElementById('input-display');
    
    input.addEventListener('input', function(event) {
        display.textContent = event.target.value;
    });
}

function setupKeyboardEvents() {
    // Обработка нажатия клавиши (keydown)
    document.addEventListener('keydown', function(event) {
        console.log('keydown: Код:', event.code, 'Символ:', event.key);
    });

    // Обработка отпускания клавиши (keyup)
    document.addEventListener('keyup', function(event) {
        console.log('keyup: Код:', event.code, 'Символ:', event.key);
    });
}


// ЗАДАНИЕ 5: Динамические списки
function addListItem() {
    const input = document.getElementById('item-input');
    const list = document.getElementById('dynamic-list');
    const text = input.value.trim();
    
    if (text === '') return; // Не добавляем пустые элементы
    
    const li = document.createElement('li');
    li.className = 'list-item';
    
    const span = document.createElement('span');
    span.textContent = text;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.className = 'delete-btn';
    
    li.appendChild(span);
    li.appendChild(deleteBtn);
    
    list.appendChild(li);
    input.value = '';
}

function removeListItem(event) {
    // Проверяем, что клик был по кнопке удаления
    if (event.target.classList.contains('delete-btn')) {
        const li = event.target.parentElement;
        li.remove();
    }
}

function clearList() {
    const list = document.getElementById('dynamic-list');
    list.innerHTML = '';
}

function setupListEvents() {
    document.getElementById('btn-add-item').addEventListener('click', addListItem);
    document.getElementById('btn-clear-list').addEventListener('click', clearList);
    
    // Обработка нажатия Enter в поле ввода
    const input = document.getElementById('item-input');
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addListItem();
        }
    });
    
    // Делегирование событий для кнопок удаления
    const list = document.getElementById('dynamic-list');
    list.addEventListener('click', removeListItem);
}

// ЗАДАНИЕ 6: Работа с формами
function validateForm(formData) {
    const errors = {};
    
    // Проверка имени (минимум 2 символа)
    if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Имя должно содержать минимум 2 символа';
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = 'Некорректный email';
    }
    
    // Проверка возраста (должен быть больше 0)
    if (!formData.age || isNaN(formData.age) || Number(formData.age) <= 0) {
        errors.age = 'Возраст должен быть положительным числом';
    }
    
    // Проверка чекбокса
    if (!formData.agree) {
        errors.agree = 'Вы должны согласиться с условиями';
    }
    
    return errors;
}

function displayFormErrors(errors) {
    const output = document.getElementById('form-output');
    output.innerHTML = ''; // Очищаем предыдущие результаты
    
    for (const key in errors) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errors[key];
        output.appendChild(errorDiv);
    }
}

function displayFormSuccess(userData) {
    const output = document.getElementById('form-output');
    output.innerHTML = ''; // Очищаем предыдущие результаты
    
    // Создаём контейнер для сообщения
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    
    // Создаём заголовок
    const title = document.createElement('strong');
    title.textContent = 'Форма успешно отправлена!';
    successDiv.appendChild(title);
    successDiv.appendChild(document.createElement('br'));
    
    // Добавляем данные пользователя безопасно через текстовые узлы
    successDiv.appendChild(document.createTextNode(`Имя: ${userData.name}`));
    successDiv.appendChild(document.createElement('br'));
    successDiv.appendChild(document.createTextNode(`Email: ${userData.email}`));
    successDiv.appendChild(document.createElement('br'));
    successDiv.appendChild(document.createTextNode(`Возраст: ${userData.age}`));
    
    output.appendChild(successDiv);
}

function handleFormSubmit(event) {
    event.preventDefault(); // Отменяем стандартную отправку
    
    // Собираем данные
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        agree: document.getElementById('agree').checked
    };
    
    // Валидация
    const errors = validateForm(formData);
    
    // Проверяем, есть ли ошибки
    let hasErrors = false;
    for (const key in errors) {
        hasErrors = true;
        break;
    }
    
    if (hasErrors) {
        displayFormErrors(errors);
    } else {
        displayFormSuccess(formData);
        document.getElementById('user-form').reset(); // Очищаем форму
    }
}

function setupForm() {
    const form = document.getElementById('user-form');
    form.addEventListener('submit', handleFormSubmit);
}


// Инициализация всех обработчиков при загрузке
function initializeApp() {
    // Задача 1
    document.getElementById('btn-create-card').addEventListener('click', function() {
        createCard('Моя карточка', 'Это текст внутри карточки, созданной через JS.');
    });
    document.getElementById('btn-create-list').addEventListener('click', function() {
        createList(['Первый элемент', 'Второй элемент', 'Третий элемент']);
    });

    // Задача 2
    document.getElementById('btn-nav-test').addEventListener('click', function() {
        alert('Дочерних элементов: ' + countChildren() + 
              '\nОсобый элемент: ' + findSpecialChild() + 
              '\nЦвет родителя: ' + getParentBackground());
    });

    // Задача 3
    setupStyleToggle();
    document.getElementById('btn-change-header').addEventListener('click', changeHeaderColor);
    document.getElementById('btn-animate').addEventListener('click', animateElement);

    // Задача 4
    setupClickCounter();
    setupInputDisplay();
    setupKeyboardEvents();

    // Задача 5
    setupListEvents();

    // Задача 6
    setupForm();
    
    console.log('Приложение инициализировано. Все обработчики событий назначены.');
}

// Запускаем инициализацию после загрузки DOM
document.addEventListener('DOMContentLoaded', initializeApp);