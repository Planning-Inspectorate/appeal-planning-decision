const {
	getDocuments,
	formatEnforcementApplicationSubmissionUsers,
	getEnforcementAppellantSubmissionFields
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
			...getEnforcementAppellantSubmissionFields(appellantSubmission, lpa)
		},
		documents: await getDocuments(appellantSubmission),
		users: formatEnforcementApplicationSubmissionUsers(appellantSubmission)
	};
};
