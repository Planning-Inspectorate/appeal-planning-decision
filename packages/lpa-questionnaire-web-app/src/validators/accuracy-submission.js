const { body } = require('express-validator');

const rules = () => {
  const accurateSubmissionRef = 'accurate-submission';
  const accurateSubmissionValues = ['yes', 'no'];
  const inaccuracyReasonRef = 'inaccuracy-reason';

  return [
    body(accurateSubmissionRef)
      .notEmpty()
      .withMessage('Select yes if the information accurately reflects the planning application')
      .bail()
      .isIn(accurateSubmissionValues),
    body(inaccuracyReasonRef)
      .if(body(accurateSubmissionRef).equals('no'))
      .notEmpty()
      .withMessage(
        'Enter details of why this does not accurately reflect the planning application'
      ),
  ];
};

module.exports = {
  rules,
};
