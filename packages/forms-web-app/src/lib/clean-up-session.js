module.exports = (req) => {
  delete req.session;

  return req;
};
