const express = require('express');

module.exports = function ({ articlesCollection }) {
  const router = express.Router();

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

  // read all articles
  router.get('/', isAuthenticated, async (req, res) => {
    const articles = await articlesCollection.find().toArray();
    res.render('articles', { articles });
  });

  // CREATE form
  router.get('/new', isAuthenticated, (req, res) => {
    res.render('article-form', { article: {}, action: '/articles/new' });
  });

  //  READ single article
  router.get('/:url', async (req, res) => {
    const article = await articlesCollection.findOne({ url: req.params.url });
    res.render('article', { article });
  });

  // CREATE new article
  router.post('/new', isAuthenticated, async (req, res) => {
    const { title, content, url, published, tags } = req.body;

    const newArticle = {
      title,
      content,
      url,
      published: published === 'on',
      author: req.session.user,
      createdAt: new Date()
    };

    // Task 07 & 10: Обробка тегів при створенні, якщо теги були передані і вони не порожні
    if (tags) {
      const tagsArray = parseTags(tags);

      if (tagsArray.length > 0) {
        newArticle.tags = tagsArray;
      }
    }

    await articlesCollection.insertOne(newArticle);
    res.redirect('/articles');
  });

  // 🟡 UPDATE — форма
  router.get('/:url/edit', isAuthenticated, async (req, res) => {
    const article = await articlesCollection.findOne({ url: req.params.url });
    res.render('article-form', { article, action: `/articles/${article.url}/edit` });
  });

  // 🟡 UPDATE logic
  router.post('/:url/edit', isAuthenticated, async (req, res) => {
    const { title, content, url, published, tags } = req.body;

    const updateData = {
      title,
      content,
      url,
      published: published === 'on',
      lastUpdatedBy: req.session.user,
      updatedAt: new Date()
    };

    // Task 08 & 10: Обробка тегів при оновленні
    const tagsArray = parseTags(tags);
    updateData.tags = tagsArray;

    await articlesCollection.updateOne(
      { url: req.params.url },
      { $set: updateData }
    );
    res.redirect('/articles');
  });

  // DELETE
  router.post('/:url/delete', isAuthenticated, async (req, res) => {
    await articlesCollection.deleteOne({ url: req.params.url });
    res.redirect('/articles');
  });

  return router;
};