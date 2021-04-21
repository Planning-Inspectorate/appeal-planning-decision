module.exports = (env) => (req, res, next) => {
  env.addGlobal('navigation', req.session.navigationHistory);

  next();
};
