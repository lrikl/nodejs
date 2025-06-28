// Task 02

// Створіть анонімний модуль у цьому файлі, який приймає повний шлях до теки та повертає true або false залежно від того, чи існує вказана тека.
'use strict';

const fs = require('fs/promises');

module.exports = (tekaPath) => {
    return fs.readdir(tekaPath)
        .then(() => true)
        .catch(() => false);
}