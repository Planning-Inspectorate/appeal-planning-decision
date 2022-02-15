const { body } = require('express-validator');
const validateCheckboxValueAgainstOptions = require('../utils/validate-checkbox-against-options');
const toArray = require('../../lib/to-array');

const buildCheckboxValidation = (fieldName, validOptions, ruleOptions = {}) => {
  const { notEmptyMessage, allMandatoryMessage } = ruleOptions;
  let validationChain = body(fieldName);
  if (notEmptyMessage) {
    validationChain = validationChain.notEmpty().withMessage(notEmptyMessage).bail();
  }
  validationChain = validationChain
    .custom((value) => validateCheckboxValueAgainstOptions(value, validOptions))
    .bail();

  if (allMandatoryMessage) {
    validationChain = validationChain.custom((value) => {
      const valueArray = toArray(value);
      if (valueArray.length < validOptions.length) {
        throw new Error(allMandatoryMessage);
      }
      return true;
    });
  }

  return [validationChain];
};

module.exports = {
  buildCheckboxValidation,
};
