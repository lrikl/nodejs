const config = require('config');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny', { skip: (req) => req.url.startsWith('/.well-known') }));

const formatedStr = (str) => {
  return str?.trim()?.toLowerCase();
}

const MongoStore = require('connect-mongo');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const mongoUrl = config.mongoUrl;
const client = new MongoClient(mongoUrl);
let tasksCollection;
let usersCollection;

const connectDB = async () => {
  try {
    await client.connect();
    const db = client.db(config.dbName);
    tasksCollection = db.collection(config.collections.tasks);
    usersCollection = db.collection(config.collections.users);
    console.log('MongoDB connected');
  }
  catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(config.port, () => console.log(`Server running on http://localhost:${config.port}`));
});

app.use(session({
  store: MongoStore.create({
    mongoUrl: config.mongoUrl + config.dbName,
    collectionName: config.collections.sessions,
    ttl: config.session.ttl,
  }),
  secret: config.secret,
  saveUninitialized: false,
  cookie: {
    maxAge: config.cookie.cookieAge,
  },
}));

const isAuthenticated = (req, res, next) => {
  if (!req.session.email) {
    return res.redirect('/login');
  }
  next();
};

const isGuest = (req, res, next) => {
  if (req.session.email) {
    return res.redirect('/dashboard');
  }
  next();
};

app.get('/', (req, res) => {
  res.render('main', { username: req.session.user });
});

app.get('/common', (req, res) => {
  res.render('common', { username: req.session.user });
});

app.get('/register', isGuest, (req, res) => {
  const error = req.session.error;
  delete req.session.error;

  res.render('register', { error });
});

app.post('/register', isGuest, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!email?.trim() || !username?.trim() || !password?.trim() || !role) {
      return res.redirect('/register');
    }
    const userExists = await usersCollection.findOne({ email: formatedStr(email) });

    if (userExists) {
      req.session.error = 'user exists';
      return res.redirect('/register');
    }

    const hashPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
    await usersCollection.insertOne({
      email: formatedStr(email),
      username,
      password: hashPassword,
      role,
      createdAt: new Date().toISOString(),
    });

    req.session.message = 'user created successfully, please login';
    res.redirect('/login');
  }
  catch (err) {
    console.error('Register Form Error:', err);
    res.status(500).send('Server error');
  }
});

app.get('/login', isGuest, (req, res) => {
  const message = req.session.message;
  const error = req.session.error;
  delete req.session.message;
  delete req.session.error;
  res.render('login', { message, error });
});

app.post('/login', isGuest, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) return res.redirect('/login');

    const user = await usersCollection.findOne({ email: formatedStr(email) });

    const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!passwordMatch) {
      req.session.error = 'login or password is incorrect';
      return res.redirect('/login');
    }

    req.session.user = user.username;
    req.session.email = user.email;
    req.session.role = user.role;
    res.redirect('/dashboard');
  }
  catch (err) {
    console.error('Login Form Error:', err);
    res.status(500).send('Server error');
  }
});

app.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const isAdmin = req.session.role === 'admin';
    let tasks;
    let users;

    if (isAdmin) {
      [users, tasks] = await Promise.all([
        usersCollection.find().toArray(),
        tasksCollection.find({ role: 'admin' }).toArray(),
      ]);
    }
    else {
      tasks = await tasksCollection.find({ role: 'user' }).toArray();
    }

    res.render('dashboard', { isAdmin, users, tasks, username: req.session.user });
  }
  catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).send('Server error');
  }
});

app.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

