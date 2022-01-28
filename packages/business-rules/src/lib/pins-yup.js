const yup = require('yup');
const { appeal } = require('../validators');

yup.addMethod(yup.date, 'isInThePast', appeal.decisionDate.isInThePast);
yup.addMethod(yup.date, 'isWithinDeadlinePeriod', appeal.decisionDate.isWithinDeadlinePeriod);
yup.addMethod(yup.mixed, 'conditionalText', appeal.conditionalText);

module.exports = yup;
