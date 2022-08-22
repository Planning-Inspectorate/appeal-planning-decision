const { KNOW_THE_OWNERS, STANDARD_TRIPLE_CONFIRM_OPTIONS } = require('../../../../../constants');
const pinsYup = require('../../../../../lib/pins-yup');

const appealSiteValidation = () => {
	return pinsYup
		.object()
		.shape({
			siteAddress: pinsYup
				.object()
				.shape({
					addressLine1: pinsYup.string().max(60).nullable(),
					addressLine2: pinsYup.string().max(60).nullable(),
					town: pinsYup.string().max(60).nullable(),
					county: pinsYup.string().max(60).nullable(),
					postcode: pinsYup.string().max(8).nullable()
				})
				.noUnknown(true),
			siteOwnership: pinsYup
				.object()
				.shape({
					ownsSomeOfTheLand: pinsYup.bool().nullable(),
					ownsAllTheLand: pinsYup.bool().nullable(),
					knowsTheOwners: pinsYup.lazy((knowsTheOwners) => {
						if (knowsTheOwners) {
							return pinsYup.string().oneOf(Object.values(KNOW_THE_OWNERS));
						}
						return pinsYup.string().nullable();
					}),
					hasIdentifiedTheOwners: pinsYup.bool().nullable(),
					tellingTheLandowners: pinsYup
						.array()
						.nullable()
						.allOfValidOptions(STANDARD_TRIPLE_CONFIRM_OPTIONS),
					advertisingYourAppeal: pinsYup
						.array()
						.nullable()
						.allOfValidOptions(STANDARD_TRIPLE_CONFIRM_OPTIONS)
				})
				.noUnknown(true),
			agriculturalHolding: pinsYup
				.object()
				.shape({
					isAgriculturalHolding: pinsYup.bool().nullable(),
					isTenant: pinsYup.bool().nullable(),
					hasOtherTenants: pinsYup.bool().nullable(),
					tellingTheTenants: pinsYup
						.array()
						.nullable()
						.allOfValidOptions(STANDARD_TRIPLE_CONFIRM_OPTIONS)
				})
				.noUnknown(true),
			visibleFromRoad: pinsYup
				.object()
				.shape({
					isVisible: pinsYup.bool().nullable(),
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
					hasIssues: pinsYup.bool().nullable(),
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

module.exports = appealSiteValidation;
