// Task 05

// Створіть анонімний модуль у цьому файлі, який приймає аргументи — вихідний файл і кінцевий файл. Модуль має зчитати вміст вихідного файлу (текст) та записати його у кінцевий файл. Кодування — UTF-8, для запису використовуйте прапорець w. Якщо вхідного файла немає, то виконання завершується (return;)

const fs = require('fs/promises');

module.exports = async (startFile, endFile) => {
    try {
        const copyText = await fs.readFile(startFile, 'utf8')
        
        await fs.writeFile(endFile, copyText, { encoding: 'utf8', flag: 'w' });
        return true;
    }
    catch {
        return;
    }
}