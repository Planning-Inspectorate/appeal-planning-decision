const {
	getDocuments,
	formatApplicationSubmissionUsers,
	getCommonAppellantSubmissionFields,
	getHASAppellantSubmissionFields,
	getS78AppellantSubmissionFields
} = require('../utils');
const { APPEAL_CASE_TYPE } = require('pins-data-model');

/**
 * @type {import('../utils').AppellantSubmissionMapper}
 */
exports.formatter = async (appellantSubmission, lpa) => {
	return {
		casedata: {
			// Root
			caseType: APPEAL_CASE_TYPE.W,
			// Common
			...getCommonAppellantSubmissionFields(appellantSubmission, lpa),
			// HAS
			...getHASAppellantSubmissionFields(appellantSubmission),
			// S78
			...getS78AppellantSubmissionFields(appellantSubmission)
		},
		documents: await getDocuments(appellantSubmission),
		users: formatApplicationSubmissionUsers(appellantSubmission)
	};
};
