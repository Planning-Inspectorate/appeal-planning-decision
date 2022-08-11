const { KNOW_THE_OWNERS, STANDARD_TRIPLE_CONFIRM_OPTIONS } = require('../../../../../constants');
const pinsYup = require('../../../../../lib/pins-yup');
const { boolValidation } = require('../../../../components/insert/bool-validation');
const {
	noTrimStringValidation,
	stringValidation
} = require('../../../../components/insert/string-validation');

const standardTripleConfirmOptionsValidation = () => {
	return pinsYup.array().nullable().allOfValidOptions(STANDARD_TRIPLE_CONFIRM_OPTIONS);
};

const appealSiteSectionValidation = () => {
	return pinsYup
		.object()
		.shape({
			siteAddress: pinsYup
				.object()
				.shape({
					addressLine1: noTrimStringValidation(60),
					addressLine2: noTrimStringValidation(60),
					town: noTrimStringValidation(60),
					county: noTrimStringValidation(60),
					postcode: noTrimStringValidation(8)
				})
				.noUnknown(true),
			siteOwnership: pinsYup
				.object()
				.shape({
					ownsSomeOfTheLand: boolValidation(),
					ownsAllTheLand: boolValidation(),
					knowsTheOwners: pinsYup.lazy((knowsTheOwners) => {
						if (knowsTheOwners) {
							return pinsYup.string().oneOf(Object.values(KNOW_THE_OWNERS));
						}
						return stringValidation();
					}),
					hasIdentifiedTheOwners: boolValidation(),
					tellingTheLandowners: standardTripleConfirmOptionsValidation(),
					advertisingYourAppeal: standardTripleConfirmOptionsValidation()
				})
				.noUnknown(true),
			agriculturalHolding: pinsYup
				.object()
				.shape({
					isAgriculturalHolding: boolValidation(),
					isTenant: boolValidation(),
					hasOtherTenants: boolValidation(),
					tellingTheTenants: standardTripleConfirmOptionsValidation()
				})
				.noUnknown(true),
			visibleFromRoad: pinsYup
				.object()
				.shape({
					isVisible: boolValidation(),
					details: pinsYup.lazy((details) => {
						return pinsYup.mixed().conditionalText({
							fieldValue: details,
							fieldName: 'details',
							targetFieldName: 'isVisible',
							emptyError: 'Tell us how visibility is restricted',
							tooLongError: 'How visibility is restricted must be $maxLength characters or less'
						});
					})
				})
				.noUnknown(true),
			healthAndSafety: pinsYup
				.object()
				.shape({
					hasIssues: boolValidation(),
					details: pinsYup.lazy((details) => {
						return pinsYup.mixed().conditionalText({
							fieldValue: details,
							fieldName: 'details',
							targetFieldName: 'hasIssues',
							targetFieldValue: true,
							emptyError: 'Tell us about the health and safety issues',
							tooLongError: 'Health and safety information must be $maxLength characters or less'
						});
					})
				})
				.noUnknown(true)
		})
		.noUnknown(true);
};

module.exports = { appealSiteSectionValidation };
