const {
	getDocuments,
	formatEnforcementApplicationSubmissionUsers,
	getEnforcementListedAppellantSubmissionFields
} = require('../utils');
const {
	CASE_TYPES: { ENFORCEMENT_LISTED }
} = require('@pins/common/src/database/data-static');

/**
 * @type {import('../utils').AppellantSubmissionMapper}
 */
exports.formatter = async (appellantSubmission, lpa) => {
	return {
		casedata: {
			// @ts-ignore
			caseType: ENFORCEMENT_LISTED.key,
			...getEnforcementListedAppellantSubmissionFields(appellantSubmission, lpa)
		},
		documents: await getDocuments(appellantSubmission),
		// @ts-ignore
		users: formatEnforcementApplicationSubmissionUsers(appellantSubmission)
	};
};
