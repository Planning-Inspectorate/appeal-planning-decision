const { body } = require('express-validator');

const anyOfFollowingOptions = [
  'none_of_these',
  'major_retail_and_services',
  'major_travelling_and_caravan_pitches',
  'major_general_industry_storage_warehousing',
  'major_dwellings',
  'a_listed_building',
];

const rules = () => {
  return [
    body('option')
      .custom((value, { req }) => {
        const { option } = req.body;

        if (typeof option === 'string' && !anyOfFollowingOptions.includes(option)) {
          return true;
        }

        if (typeof option === 'undefined' || option === '') {
          return false;
        }

        if (Array.isArray(option)) {
          return option.some((item) => anyOfFollowingOptions.includes(item));
        }

        return false;
      })
      .withMessage('Select if your appeal is about any of the following'),
  ];
};

module.exports = {
  rules,
};
