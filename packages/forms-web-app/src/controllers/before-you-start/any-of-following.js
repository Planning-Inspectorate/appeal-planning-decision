const { VIEW } = require('../../lib/views');

const routingOptions = (option) => {
  switch (option) {
    case 'a_listed_building':
    case 'major_dwellings':
    case 'major_general_industry_storage_warehousing':
    case 'major_travelling_and_caravan_pitches':
    case 'major_retail_and_services':
      return false;

    case 'none_of_these':
      return true;

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
  res.render(VIEW.BEFORE_YOU_START.ANY_OF_FOLLOWING, {});
};

const postAnyOfFollowing = async (req, res) => {
  const { option } = req.body;

  if (typeof option === 'undefined') {
    return res.render(VIEW.BEFORE_YOU_START.ANY_OF_FOLLOWING, {
      errorSummary: [{ text: 'Select if your appeal is about any of the following', href: '#' }],
    });
  }

  if (routeUserOption(option) === true) {
    return res.render(VIEW.BEFORE_YOU_START.ENFORCEMENT_NOTICE, {});
  }

  return res.render(VIEW.BEFORE_YOU_START.SHUTTER, {});
};

module.exports = {
  getAnyOfFollowing,
  postAnyOfFollowing,
};
