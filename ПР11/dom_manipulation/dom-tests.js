// Функция для вывода тестов
function runTest(testName, actual, expected) {
    let isEqual = (typeof actual === 'object' && actual !== null) 
        ? JSON.stringify(actual) === JSON.stringify(expected)
        : actual === expected;

    const container = document.getElementById('test-container');
    
    const card = document.createElement('div');
    card.className = `test-card ${isEqual ? 'pass' : 'fail'}`;
    
    card.innerHTML = `
        <div class="test-header">
            <span class="test-name">${testName}</span>
            <span class="test-badge">${isEqual ? '✅ УСПЕХ' : '❌ ОШИБКА'}</span>
        </div>
        <div class="test-details-row">
            <strong>Ожидалось:</strong> ${JSON.stringify(expected)}<br>
            <strong>Получено:</strong> ${JSON.stringify(actual)}
        </div>
    `;
    
    container.appendChild(card);
    console.log(`${testName}:`, isEqual ? '✅ УСПЕХ' : '❌ ОШИБКА', {expected, actual});
}

// Запуск тестов после загрузки DOM
window.addEventListener('load', function() {
    console.log('=== ЗАПУСК ТЕСТОВ ПР11 ===');

    // ТЕСТ 1: Задача 1.1 - createCard
    document.getElementById('target1').innerHTML = '';
    createCard('Заголовок', 'Текст');
    const cardElement = document.querySelector('#target1 .card');
    runTest('createCard создает div.card', cardElement !== null, true);
    runTest('createCard добавляет заголовок', cardElement ? cardElement.querySelector('h4').textContent : null, 'Заголовок');

    // ТЕСТ 2: Задача 1.2 - createList
    document.getElementById('target1').innerHTML = '';
    createList(['A', 'B']);
    const listElement = document.querySelector('#target1 ol');
    runTest('createList создает список ol', listElement !== null, true);
    runTest('createList добавляет элементы li', listElement.children.length, 2);

    // ТЕСТ 3: Задача 2.1 - countChildren
    // В HTML у #parent-element 3 дочерних div
    runTest('countChildren возвращает 3', countChildren(), 3);

    // ТЕСТ 4: Задача 2.2 - findSpecialChild
    runTest('findSpecialChild находит текст', findSpecialChild(), 'Особый дочерний элемент');

    // ТЕСТ 5: Задача 2.3 - getParentBackground
    // Проверяем, что функция возвращает цвет (в HTML задан inline style)
    runTest('getParentBackground возвращает цвет', getParentBackground(), 'rgb(52, 152, 219)');

    // ТЕСТ 6: Задача 6.1 - validateForm (Валидные данные)
    const validData = { name: 'Иван', email: 'test@test.ru', age: '25', agree: true };
    const validErrors = validateForm(validData);
    let hasErrors = false;
    for (let key in validErrors) { hasErrors = true; break; }
    runTest('validateForm (валидные данные)', hasErrors, false);

    // ТЕСТ 7: Задача 6.1 - validateForm (Невалидные данные)
    const invalidData = { name: 'И', email: 'test', age: '-5', agree: false };
    const invalidErrors = validateForm(invalidData);
    runTest('validateForm (невалидное имя)', typeof invalidErrors.name, 'string');
    runTest('validateForm (невалидный email)', typeof invalidErrors.email, 'string');
    runTest('validateForm (невалидный возраст)', typeof invalidErrors.age, 'string');
    runTest('validateForm (чекбокс не нажат)', typeof invalidErrors.agree, 'string');

    // ТЕСТ 8: Задача 5 - Динамический список (симуляция)
    const list = document.getElementById('dynamic-list');
    list.innerHTML = ''; // Очистка
    const input = document.getElementById('item-input');
    input.value = 'Тестовый элемент';
    addListItem();
    runTest('addListItem добавляет li', list.children.length, 1);
    runTest('addListItem очищает input', input.value, '');

    // Тест clearList
    clearList();
    runTest('clearList очищает список', list.children.length, 0);

    console.log('=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');
});