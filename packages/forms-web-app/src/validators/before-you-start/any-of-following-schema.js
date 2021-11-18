const anyOfFollowingOptions = [
  'none_of_these',
  'major_retail_and_services',
  'major_travelling_and_caravan_pitches',
  'major_general_industry_storage_warehousing',
  'major_dwellings',
  'a_listed_building',
];

module.exports = {
  'any-of-following': {
    custom: {
      options: async (value, { req }) => {
        const { option } = req.body;

        if (typeof option === 'string') {
          return true;
        }

        if (Array.isArray(option)) {
          return option.some((item) => anyOfFollowingOptions.includes(item));
        }

        return false;
      },
    },
  },
};
