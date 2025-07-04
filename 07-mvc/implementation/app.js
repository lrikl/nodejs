const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

const messageRoutes = require('./routes/messageRoutes');
const errController = require('./controllers/errorController');

app.use("/", messageRoutes);
app.use(errController.notFound);

module.exports = app;