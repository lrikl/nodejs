const express = require('express');
const Article = require('../models/Article');
const Page = require('../models/Page');

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

  router.get('/page', async (req, res) => {
    try {
      const pages = await Page.find({});
      return res.render('page', { pages });
    }
    catch (err) {
      console.error('Error getting data from collection page:', err);
      return res.status(500).send('server error');
    }
  });

  return router;
};