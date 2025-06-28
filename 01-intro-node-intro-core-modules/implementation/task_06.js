// Task 06

//Створіть іменований модуль integerPart, який отримує десятковий дріб і повертає його цілу частину.
// Використовуйте синтаксис CommonJS.

const integerPart = (float) => Math.trunc(float);

module.exports = integerPart;