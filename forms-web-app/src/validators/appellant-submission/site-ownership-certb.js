const { body } = require('express-validator');

const ruleSiteOwnershipCertB = () =>
  body('have-other-owners-been-told')
    .notEmpty()
    .withMessage('Select yes if you have told the other owners')
    .bail()
    .isIn(['yes', 'no']);

const rules = () => {
  return [ruleSiteOwnershipCertB()];
};

module.exports = {
  rules,
};
