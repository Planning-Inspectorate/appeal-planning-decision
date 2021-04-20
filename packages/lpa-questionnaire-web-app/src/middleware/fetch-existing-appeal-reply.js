const { createAppealReply, getExistingAppealReply } = require('../lib/appeal-reply-api-wrapper');

/**
 * Middleware to ensure any route that needs the appeal reply form data can have it pre-populated when the
 * controller action is invoked.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async (req, res, next) => {
  if (!req.session || !req.params.id) {
    return next();
  }

  const { id } = req.params;
  try {
    req.session.appealReply = await getExistingAppealReply(id);
  } catch (err) {
    if (err.status === 404) {
      // TODO this bit is just staying in to make manual testing easier
      // - i've been running all the cypress tests with it commented out
      //   to find the straight and narrow, and keep me on it
      //--
      // i gather the plan is that some other asynchronous process will be
      // inserting this for us
      //--
      // however in the meantime: if i take this out, no-one will be able to
      // look at our site in dev without poking this data in vai the API
      // and i don't think we want to go there.
      // -- when the time comes, this case should likely 404 or something.
      req.session.appealReply = await createAppealReply(id);
    } else {
      return next(err);
    }
  }

  return next();
};
