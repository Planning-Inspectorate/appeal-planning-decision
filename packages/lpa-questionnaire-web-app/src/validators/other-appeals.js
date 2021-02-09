const { body } = require('express-validator');

const rules = () => {
  const adjacentAppealsRef = 'adjacent-appeals';
  const adjacentAppealsValues = ['yes', 'no'];
  const appealNumbersRef = 'appeal-reference-numbers';

  return [
    body(adjacentAppealsRef)
      .notEmpty()
      .withMessage('Select yes if there are other appeals still being considered')
      .bail()
      .isIn(adjacentAppealsValues),
    body(appealNumbersRef)
      .if(body(adjacentAppealsRef).equals('yes'))
      .notEmpty()
      .withMessage('Enter appeal reference number(s)'),
  ];
};

module.exports = {
  rules,
};
