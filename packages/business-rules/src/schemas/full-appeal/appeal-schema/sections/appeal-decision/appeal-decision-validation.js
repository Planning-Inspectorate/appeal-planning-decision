const { PROCEDURE_TYPE } = require('../../../../../constants');
const pinsYup = require('../../../../../lib/pins-yup');

const appealDecisionValidation = () => {
	return pinsYup
		.object()
		.shape({
			procedureType: pinsYup.lazy((procedureType) => {
				if (procedureType) {
					return pinsYup.string().oneOf(Object.values(PROCEDURE_TYPE));
				}
				return pinsYup.string().nullable().default(null);
			}),
			hearing: pinsYup
				.object()
				.shape({
					reason: pinsYup.string().trim().max(255).nullable()
				})
				.noUnknown(true),
			inquiry: pinsYup
				.object()
				.shape({
					reason: pinsYup.string().trim().max(255).nullable(),
					expectedDays: pinsYup.number().integer().min(1).max(999).nullable()
				})
				.noUnknown(true),
			draftStatementOfCommonGround: pinsYup
				.object()
				.shape({
					uploadedFile: pinsYup
						.object()
						.shape({
							id: pinsYup.string().trim().uuid().nullable().default(null),
							name: pinsYup.string().trim().max(255).ensure(),
							fileName: pinsYup.string().trim().max(255).ensure(),
							originalFileName: pinsYup.string().trim().max(255).ensure(),
							location: pinsYup.string().trim().nullable(),
							size: pinsYup.number().nullable(),
							horizonDocumentType: pinsYup.string().nullable(),
							horizonDocumentGroupType: pinsYup.string().nullable()
						})
						.noUnknown(true)
				})
				.noUnknown(true)
		})
		.noUnknown(true);
};

module.exports = appealDecisionValidation;
