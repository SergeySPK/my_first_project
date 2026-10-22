// ЗАДАЧА 2.1: Функции для работы с числами
// Временная сложность: O(sqrt(n)) - так как цикл идет до корня из числа
function isPrime(number) {
  if (number <= 1) return false;
  if (number === 2) return true;
  if (number % 2 === 0) return false;

  const sqrt = Math.sqrt(number);
  for (let i = 3; i <= sqrt; i += 2) {
    if (number % i === 0) return false;
  }
  return true;
}

// Временная сложность: O(n)
function factorial(n) {
  if (n < 0) return "Ошибка: отрицательное число";
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Временная сложность: O(n)
function fibonacci(n) {
  if (n === 0) return [];
  if (n === 1) return [0];

  const arr = [0, 1];
  for (let i = 2; i < n; i++) {
    arr.push(arr[i - 1] + arr[i - 2]);
  }
  return arr;
}

// Временная сложность: O(log(min(a, b))) - алгоритм Евклида
function gcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// ЗАДАЧА 2.2: Функции для работы со строками
// Временная сложность: O(n)
function isPalindrome(str) {
  // Убираем пробелы и приводим к нижнему регистру
  let cleanStr = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== " ") {
      cleanStr += str[i].toLowerCase();
    }
  }

  // Проверяем на палиндром
  let left = 0;
  let right = cleanStr.length - 1;
  while (left < right) {
    if (cleanStr[left] !== cleanStr[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

// Временная сложность: O(n)
function countVowels(str) {
  const vowels = "аеёиоуыэюяaeiou";
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (vowels.includes(str[i].toLowerCase())) {
      count++;
    }
  }
  return count;
}

// Временная сложность: O(n)
function reverseString(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

// Временная сложность: O(n)
function findLongestWord(sentence) {
  // Разбиваем строку на слова вручную (без split)
  let words = [];
  let currentWord = "";

  for (let i = 0; i < sentence.length; i++) {
    if (sentence[i] === " ") {
      if (currentWord.length > 0) {
        words.push(currentWord);
        currentWord = "";
      }
    } else {
      currentWord += sentence[i];
    }
  }
  if (currentWord.length > 0) words.push(currentWord);

  // Ищем самое длинное
  let longest = "";
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > longest.length) {
      longest = words[i];
    }
  }
  return longest;
}

// ЗАДАЧА 2.3: Функции для работы с массивами
// Временная сложность: O(n)
function findMax(arr) {
  if (arr.length === 0) return undefined;
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

// Временная сложность: O(n^2) - из-за вложенного цикла проверки includes
function removeDuplicates(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!result.includes(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
}

// Временная сложность: O(n^2) - квадратичная
function bubbleSort(arr) {
  const result = [...arr]; // Копируем, чтобы не менять исходный
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (result[j] > result[j + 1]) {
        // Меняем местами
        let temp = result[j];
        result[j] = result[j + 1];
        result[j + 1] = temp;
      }
    }
  }
  return result;
}

// Временная сложность: O(log n) - логарифмическая
function binarySearch(sortedArr, target) {
  let left = 0;
  let right = sortedArr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (sortedArr[mid] === target) {
      return mid;
    } else if (sortedArr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

// ЗАДАЧА 2.4: Утилитарные функции
// Временная сложность: O(n)
function formatCurrency(amount, currency = "₽") {
  let amountStr = amount.toFixed(2); // Оставляем 2 знака после запятой
  let parts = amountStr.split(".");
  let intPart = parts[0];
  let decPart = parts[1];

  let formattedInt = "";
  let count = 0;

  // Идем с конца, чтобы расставить пробелы
  for (let i = intPart.length - 1; i >= 0; i--) {
    formattedInt = intPart[i] + formattedInt;
    count++;
    if (count === 3 && i !== 0) {
      formattedInt = " " + formattedInt;
      count = 0;
    }
  }

  return formattedInt + "." + decPart + " " + currency;
}

// Временная сложность: O(n)
function isValidEmail(email) {
  // Простая регулярка для проверки наличия @ и точки
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Временная сложность: O(n), где n - длина пароля
function generatePassword(length = 8) {
  if (length < 4) {
    return "Ошибка: минимальная длина пароля — 4 символа";
  }

  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+";

  const allChars = uppercase + lowercase + numbers + symbols;

  // Добавляем по одному символу каждого типа
  const passwordChars = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    lowercase[Math.floor(Math.random() * lowercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  // Добираем остальные символы до нужной длины
  for (let i = passwordChars.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    passwordChars.push(allChars[randomIndex]);
  }

  // Перемешиваем, чтобы символы не стояли строго в начале
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
}
