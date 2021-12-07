/* eslint-disable consistent-return */
const { VIEW } = require('../../lib/views');

const routeUserOption = (options) => {
  if (typeof options === 'string' && options === 'none_of_these') {
    return true;
  }

  return false;
};

const getAnyOfFollowing = async (req, res) => {
  res.render(VIEW.BEFORE_YOU_START.ANY_OF_FOLLOWING);
};

const postAnyOfFollowing = async (req, res) => {
  const { option, errors = {}, errorSummary = [] } = req.body;

  if (errors.option) {
    const errorMessage = errors.option.msg;

    if (errorMessage) {
      return res.render(VIEW.BEFORE_YOU_START.ANY_OF_FOLLOWING, {
        errors,
        errorSummary,
      });
    }
  }

  if (routeUserOption(option) === true) {
    return res.redirect('/before-you-start/enforcement-notice');
  }

  return res.redirect('/before-you-start/use-a-different-service');
};

module.exports = {
  getAnyOfFollowing,
  postAnyOfFollowing,
};
