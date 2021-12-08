const { body } = require('express-validator');

const rules = () => {
  return [
    body('option')
      .custom((value, { req }) => {
        const { option } = req.body;

        if (typeof option === 'undefined' || option === '') {
          return false;
        }

        return true;
      })
      .withMessage('Select if your appeal is about any of the following'),
  ];
};

module.exports = {
  rules,
};
