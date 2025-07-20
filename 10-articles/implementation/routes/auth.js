const express = require('express'); 
const router = express.Router(); 
const bcrypt = require('bcrypt'); 
const crypto = require('crypto'); 
const config = require('config');

module.exports = function ({ usersCollection }) {

  router.get('/login', (req, res) => {
    res.render('login');
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersCollection.findOne({ email });

    // Перевіряємо: чи знайдено користувача І чи співпадає введений пароль з хешованим паролем у базі
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user.username;
      req.session.email = user.email;

      return res.redirect('/dashboard');
    }

    res.render('login', { error: 'Невірний логін або пароль' });
  });

  router.get('/signin', (req, res) => {
    res.render('signin');
  });

  router.post('/signin', async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.render('signin', { error: 'Емейл вже зареєстровано' });
    }

    // Хешуємо пароль перед збереженням у базу даних (10 - "сіль", складність хешування)
    const hashPassword = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({
      username,
      email,
      password: hashPassword,
      role: 'user', 
      createdAt: new Date().toISOString()
    });

    req.session.user = username;
    req.session.email = email;
    res.redirect('/dashboard');
  });

  router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  });

  router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
  });

  router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.render('forgot-password', { error: 'Користувача з таким email не знайдено' });
    }

    // Генеруємо унікальний, криптографічно стійкий токен
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 1000 * 60 * 30; // 30 хвилин 

    // Зберігаємо токен і час його життя в документі користувача в базі даних
    await usersCollection.updateOne(
      { email },
      { $set: { resetToken: token, resetExpires: expires } }
    );

    // Створюємо посилання для скидання пароля
    const resetLink = `http://localhost:${config.port}/reset-password/${token}`;

    // У реальному додатку тут була б відправка листа на email
    console.log('Відновлення пароля:', resetLink);

    res.render('forgot-password', { message: 'Посилання для відновлення надіслано' });
  });

  // Маршрут, на який веде для скидання паролю
  router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    // Шукаємо користувача за токеном, який ще не прострочений
    const user = await usersCollection.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() }, // Перевіряємо, що час життя токена ще не минув
    });

    if (!user) {
      return res.render('reset-password', { error: 'Недійсне або прострочене посилання' });
    }

    res.render('reset-password', { token });
  });

  // Обробка форми з новим паролем
  router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await usersCollection.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.render('reset-password', { error: 'Недійсне або прострочене посилання' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Оновлюємо документ користувача: встановлюємо новий пароль і видаляємо токен
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetExpires: "" } 
      }
    );

    res.redirect('/login');
  });

  return router;
}
