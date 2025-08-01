const config = require('config');

module.exports = (req, res, next) => {
    const lang = req.params.lang;

    res.locals.lang = lang;
    res.locals.langs = config.locales;
    res.locals.clearPath = req.originalUrl.substring(lang.length + 1) || '/';
    res.locals.url = req.originalUrl;

    if (!config.locales.includes(lang)) {
        return res.status(404).render('404');
    }

    res.setLocale(lang); // Устанавливаем локаль для i18n
    console.log('Valid path requested:', res.locals.clearPath);

    next();
};