/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('./s78').Submission} Submission
 * @typedef {import('../documents').Documents} Documents
 */

const { toBool, getDocuments } = require('../utils');
const { documentTypes } = require('@pins/common/src/document-types');

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
			addChangedListedBuilding: answers.addChangedListedBuilding,
			areaOutstandingBeauty: answers.areaOutstandingBeauty,
			changesListedBuilding: answers.changesListedBuilding,
			changedListedBuildingNumber: Number(answers.changedListedBuildingNumber),
			columnTwoThreshold: answers.columnTwoThreshold,
			completedEnvironmentalStatement: answers.environmentalStatement,
			consultationResponses: answers.consultationResponses,
			consultedBodiesDetails: answers.statutoryConsultees_consultedBodiesDetails,
			designatedSites: answers.designatedSites,
			developmentDescription: answers.developmentDescription,
			emergingPlan: answers.emergingPlan,
			environmentalImpactSchedule: answers.environmentalImpactSchedule,
			gypsyTraveller: answers.gypsyTraveller,
			infrastructureLevy: answers.infrastructureLevy,
			infrastructureLevyAdopted: answers.infrastructureLevyAdopted,
			infrastructureLevyAdoptedDate: answers.infrastructureLevyAdoptedDate,
			infrastructureLevyExpectedDate: answers.infrastructureLevyExpectedDate,
			lpaFinalComment: null, // are we collecting this?
			lpaFinalCommentDetails: null, // are we collecting this?
			lpaPreferHearingDetails: answers.lpaPreferHearingDetails,
			lpaPreferInquiryDetails: answers.lpaPreferInquiryDetails,
			lpaPreferInquiryDuration: answers.lpaProcedurePreference_lpaPreferInquiryDuration,
			lpaProcedurePreference: answers.lpaProcedurePreference,
			lpaWitnesses: null, // are we collecting this?
			otherDesignationDetails: answers.designatedSites_otherDesignations,
			protectedSpecies: answers.protectedSpecies,
			publicRightOfWay: answers.publicRightOfWay,
			requiresEnvironmentalStatement: answers.environmentalStatement,
			scheduledMonument: answers.affectsScheduledMonument,
			screeningOpinion: answers.screeningOpinion,
			sensitiveArea: toBool(answers.sensitiveArea),
			sensitiveAreaDetails: answers.sensitiveArea_sensitiveAreaDetails,
			statutoryConsultees: toBool(answers.statutoryConsultees),
			supplementaryPlanningDocs: answers.supplementaryPlanningDocs,
			treePreservationOrder: answers.treePreservationOrder
		},
		documents: await getDocuments(answers, documentTypes.planningOfficersReportUpload.dataModelName)
	};
};
