// Task 01

// Створіть анонімний модуль у цьому файлі, який приймає назву теки та повертає абсолютний шлях до неї. Вважаємо, що тека завжди існує. Вона розташована в поточній директорії.

// Прикладом теки є тека test_folder.
'use strict';

const path = require('path');

module.exports = (tekaName) => path.join(__dirname, tekaName);



