/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('./has').Submission} Submission
 * @typedef {Omit<LPAQuestionnaireSubmission, "AppealCase">} Answers
 * @typedef {import('../documents').Documents} Documents
 */

const { getDocuments, howYouNotifiedPeople, toBool, formatAddresses } = require('../utils');

/**
 * @param {string} caseReference
 * @param {LPAQuestionnaireSubmission} questionnaireResponse
 * @returns {Promise<{
 *   LPACode: string;
 *   caseReference: string;
 *   questionnaire: Submission;
 *   documents: Documents
 * }>}
 */
exports.formatter = async (caseReference, { AppealCase: { LPACode }, ...answers }) => {
	return {
		LPACode: LPACode,
		caseReference,
		questionnaire: {
			addAffectedListedBuilding: answers.addAffectedListedBuilding,
			addNearbyAppeal: answers.nearbyAppeals,
			addNeighbouringSiteAccess: answers.addNeighbourSiteAccess,
			affectedListedBuildingNumber: Number(answers.changedListedBuildingNumber),
			affectsListedBuilding: answers.affectsListedBuilding,
			conservationArea: answers.conservationArea,
			correctAppealType: answers.correctAppealType,
			greenBelt: answers.greenBelt,
			lpaSiteAccess: toBool(answers.lpaSiteAccess),
			lpaSiteAccessDetails: answers.lpaSiteAccess_lpaSiteAccessDetails,
			lpaSiteSafety: toBool(answers.lpaSiteSafetyRisks),
			lpaSiteSafetyDetails: answers.lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails,
			lpaStatement: null, // are we collecting this?
			lpaStatementDocuments: null, // are we collecting this?
			nearbyAppeals: answers.nearbyAppeals,
			nearbyAppealReference: answers.nearbyAppealReference,
			'neighbouring-address': formatAddresses(answers.SubmissionAddress),
			neighbouringSiteAccess: toBool(answers.neighbourSiteAccess),
			neighbouringSiteAccessDetails: answers.neighbourSiteAccess_neighbourSiteAccessDetails,
			newConditionDetails: answers.newConditions_newConditionDetails,
			newConditions: toBool(answers.newConditions),
			notificationMethod: howYouNotifiedPeople(answers),
			otherPartyRepresentations: null
		},
		documents: await getDocuments(answers)
	};
};
