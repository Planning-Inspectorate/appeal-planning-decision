const yup = require('yup');
const {
  validation: { appeal, generic },
} = require('@pins/business-rules');

const ensureDecisionDateIsInThePast = () => {
  function validate(value, ...rest) {
    const errorMessage = rest.errorMessage || 'The Decision Date must be in the past';

    return this.test('decisionDate', errorMessage, (givenDate) => {
      return generic.date.isInThePast(givenDate);
    });
  }

  yup.addMethod(yup.date, 'isInThePast', validate);
};

const ensureDecisionDateIsInsideDeadlinePeriod = () => {
  function validate(value, ...rest) {
    const errorMessage = rest.errorMessage || 'The Decision Date has now passed';

    return this.test('decisionDate', errorMessage, (givenDate) =>
      appeal.decisionDate.isWithinDecisionDateExpiryPeriod(givenDate)
    );
  }

  yup.addMethod(yup.date, 'isWithinDecisionDateExpiryPeriod', validate);
};

ensureDecisionDateIsInThePast();
ensureDecisionDateIsInsideDeadlinePeriod();
