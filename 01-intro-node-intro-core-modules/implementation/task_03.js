// Task 03

// Створіть анонімний модуль, який реалізує функцію, що отримує масив чисел та повертає кількість елементів, які є більшими або дорівнюють нулю.
// Використовуйте синтаксис CommonJS.

module.exports = (arr) => arr.filter(item => item >= 0).length;
