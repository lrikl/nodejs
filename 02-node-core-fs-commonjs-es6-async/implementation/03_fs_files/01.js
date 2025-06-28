// Task 01

// Створіть анонімний модуль у цьому файлі, який приймає аргумент — назву файлу. Модуль повертає вміст цього файлу.

// Приклад аргумента: 'test.file'

'use strict';

const fs = require('fs/promises');

module.exports = (fileName) => fs.readFile(fileName, 'utf8');



