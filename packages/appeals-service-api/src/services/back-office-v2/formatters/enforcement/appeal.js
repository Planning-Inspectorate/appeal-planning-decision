const {
	getDocuments,
	formatEnforcementApplicationSubmissionUsers,
	getCommonEnforcementAppellantSubmissionFields,
	getEnforcementNoticeAppellantSubmissionFields
} = require('../utils');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const ENFORCEMENT = CASE_TYPES.ENFORCEMENT;

/**
 * @type {import('../utils').AppellantSubmissionMapper}
 */
exports.formatter = async (appellantSubmission, lpa) => {
	return {
		casedata: {
			caseType: ENFORCEMENT.key,
			...getCommonEnforcementAppellantSubmissionFields(appellantSubmission, lpa),
			...getEnforcementNoticeAppellantSubmissionFields(appellantSubmission)
		},
		documents: await getDocuments(appellantSubmission),
		users: formatEnforcementApplicationSubmissionUsers(appellantSubmission)
	};
};
