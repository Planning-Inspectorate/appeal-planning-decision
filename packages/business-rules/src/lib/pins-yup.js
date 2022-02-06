const yup = require('yup');
const { appeal } = require('../validators');

yup.addMethod(yup.date, 'isInThePast', appeal.decisionDate.isInThePast);
yup.addMethod(yup.mixed, 'conditionalText', appeal.conditionalText);

module.exports = yup;
