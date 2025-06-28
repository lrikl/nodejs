'use strict';

// Task 01-03 ------------
const config = require('config');

const express = require('express');
const app = express();

app.listen(config.port, () => {
    console.log(`server start on http://localhost:${config.port}`);
})

// Task 04 ------------
app.get('/', (req, res) => {
    res.send('home');
});

// Task 05 ------------
app.get('/json', (req, res) => {
    res.json({
        "title": "express",
        "success": 1
    });
});

// Task 06 ------------
app.get('/redirect', (req, res) => {
    res.redirect('/json');
});

// Task 07 ------------
app.get('/goods/:id', (req, res) => {
    // http://localhost:3100/goods/one    
    res.json({
       url: 'goods',
       id: req.params.id,
    });
});

// Task 08 ------------
app.get('/q', (req, res) => {
    // http://localhost:3100/q?id=99&name=alex 
    // http://localhost:3100/q?cat=notebook&producer=acer
    res.json(req.query);
});


// Task 09 ------------
app.get('/random', (req, res) => {
    // http://localhost:3100/random?min=140&max=170
    const min = +req.query.min;
    const max = +req.query.max;
    const random = Math.floor(Math.random() * (max - min + 1)) + min;

    res.json({
       min,
       max,
       random
    });
});

// Task 10 ------------
app.use((req, res) => {
    res.status(400).send('not found');
})

