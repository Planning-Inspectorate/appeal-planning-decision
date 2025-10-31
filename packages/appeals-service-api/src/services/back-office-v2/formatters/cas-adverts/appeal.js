/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 */

const {
	getDocuments,
	getCommonAppellantSubmissionFields,
	getAdvertsAppellantSubmissionFields,
	formatApplicationSubmissionUsers
} = require('../utils');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const CAS_ADVERTS = CASE_TYPES.CAS_ADVERTS;

/**
 * @type {import('../utils').AppellantSubmissionMapper}
 */
exports.formatter = async (appellantSubmission, lpa) => {
	return {
		casedata: {
			// type
			caseType: CAS_ADVERTS.key,
			// Common
			...getCommonAppellantSubmissionFields(appellantSubmission, lpa),
			// Adverts specific
			...getAdvertsAppellantSubmissionFields(appellantSubmission)
		},
		documents: await getDocuments(appellantSubmission),
		users: formatApplicationSubmissionUsers(appellantSubmission)
	};
};
