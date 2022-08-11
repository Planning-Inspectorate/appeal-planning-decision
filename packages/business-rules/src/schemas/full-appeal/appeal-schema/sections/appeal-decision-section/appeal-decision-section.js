const { PROCEDURE_TYPE } = require('../../../../../constants');
const pinsYup = require('../../../../../lib/pins-yup');
const { stringValidation } = require('../../../../components/insert/string-validation');
const { uploadedFileValidation } = require('../../../../components/insert/uploadedFileValidation');

const appealDecisionSectionValidation = () => {
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
					reason: stringValidation(255)
				})
				.noUnknown(true),
			inquiry: pinsYup
				.object()
				.shape({
					reason: stringValidation(255),
					expectedDays: pinsYup.number().integer().min(1).max(999).nullable()
				})
				.noUnknown(true),
			draftStatementOfCommonGround: pinsYup
				.object()
				.shape({
					uploadedFile: uploadedFileValidation()
				})
				.noUnknown(true)
		})
		.noUnknown(true);
};

module.exports = { appealDecisionSectionValidation };
