const yup = require('yup');
const { appeal } = require('@pins/business-rules');

function validate(validationErrorMessage = defaultErrorMessage) {
  return this.test('decisionDate', validationErrorMessage, (givenDate) =>
    appeal.decisionDate(givenDate)
  );
}

yup.addMethod(yup.date, 'isInThePast', validate);
