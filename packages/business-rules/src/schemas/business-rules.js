const householderAppeal = require('./householder-appeal');
const isValid = require('../validation/appeal/type/is-valid');
const { APPEAL_ID } = require('../constants');

const businessRules = (appealType, data, config) => {
  if (!isValid(appealType)) {
    throw new Error(`${appealType} is not a valid appeal type`);
  }

  switch (appealType) {
    case APPEAL_ID.HOUSEHOLDER:
      return householderAppeal.validate(data, config);
    default:
      throw new Error(`No business rules schema found for ${appealType}`);
  }
};

module.exports = businessRules;
