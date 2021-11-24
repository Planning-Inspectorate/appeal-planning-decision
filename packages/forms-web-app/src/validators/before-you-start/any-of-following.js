const { body } = require('express-validator');

const anyOfFollowingOptions = [
  'none_of_these',
  'major_retail_and_services',
  'major_travelling_and_caravan_pitches',
  'major_general_industry_storage_warehousing',
  'major_dwellings',
  'a_listed_building',
];

const rules = () => body('options').notEmpty().isIn(anyOfFollowingOptions);

module.exports = {
  rules,
};
