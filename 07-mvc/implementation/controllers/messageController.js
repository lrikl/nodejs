const MessageData = require('../models/messageModel');

const debugSubmitForm = require('debug')('app: submitForm');
const debugShowMess = require('debug')('app: ShowMess');

exports.home = (req, res) => {
    res.render('main');
}

exports.showForm = (req, res) => {
    res.render('form', {title: 'Form'});
}

exports.submitForm = async (req, res) => {
    const { username, message } = req.body;

    try {
        if (!username?.trim() || !message?.trim()) {
            return res.status(400).json({ message: 'no added, empty user post' });
        }

        await MessageData.addedMessages(username, message);
        debugSubmitForm('user post added');
        res.redirect('/guests');

    } catch (err) {
        debugSubmitForm('Error added user post', err);
        res.status(500).send('server error');
    }
}

exports.showMessages = async (req, res) => {
    try {
        const dataQuests = await MessageData.showMessages();
        res.render('guests', { guests: dataQuests, title: 'Guests' });
        
    } catch (err) {
        debugShowMess('err guests data:', err);
        res.status(500).send('server error');
    }
}

