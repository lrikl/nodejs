// Task 02

// Створіть анонімний модуль у цьому файлі, який приймає аргумент — назву файлу. Модуль зчитує вміст файлу та повертає суму чисел, що в ньому містяться.

// Приклад аргумента: 'num.dat'
// Приклад поверненного результата: 25

'use strict';

const fs = require('fs/promises');

module.exports = async (fileName) => {
    try {
        const data = await fs.readFile(fileName, 'utf8');
        return data.split('\n').reduce((sum, item) => sum += +item, 0);
    }
    catch {
        return false;
    }
}


