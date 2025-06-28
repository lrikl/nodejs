// Task 05

// Створіть анонімний модуль у цьому файлі, який приймає назву теки та повертає кількість файлів у ній (теки не враховуємо).

// Приклад аргумента 'test_folder'
'use strict';

const fs = require('fs/promises');

module.exports = (tekaName) => {
    return fs.readdir(tekaName, { withFileTypes: true })
        .then(entries => entries.filter(item => item.isFile()).length)
        .catch(() => false);
}