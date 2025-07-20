// route factory pattern

const express = require('express');
const router = express.Router();

module.exports = function ({ articlesCollection }) {

  router.get('/', async (req, res) => {
    try {
      const articles = await articlesCollection.find({ published: true }).toArray();
      res.render('main', { articles });
    } 
    catch (err) {
      console.error('Error while retrieving list of articles:', err);
      res.status(500).send('server error');
    }
  });

  // Маршрут для перегляду однієї статті
  router.get('/article/:url', async (req, res) => {
    try {
      const article = await articlesCollection.findOne({ url: req.params.url });

      if (!article) {
        return res.status(404).send('Article not found');
      }

      res.render('article', { article });
    } 
    catch (err) {
      console.error(`Error retrieving article from url: ${req.params.url}`, err);
      res.status(500).send('server error');
    }
  });

  return router;
};