const catch404 = (req, res, next) => {
    res.status(404).render('site/error', {
        layout: 'error',
        statusCode: 404,
        title: 'Not found'
    });
}

const catch500 = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('site/error', {
        layout: 'error',
        statusCode: 500,
        title: 'Error server',
        message: 'Internal server error, please try again later.'
    });
}

module.exports = { catch404, catch500 };