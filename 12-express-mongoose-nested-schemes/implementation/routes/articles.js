const express = require('express');
const Article = require('../models/Article');

module.exports = () => {
  const router = express.Router();

  const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect('/login');
    }

    next();
  };

  const parseTags = (tagsString) => {
    if (!tagsString || typeof tagsString !== 'string') {
      return [];
    }

    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
  };

  router.get('/', isAuthenticated, async (req, res) => {
    try {
      const articles = await Article.find({ author: req.session.userId })
        .populate('author', 'username')
        .populate('lastUpdatedBy', 'username');
        
      return res.render('articles', { articles });
    }
    catch (err) {
      console.error(err);
      return res.status(500).send('server error');
    }
  });

  router.get('/new', isAuthenticated, (req, res) => {
    return res.render('article-form', { article: {}, action: '/articles/new' });
  });

  router.post('/new', isAuthenticated, async (req, res) => {
    try {
      const { title, content, url, published, tags } = req.body;

      const newArticle = new Article({
        title,
        content,
        url,
        published: published === 'on',
        author: req.session.userId,
        tags: parseTags(tags)
      });

      await newArticle.save();

      return res.redirect('/articles');
    }
    catch (err) {
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);

        return res.render('article-form', {
          errors,
          article: req.body,
          action: '/articles/new'
        });
      }

      console.error(err);
      return res.status(500).send('server error');
    }
  });

  router.get('/:url/edit', isAuthenticated, async (req, res) => {
    try {
      const article = await Article.findOne({ url: req.params.url });

      if (!article) {
        return res.status(404).send('Статтю не знайдено');
      }

      if (article.author.toString() !== req.session.userId) {
        return res.status(404).send('Доступ заборонено: ви не є автором цієї статті');
      }

      return res.render('article-form', { article, action: `/articles/${article.url}/edit` });
    }
    catch (err) {
      console.error(err);
      return res.status(500).send('server error');
    }
  });

  router.post('/:url/edit', isAuthenticated, async (req, res) => {
    try {
      const article = await Article.findOne({ url: req.params.url });

      if (!article) {
        return res.status(404).send('404 not found');
      }

      if (article.author.toString() !== req.session.userId) {
        return res.status(404).send('Доступ заборонено: ви не є автором цієї статті');
      }

      const { title, content, url, published, tags } = req.body;

      article.title = title;
      article.content = content;
      article.url = url;
      article.published = published === 'on';
      article.tags = parseTags(tags);
      article.lastUpdatedBy = req.session.userId;

      await article.save();

      return res.redirect('/articles');
    }
    catch (err) {
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);

        return res.render('article-form', {
          errors,
          article: req.body,
          action: '/articles/new'
        });
      }

      console.error(err);
      return res.status(500).send('server error');
    }
  });

  router.post('/:url/delete', isAuthenticated, async (req, res) => {
    try {
      const article = await Article.findOne({ url: req.params.url });

      if (!article) {
        return res.status(404).send('404 not found');
      }

      if (article.author.toString() !== req.session.userId) {
        return res.status(404).send('Доступ заборонено: ви не є автором цієї статті');
      }

      await article.deleteOne();

      return res.redirect('/articles');
    }
    catch (err) {
      console.error(err);
      return res.status(500).send('server error');
    }
  });

  router.get('/:url', async (req, res) => {
    try {
      const article = await Article.findOne({ url: req.params.url })
        .populate('author', 'username')
        .populate({
          path: 'comments',
          match: { visible: true },
          populate: {
            path: 'author',
            select: 'username'
          }
        });

      if (!article) {
        return res.status(404).send('Article not found');
      }

      return res.render('article', { article });
    }
    catch (err) {
      console.error(`Error retrieving article from url: ${req.params.url}`, err);
      return res.status(500).send('server error');
    }
  });

  return router;
}