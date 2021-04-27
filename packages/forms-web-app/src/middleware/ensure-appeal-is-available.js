module.exports = (req, res, next) => {
  /**
   * This is not particularly robust. However, we currently do not guarantee the appeal object has a valid shape.
   */
  if (req.session?.appeal?.id) {
    next();
    return;
  }

  res.status(400);
  res.render('error/400', {
    message: 'Sorry, we were unable to find the details for your appeal.',
  });
};
