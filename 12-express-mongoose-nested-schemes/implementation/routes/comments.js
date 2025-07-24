const express = require('express');
const Article = require('../models/Article');
const Comment = require('../models/Comment');

module.exports = () => {
    const router = express.Router();

    const isAuthenticated = (req, res, next) => {
        if (!req.session.userId) {
            return res.redirect('/login');
        }
        next();
    };

    router.post('/:articleId', isAuthenticated, async (req, res) => {

        const articleId = req.params.articleId;
        const { commentText } = req.body;

        const article = await Article.findById(articleId).populate('comments');

        try {
            if (!article) {
                return res.status(404).send('404 not found');
            }

            const newComment = new Comment({
                text: commentText,
                article: articleId,
                author: req.session.userId
            });

            await newComment.save();

            article.comments.push(newComment._id);
            await article.save();

            return res.redirect(`/articles/${article.url}`);

        } catch (err) {
            if (err.name === 'ValidationError') {
                return res.render('article', {
                    article: article,
                    comments: article.comments,
                    error: err.errors.text.message,
                    commentText: commentText
                });
            }

            console.error('Error posting comment:', err);
            return res.status(500).send('server error');
        }
    });

    return router;
};