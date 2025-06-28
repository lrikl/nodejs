// Task 09

// Створіть модуль clearArray, який приймає масив (array) як аргумент і повертає новий масив, у якому залишаються лише елементи типів number та boolean.
// Використовуйте синтаксис ES6.

// export default (array) => array.filter(item => typeof item === 'number' || typeof item === 'boolean');
export default (array) => array.filter(item => ['number', 'boolean'].includes(typeof item));