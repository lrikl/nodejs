const express = require('express');

module.exports = function ({ articlesCollection }) {
  const router = express.Router();

  // Middleware для перевірки, чи користувач увійшов у систему
  const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
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

  // Показати всі статті (Публічний маршрут)
  router.get('/', isAuthenticated, async (req, res) => {
    try {
      const articles = await articlesCollection.find().toArray();
      res.render('articles', { articles });
    } catch (err) {
      console.error(err);
      res.status(500).send('Помилка сервера');
    }
  });

  router.get('/new', isAuthenticated, (req, res) => {
    res.render('article-form', { article: {}, action: '/articles/new' });
  });

  // Створити нову статтю (логіка)
  router.post('/new', isAuthenticated, async (req, res) => {
    try {
      const { title, content, url, published, tags } = req.body;
      const newArticle = {
        title,
        content,
        url,
        published: published === 'on',
        author: req.session.user, // Зберігаємо автора
        createdAt: new Date()
      };
      if (tags) {
        const tagsArray = parseTags(tags);
        if (tagsArray.length > 0) newArticle.tags = tagsArray;
      }
      await articlesCollection.insertOne(newArticle);
      res.redirect('/articles');
    } catch (err) {
      console.error(err);
      res.status(500).send('Помилка сервера');
    }
  });

  // Показати форму редагування статті
  router.get('/:url/edit', isAuthenticated, async (req, res) => {
    try {
      const article = await articlesCollection.findOne({ url: req.params.url });
      if (!article) {
        return res.status(404).send('Статтю не знайдено');
      }
      // Перевірка, чи є поточний користувач автором статті
      if (article.author !== req.session.user) {
        return res.status(404).send('Доступ заборонено: ви не є автором цієї статті.');
      }
      res.render('article-form', { article, action: `/articles/${article.url}/edit` });
    } catch (err) {
      console.error(err);
      res.status(500).send('Помилка сервера');
    }
  });

  // Оновити статтю (логіка)
  router.post('/:url/edit', isAuthenticated, async (req, res) => {
    try {
      // Спочатку знаходимо статтю, щоб перевірити права доступу
      const articleToUpdate = await articlesCollection.findOne({ url: req.params.url });
      if (!articleToUpdate) {
        return res.status(404).send('Статтю не знайдено');
      }
      if (articleToUpdate.author !== req.session.user) {
        return res.status(404).send('Доступ заборонено: ви не є автором цієї статті.');
      }

      const { title, content, url, published, tags } = req.body;
      const updateData = {
        title, content, url, published: published === 'on',
        lastUpdatedBy: req.session.user,
        updatedAt: new Date(),
        tags: parseTags(tags)
      };
      await articlesCollection.updateOne({ url: req.params.url }, { $set: updateData });
      res.redirect('/articles');
    } catch (err) {
      console.error(err);
      res.status(500).send('Помилка сервера');
    }
  });

  // Видалити статтю
  router.post('/:url/delete', isAuthenticated, async (req, res) => {
    try {
      // ПОКРАЩЕННЯ: Аналогічна перевірка прав доступу перед видаленням
      const articleToDelete = await articlesCollection.findOne({ url: req.params.url });
      if (!articleToDelete) {
        return res.status(404).send('Статтю не знайдено');
      }
      if (articleToDelete.author !== req.session.user) {
        return res.status(404).send('Доступ заборонено: ви не є автором цієї статті.');
      }
      await articlesCollection.deleteOne({ url: req.params.url });
      res.redirect('/articles');
    } catch (err) {
      console.error(err);
      res.status(500).send('Помилка сервера');
    }
  });
  
  router.get('/:url', async (req, res) => {
    try {
      const article = await articlesCollection.findOne({ url: req.params.url });
      if (!article) {
        return res.status(404).send('Статтю не знайдено');
      }
      res.render('article', { article });
    } catch (err) {
      console.error(err);
      res.status(500).send('Помилка сервера');
    }
  });

  return router;
}