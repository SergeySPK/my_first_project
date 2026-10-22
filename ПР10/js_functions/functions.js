// ЧАСТЬ 2: Основные задания
// Сумма любого количества аргументов
function sum(...numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total;
}

// Создание пользователя с деструктуризацией
function createUser({ name, age, email = "не указан" }) {
  return `Пользователь: ${name}, возраст: ${age}, email: ${email}`;
}

// Замыкание для секретного сообщения
function secretMessage(password, message) {
  return function (inputPassword) {
    if (inputPassword === password) {
      return message;
    } else {
      return "Доступ запрещен";
    }
  };
}

// ЧАСТЬ 3: Рекурсия и функции высшего порядка
// Рекурсивная функция: факториал
function factorial(n) {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error(
      "Факториал определён только для целых неотрицательных чисел",
    );
  }

  if (n === 0 || n === 1) {
    return 1;
  }

  return n * factorial(n - 1);
}

// Композиция функций (справа налево)
function compose(...functions) {
  return function (initialValue) {
    let result = initialValue;

    // Идем с конца массива функций
    for (let i = functions.length - 1; i >= 0; i--) {
      result = functions[i](result);
    }

    return result;
  };
}

// Собственная реализация map
function myMap(array, callback) {
  const result = [];

  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }

  return result;
}

// Собственная реализация filter
function myFilter(array, callback) {
  const result = [];

  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      result.push(array[i]);
    }
  }

  return result;
}

// Собственная реализация reduce
function myReduce(array, callback, initialValue) {
  let accumulator;
  let startIndex;

  // Проверяем, передан ли initialValue
  if (initialValue !== undefined) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // Если массив пуст и нет начального значения - ошибка
    if (array.length === 0) {
      throw new Error("Reduce of empty array with no initial value");
    }

    accumulator = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < array.length; i++) {
    accumulator = callback(accumulator, array[i], i, array);
  }

  return accumulator;
}

// ЧАСТЬ 4: Сложно, но важно
// Каррирование
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

// Мемоизация
function memoize(fn) {
  const cache = {}; // Объект для кэша

  return function (...args) {
    const key = JSON.stringify(args); // Создаем ключ из аргументов

    if (key in cache) {
      return cache[key];
    }

    const result = fn.apply(this, args);
    cache[key] = result;

    return result;
  };
}

// Дебаунсинг (откладывает вызов, пока не пройдет пауза)
function debounce(fn, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Троттлинг (ограничивает частоту вызовов)
function throttle(fn, interval) {
  let isWaiting = false;

  return function (...args) {
    if (!isWaiting) {
      fn.apply(this, args);
      isWaiting = true;

      setTimeout(() => {
        isWaiting = false;
      }, interval);
    }
  };
}

// Функция-валидатор
function createValidator(options) {
  return function (str) {
    if (options.minLength && str.length < options.minLength) {
      return false;
    }

    if (options.hasDigit && !/[0-9]/.test(str)) {
      return false;
    }

    if (options.hasUppercase && !/[A-Z]/.test(str)) {
      return false;
    }

    return true;
  };
}
