/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 */

const {
	getDocuments,
	getHASAppellantSubmissionFields,
	formatApplicationSubmissionUsers,
	getCommonAppellantSubmissionFields
} = require('../utils');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const CAS_PLANNING = CASE_TYPES.CAS_PLANNING.key;

/**
 * @type {import('../utils').AppellantSubmissionMapper}
 */
exports.formatter = async (appellantSubmission, lpa) => {
	return {
		casedata: {
			// Root
			caseType: CAS_PLANNING,
			// Common
			...getCommonAppellantSubmissionFields(appellantSubmission, lpa),
			//CAS
			...getHASAppellantSubmissionFields(appellantSubmission)
		},
		documents: await getDocuments(appellantSubmission),
		users: formatApplicationSubmissionUsers(appellantSubmission)
	};
};
