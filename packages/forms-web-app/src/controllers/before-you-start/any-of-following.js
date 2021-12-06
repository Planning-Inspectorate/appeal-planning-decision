/* eslint-disable consistent-return */
const { VIEW } = require('../../lib/views');

const routingOptions = (option) => {
  switch (option) {
    case 'a_listed_building':
    case 'major_dwellings':
    case 'major_general_industry_storage_warehousing':
    case 'major_travelling_and_caravan_pitches':
    case 'major_retail_and_services':
      return false;

    default:
      return false;
  }
};

const routeUserOption = (options) => {
  if (typeof options === 'string' && options === 'none_of_these') {
    return true;
  }

  if (Array.isArray(options)) {
    return options.some((option) => routingOptions(option));
  }

  return false;
};

const getAnyOfFollowing = async (req, res) => {
  res.render(VIEW.BEFORE_YOU_START.ANY_OF_FOLLOWING, {
    errors: {},
    errorSummary: [],
  });
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
