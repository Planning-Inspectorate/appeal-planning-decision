const householderAppeal = require('./householder-appeal');
const isValid = require('../validation/appeal/type/is-valid');
const { APPEAL_ID } = require('../constants');
const BusinessRulesError = require('../lib/business-rules-error');

const businessRules = (appealType, data, config) => {
  if (!isValid(appealType)) {
    throw new BusinessRulesError(`${appealType} is not a valid appeal type`);
  }

  switch (appealType) {
    case APPEAL_ID.HOUSEHOLDER:
      return householderAppeal.validate(data, config);
    default:
      throw new BusinessRulesError(`No business rules schema found for appeal type ${appealType}`);
  }
};

module.exports = businessRules;
