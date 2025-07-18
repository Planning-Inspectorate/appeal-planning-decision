const {
	getDocuments,
	formatApplicationSubmissionUsers,
	getCommonAppellantSubmissionFields,
	getHASAppellantSubmissionFields,
	getS20AppellantSubmissionFields
} = require('../utils');
const { APPEAL_CASE_TYPE } = require('@planning-inspectorate/data-model');

/**
 * @type {import('../utils').AppellantSubmissionMapper}
 */
exports.formatter = async (appellantSubmission, lpa) => {
	return {
		casedata: {
			// Root
			caseType: APPEAL_CASE_TYPE.Y,
			// Common
			...getCommonAppellantSubmissionFields(appellantSubmission, lpa),
			// HAS
			...getHASAppellantSubmissionFields(appellantSubmission),
			// S20
			...getS20AppellantSubmissionFields(appellantSubmission)
		},
		documents: await getDocuments(appellantSubmission),
		users: formatApplicationSubmissionUsers(appellantSubmission)
	};
};
