const path = require('path');
const fs = require('fs/promises');

const dbDirPath = path.join(__dirname, '..', 'db');
const dataPath = path.join(__dirname, '..', 'db', 'data.json');

exports.addedMessages = async (username, message) => {
    await fs.mkdir(dbDirPath, { recursive: true });

    const oldData = await fs.readFile(dataPath, 'utf8')
        .then(JSON.parse)
        .catch(() => []);

    const newData = { username, message, time: new Date().toISOString() };

    await fs.writeFile(
        dataPath,
        JSON.stringify([newData, ...oldData]),
        'utf8'
    );

    return true;
}

exports.showMessages = async () => {
    const dataQuests = await fs.readFile(dataPath, 'utf8')
        .then(JSON.parse)
        .catch(() => []);

    return dataQuests;
}


