const path = require('path');
const fs = require('fs/promises');

const dbDirPath = path.join(__dirname, '..', 'db');
const dataPath = path.join(__dirname, '..', 'db', 'data.json');

const debugAddedMess = require('debug')('app: addedMess');
const debugShowMess = require('debug')('app: showMess');

exports.addedMessages = async (username, message) => {
    try {
        await fs.mkdir(dbDirPath, { recursive: true });
        
        let oldData = [];

        try {
            const fileData = await fs.readFile(dataPath, 'utf8');
            if (fileData) {
                oldData = JSON.parse(fileData);
            }

        } catch (err) {
            debugAddedMess('Error model read db', err);
        }

        const newData = { username, message, time: new Date().toISOString() };

        await fs.writeFile(
            dataPath,
            JSON.stringify([newData, ...oldData]),
            'utf8'
        );

        return true;
        
    }catch (err) {
        debugAddedMess('Error model added user post', err);
        return false;
    }
}

exports.showMessages = async () => {
    try {
        let dataQuests = [];

        const fileData = await fs.readFile(dataPath, 'utf8');
        dataQuests = JSON.parse(fileData);

        return dataQuests;

    }catch(err) {
        debugShowMess('Error model show user post', err);
        return [];
    }
}


