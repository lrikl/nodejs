// Task 03

// Створіть анонімний модуль у цьому файлі, який приймає аргумент — рядок тексту. Модуль має створити файл з ім’ям file_03.txt у поточній теці. У файл потрібно записати переданий текст у кодуванні UTF-8. Для запису використовуйте файловий прапор w.

'use strict';

const fs = require('fs/promises');

module.exports = async (text) => {
    try {
        await fs.writeFile('file_03.txt', text, { encoding: 'utf8', flag: 'w' });
        return true;
    }
    catch {
        return false;
    }
}