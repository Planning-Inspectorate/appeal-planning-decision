const {
	getDocuments,
	formatApplicationSubmissionUsers,
	getCommonAppellantSubmissionFields,
	getS20AppellantSubmissionFields
} = require('../utils');
const { APPEAL_CASE_TYPE } = require('@planning-inspectorate/data-model');

/**
 * @type {import('../utils').AppellantSubmissionMapper}
 */
exports.formatter = async (appellantSubmission, lpa) => {
	return {
		casedata: {
			caseType: APPEAL_CASE_TYPE.Y,
			...getCommonAppellantSubmissionFields(appellantSubmission, lpa),
			...getS20AppellantSubmissionFields(appellantSubmission)
		},
		documents: await getDocuments(appellantSubmission),
		users: formatApplicationSubmissionUsers(appellantSubmission)
	};
};
