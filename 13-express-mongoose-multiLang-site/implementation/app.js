require('dotenv').config();

const config = require('config');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const sessionMiddleware = require('./db/session');

const { connectDB } = require('./db/db');

const i18n = require('i18n');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(`${__dirname}/assets`));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(sessionMiddleware);

i18n.configure({
  locales: config.locales,
  directory: path.join(__dirname, 'locales'),
  defaultLocale: config.defaultLocale,
  queryParameter: 'lang',
  cookie: 'lang',
  autoReload: true,
  updateFiles: false,
  syncFiles: false
});

app.use(i18n.init);

app.use(morgan('tiny', {
  skip: req => req.url.startsWith('/.well-known')
}));

app.use((req, res, next) => {
  app.locals.user = req.session?.user || null;
  app.locals.email = req.session?.email || null;
  next();
});

const setLang = require('./utils/setLang');

connectDB().then(() => {
  const mainRouter = express.Router();

  mainRouter.use('/', require('./routes/index')());
  mainRouter.use('/', require('./routes/auth')());
  mainRouter.use('/dashboard', require('./routes/dashboard')());
  mainRouter.use('/articles', require('./routes/articles')());
  mainRouter.use('/comments', require('./routes/comments')());

  app.use('/:lang', setLang, mainRouter);

  app.get('/', (req, res) => {
    return res.redirect(`/${config.defaultLocale}`);
  });

  app.use((req, res, next) => {
    const lang = req.params.lang || config.defaultLocale;
    return res.status(404).render('404');
  });

  app.listen(config.port, () => {
    console.log('Сервер запущено на http://localhost:' + config.port);
  });
});