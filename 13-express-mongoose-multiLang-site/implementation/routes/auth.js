const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('config');
const User = require('../models/User');

module.exports = () => {
  const router = express.Router();

  router.get('/login', (req, res) => {
    return res.render('login');
  });

  router.get('/signin', (req, res) => {
    return res.render('signin');
  });

  router.get('/forgot-password', (req, res) => {
    return res.render('forgot-password');
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user.username;
        req.session.email = user.email;
        req.session.userId = user._id;
        return res.redirect(`/${res.locals.lang}/dashboard`);
      }

      return res.render('login', { error: 'Невірний логін або пароль' });
    }
    catch (err) {
      console.error('Login error:', err);
      return res.render('login', { error: 'server error' });
    }
  });

  router.post('/signin', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.render('signin', { error: 'Користувач з таким email вже зареєстрований' });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashPassword
      })

      await newUser.save();

      req.session.user = username;
      req.session.email = email;
      return res.redirect(`/${res.locals.lang}/dashboard`);
    }
    catch (err) {
      console.error('Error during registration:', err);
      return res.render('signin', { error: 'server error' });
    }
  });

  router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      return res.redirect(`/${res.locals.lang}/login`);
    });
  });

  router.post('/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.render('forgot-password', { error: 'Користувача з таким email не знайдено.' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expires = Date.now() + 1000 * 60 * 30;

      user.resetToken = token;
      user.resetExpires = expires;
      await user.save();

       const resetLink = `http://localhost:${config.port}/${res.locals.lang}/reset-password/${token}`;

      console.log('Password recovery:', resetLink);
      return res.render('forgot-password', { message: 'Посилання для відновлення пароля надіслано' });
    }
    catch (err) {
      console.error('Error when requesting password recovery:', err);
      return res.render('forgot-password', { error: 'server error' });
    }
  });

  router.get('/reset-password/:token', async (req, res) => {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        resetToken: token,
        resetExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.render('reset-password', { token: token, error: 'Посилання для відновлення пароля недійсне або термін дії минув' });
      }

      return res.render('reset-password', { token });
    }
    catch (err) {
      console.error('Error while verifying token:', err);
      return res.render('login', { error: 'server error' });
    }
  });

  router.post('/reset-password/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        resetToken: token,
        resetExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.render('reset-password', { token: token, error: 'Посилання для відновлення пароля недійсне або термін дії минув' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      user.resetToken = null;
      user.resetExpires = null;
      await user.save();

      return res.redirect(`/${res.locals.lang}/login`);
    }
    catch (err) {
      console.error('Error updating password:', err);
      return res.render('reset-password', { token: req.params.token, error: 'server error' });
    }
  });

  return router;
}