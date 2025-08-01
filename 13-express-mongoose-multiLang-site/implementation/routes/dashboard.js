const express = require('express');
const User = require('../models/User');

module.exports = () => {
  const router = express.Router();

  const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect(`/${res.locals.lang}/login`);
    }
    next();
  };

  router.get('/', isAuthenticated, async (req, res) => {
    try {
      const users = await User.find();
      return res.render('dashboard', { users, username: req.session.user, usermail: req.session?.email });
    }
    catch (err) {
      return res.status(500).send('server error');
    }
  });

  router.post('/update-username', isAuthenticated, async (req, res) => {
    try {
      const { newUsername } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        req.session.userId,
        { username: newUsername },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).send('Користувача не знайдено.');
      }

      req.session.user = updatedUser.username;

      return res.redirect(`/${res.locals.lang}/dashboard`);
    } 
    catch (err) {
      if (err.name === 'ValidationError') {
        try {
          const users = await User.find();

          return res.render('dashboard', {
            users,
            username: req.session.user,
            error: err.errors.username.message
          });
        } 
        catch (err) {
          return res.status(500).send('server error');
        }
      }
      
      console.error('Error updating username:', err);
      return res.status(500).send('server error');
    }
  });

  return router;
}