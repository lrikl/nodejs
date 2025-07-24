const express = require('express');
const Article = require('../models/Article');
const Comment = require('../models/Comment');

module.exports = () => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const articles = await Article.find({ published: true }).populate('author', 'username');
      return res.render('main', { articles });
    }
    catch (err) {
      console.error('Error while retrieving list of articles:', err);
      return res.status(500).send('server error');
    }
  });

  return router;
};