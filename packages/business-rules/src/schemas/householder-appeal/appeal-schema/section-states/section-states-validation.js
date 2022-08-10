const pinsYup = require('../../../../lib/pins-yup');
const aboutYouStateValidation = require('./about-you-state/about-you-state-validation');
const appealSiteStateValidation = require('./appeal-site-state/appeal-site-state-validation');
const requiredDocumentsStateValidation = require('./required-documents-state/required-documents-state-validation');
const yourAppealStateValidation = require('./your-appeal-state/your-appeal-state-validation');

const sectionStatesValidation = () => {
	return pinsYup.object().shape({
		aboutYouSection: aboutYouStateValidation(),
		requiredDocumentsSection: requiredDocumentsStateValidation(),
		yourAppealSection: yourAppealStateValidation(),
		appealSiteSection: appealSiteStateValidation()
	});
};

module.exports = sectionStatesValidation;
