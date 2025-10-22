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
const ADVERTS = CASE_TYPES.ADVERTS;

/**
 * @type {import('../utils').AppellantSubmissionMapper}
 */
exports.formatter = async (appellantSubmission, lpa) => {
	if (
		![CAS_ADVERTS.processCode, ADVERTS.processCode].includes(appellantSubmission.appealTypeCode)
	) {
		throw new Error(
			`appealTypeCode ${appellantSubmission.appealTypeCode} not supported by adverts formatter`
		);
	}

	return {
		casedata: {
			// type
			caseType: CASE_TYPES[appellantSubmission.appealTypeCode].key,
			// Common
			...getCommonAppellantSubmissionFields(appellantSubmission, lpa),
			// Adverts specific
			...getAdvertsAppellantSubmissionFields(appellantSubmission)
		},
		documents: await getDocuments(appellantSubmission),
		users: formatApplicationSubmissionUsers(appellantSubmission)
	};
};
