const {
	getDocuments,
	formatApplicationSubmissionUsers,
	getCommonAppellantSubmissionFields,
	getHASAppellantSubmissionFields
} = require('../utils');
const { APPEAL_CASE_TYPE } = require('pins-data-model');

/**
 * @type {import('../utils').AppellantSubmissionMapper}
 */
exports.formatter = async (appellantSubmission, lpa) => {
	return {
		casedata: {
			// Root
			caseType: APPEAL_CASE_TYPE.D,
			// Common
			...getCommonAppellantSubmissionFields(appellantSubmission, lpa),
			// HAS
			...getHASAppellantSubmissionFields(appellantSubmission)
		},
		documents: await getDocuments(appellantSubmission),
		users: formatApplicationSubmissionUsers(appellantSubmission)
	};
};
