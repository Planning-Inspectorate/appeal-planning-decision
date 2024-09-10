/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('./has').Submission} Submission
 * @typedef {Omit<LPAQuestionnaireSubmission, "AppealCase">} Answers
 * @typedef {import('../documents').Documents} Documents
 * @typedef {import ('pins-data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 */

const { getDocuments, howYouNotifiedPeople } = require('../utils');
const { documentTypes } = require('@pins/common/src/document-types');

/**
 * @param {string} caseReference
 * @param {LPAQuestionnaireSubmission} questionnaireResponse
 * @returns {Promise<LPAQuestionnaireCommand>}
 */
exports.formatter = async (caseReference, { ...answers }) => {
	return {
		casedata: {
			caseReference: caseReference,
			lpaQuestionnaireSubmittedDate: new Date().toISOString(),
			isCorrectAppealType: answers.correctAppealType,
			affectedListedBuildingNumbers: answers.SubmissionListedBuilding?.map(
				({ reference }) => reference
			),
			inConservationArea: answers.conservationArea,
			isGreenBelt: answers.greenBelt,
			notificationMethod: howYouNotifiedPeople(answers),
			siteAccessDetails: answers.lpaSiteAccess_lpaSiteAccessDetails
				? [answers.lpaSiteAccess_lpaSiteAccessDetails]
				: null,
			siteSafetyDetails: answers.lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails
				? [answers.lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails]
				: null,
			neighbouringSiteAddresses: answers.SubmissionAddress?.filter((address) => {
				return address.fieldName === 'neighbourSiteAddress';
			}).map((address) => {
				return {
					neighbouringSiteAddressLine1: address.addressLine1,
					neighbouringSiteAddressLine2: address.addressLine2,
					neighbouringSiteAddressTown: address.townCity,
					neighbouringSiteAddressCounty: address.county,
					neighbouringSiteAddressPostcode: address.postcode,
					neighbouringSiteAccessDetails: null, // not asked
					neighbouringSiteSafetyDetails: null // not asked
				};
			}),
			nearbyCaseReferences: answers.SubmissionLinkedCase?.map(({ caseReference }) => caseReference),
			newConditionDetails: answers.newConditions_newConditionDetails ?? null,

			lpaStatement: '', // not asked
			lpaCostsAppliedFor: null // not asked
		},
		documents: await getDocuments(answers, documentTypes.planningOfficersReportUpload.dataModelName)
	};
};
