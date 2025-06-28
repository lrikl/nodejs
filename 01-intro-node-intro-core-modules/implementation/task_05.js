// Task 05

// Створіть іменований модуль randomSymbol, який отримує рядок і повертає випадковий символ з цього рядка.
// Якщо передано порожній рядок — повертає порожній рядок.
// Використовуйте синтаксис CommonJS.

const getRandomNumb = require('./utils/randomNumb');

const randomSymbol = (str) => {
    if(!str?.trim()) {
        return '';
    }

    const indexLetter = getRandomNumb(0, str.length-1);

    return str[indexLetter];
}

module.exports = randomSymbol;