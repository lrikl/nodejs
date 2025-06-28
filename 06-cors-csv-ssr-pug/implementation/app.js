'use strict';

const config = require('config');
const path = require('path');
const fs = require('fs/promises');
const express = require('express');
const morgan = require('morgan');

const app = express();

const dataPath = path.join(__dirname, 'message.json');

const debugForm = require('debug')('app: form');
const debugGuests = require('debug')('app: guests');
const debugServer = require('debug')('app: server');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));

app.listen(config.port, () => debugServer(`start on http://localhost:${config.port}`));

app.get('/', (req, res) => {
    res.render('main');
})

app.get('/form', (req, res) => {
    res.render('form');
})

app.post('/form', async (req, res) => {
    const { username, message } = req.body;

    if (!username.trim() || !message.trim()) {
        return res.status(400).json({ message: 'no added, empty user post' });
    }

    try {
        const oldData = await fs.readFile(dataPath, 'utf8')
            .then(JSON.parse)
            .catch(() => []);

        const newData = { username, message, time: new Date().toISOString() };

        await fs.writeFile(
            dataPath,
            JSON.stringify([...oldData, newData]),
            'utf8'
        );

        debugForm('data added', newData);
        res.json({ message: 'data added' });
    }
    catch (err) {
        debugForm('error /form:', err);
        res.status(500).send('server error');
    }
})

app.get('/guests', async (req, res) => {
    try {
        const dataQuests = await fs.readFile(dataPath, 'utf8')
            .then(JSON.parse)
            .catch(() => []);

        dataQuests.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.render('guests', { guests: dataQuests });
    } catch (err) {
        debugGuests('error /guests', err);
        res.status(500).send('server error');
    }
})