const navigateUser = (req, res, next) => {
  res.locals.user = req.user || null;

  next();
};
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  const isApiRequest = req.xhr || req.headers['content-type'] === 'application/json' || req.url.startsWith('/api');

  if (isApiRequest) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.render('site/error', {
    title: 'Unauthorized',
    statusCode: 401,
    layout: 'error',
  });
};
const checkRole = (nameRoles) => {
  return async (req, res, next) => {
    if (req.isAuthenticated() && nameRoles.some((name) => req.user.role.name === name)) {
      return next();
    }
    res.render('site/error', {
      title: 'Unauthorized',
      statusCode: 401,
      layout: 'error',
    });
  };
};

module.exports = {
  navigateUser,
  isAuthenticated,
  checkRole,
};
