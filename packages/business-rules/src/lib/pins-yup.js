const yup = require('yup');
const { appeal } = require('../validators');

yup.addMethod(yup.date, 'isInThePast', appeal.decisionDate.isInThePast);
yup.addMethod(yup.date, 'isWithinDeadlinePeriod', appeal.decisionDate.isWithinDeadlinePeriod);

module.exports = yup;
