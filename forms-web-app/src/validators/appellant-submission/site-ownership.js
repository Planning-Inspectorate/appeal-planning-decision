const { body } = require('express-validator');

const ruleSiteOwnership = () =>
  body('site-ownership')
    .notEmpty()
    .withMessage('Select yes if you own the whole appeal site')
    .bail()
    .isIn(['yes', 'no']);

const rules = () => {
  return [ruleSiteOwnership()];
};

module.exports = {
  rules,
};
