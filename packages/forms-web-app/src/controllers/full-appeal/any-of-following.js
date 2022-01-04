const {
  VIEW: {
    FULL_APPEAL: { ANY_OF_FOLLOWING },
  },
} = require('../../lib/views');

const routeUserOption = (options) => {
  if (typeof options === 'string' && options === 'none_of_these') {
    return true;
  }

  return false;
};

const getAnyOfFollowing = async (req, res) => {
  res.render(ANY_OF_FOLLOWING);
};

const postAnyOfFollowing = async (req, res) => {
  const { option, errors = {}, errorSummary = [] } = req.body;

  if (errors.option) {
    return res.render(ANY_OF_FOLLOWING, {
      errors,
      errorSummary,
    });
  }

  if (routeUserOption(option) === true) {
    return res.redirect('/before-you-start/granted-or-refused');
  }

  return res.redirect('/before-you-start/use-a-different-service');
};

module.exports = {
  getAnyOfFollowing,
  postAnyOfFollowing,
};
