const householderAppeal = require('./householder-appeal');
const fullPlanning = require('./full-planning');
const isValid = require('../validation/appeal/type/is-valid');
const { APPEAL_ID } = require('../constants');
const BusinessRulesError = require('../lib/business-rules-error');

const validate = (action, data, config = { abortEarly: false }) => {
  const { appealType } = data;

  if (!isValid(appealType)) {
    throw new BusinessRulesError(`${appealType} is not a valid appeal type`);
  }

  switch (appealType) {
    case APPEAL_ID.HOUSEHOLDER:
      return householderAppeal[action].validate(data, config);
    case APPEAL_ID.PLANNING_SECTION_78:
      return fullPlanning[action].validate(data, config);
    default:
      throw new BusinessRulesError(`No schema found for appeal type ${appealType}`);
  }
};

const insert = (data, config) => validate('insert', data, config);
const update = (data, config) => validate('update', data, config);

module.exports = {
  insert,
  update,
  validate,
};
