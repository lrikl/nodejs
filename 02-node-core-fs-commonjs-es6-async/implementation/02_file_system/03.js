// Task 03

// Створіть анонімний модуль у цьому файлі, який приймає назву файлу та повертає його розмір. Якщо файл не існує — повертає 0.

// Приклад аргумента 'test_folder/one.txt'

'use strict';

const fs = require('fs/promises');

module.exports = async (fileName) => {
    try {
        const statFile = await fs.stat(fileName);
        return statFile.size;
    }
    catch {
        return 0;
    }
}