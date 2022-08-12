const pinsYup = require('../../../../../lib/pins-yup');
const appealPdfStatementValidation = require('./appeal-pdf-statement/appeal-pdf-statement-validation');

const appealSubmissionValidation = () => {
	return pinsYup.object().shape({
		appealPDFStatement: appealPdfStatementValidation()
	});
};

module.exports = appealSubmissionValidation;
