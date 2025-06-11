const yup = require('yup');
const { appeal } = require('../validators');

yup.addMethod(yup.date, 'isInThePast', appeal.decisionDate.isInThePast);
yup.addMethod(yup.date, 'isWithinDeadlinePeriod', appeal.decisionDate.isWithinDeadlinePeriod);
yup.addMethod(yup.mixed, 'conditionalText', appeal.conditionalText);
yup.addMethod(yup.array, 'allOfValidOptions', appeal.allOfValidOptions);
yup.addMethod(yup.array, 'allOfSelectedOptions', appeal.allOfSelectedOptions);
yup.addMethod(yup.array, 'maybeOption', appeal.maybeOption);

module.exports = yup;
