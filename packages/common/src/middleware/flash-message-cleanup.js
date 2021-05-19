/**
 * Using the session to allow messages to persist over an HTTP redirect.
 *
 * @param req
 * @param res
 * @param next
 */
module.exports = (req, res, next) => {
  /**
   * Take any messages from the current session - this will have been set on the user's previous
   * request.
   */
  const flashMessages = req.session.flashMessages || [];

  // reset the `req.session.flashMessages` container
  req.session.flashMessages = [];

  // store the messages for one time use on the current request.
  res.locals.flashMessages = flashMessages;

  next();
};
