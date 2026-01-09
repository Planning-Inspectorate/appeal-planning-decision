const {
	getDocuments,
	formatApplicationSubmissionUsers,
	getCommonAppellantSubmissionFields
} = require('../utils');
const {
	CASE_TYPES: { LDC }
} = require('@pins/common/src/database/data-static');

/**
 * @type {import('../utils').AppellantSubmissionMapper}
 */
exports.formatter = async (appellantSubmission, lpa) => {
	return {
		casedata: {
			caseType: LDC.key,
			...getCommonAppellantSubmissionFields(appellantSubmission, lpa)
		},
		documents: await getDocuments(appellantSubmission),
		users: formatApplicationSubmissionUsers(appellantSubmission)
	};
};
