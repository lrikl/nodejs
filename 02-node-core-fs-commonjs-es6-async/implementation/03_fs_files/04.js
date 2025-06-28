// Task 04

// Створіть анонімний модуль у цьому файлі, який приймає аргумент — масив рядків і записує їх у файл file_04.txt у поточній теці. Кожен елемент масиву потрібно записати з нового рядка, використовуючи переноси рядків \r\n. Кодування файлу — UTF-8, для запису використовуйте прапор w.

'use strict';

const fs = require('fs/promises');

module.exports = async (arrText) => {
    try {
        await fs.writeFile('file_04.txt', arrText.join('\r\n'), { encoding: 'utf8', flag: 'w' });
        return true;
    }
    catch {
        return false;
    }
}