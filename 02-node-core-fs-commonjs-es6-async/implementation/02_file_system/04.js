// Task 04

// Створіть анонімний модуль, який приймає назву теки та повертає її вміст у форматі масиву з об'єктами. Приклад масиву наведено нижче. Якщо теки не існує — повертає false. Якщо тека порожня — повертає порожній масив.

// Приклад об'єкту
// [
//     {name : "one", ext : "txt"},
//     {name : "doc", ext  : "dat"}
// ]

// Приклад аргумента 'test_folder'

const fs = require('fs/promises');
const path = require('path');

module.exports = async (tekaName) => {
    try {
        const entries = await fs.readdir(tekaName);

        return entries.map(item => {
            const { name, ext } = path.parse(item);

            return {
                name,
                ext: ext.slice(1)
            }
        })
    }
    catch {
        return false;
    }
}