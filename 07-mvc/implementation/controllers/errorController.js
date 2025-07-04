exports.notFound = (req, res) => {
    res.status(404).render('notFound', {title: '404'});
}
