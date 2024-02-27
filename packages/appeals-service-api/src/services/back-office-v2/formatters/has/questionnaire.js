const { initContainerClient } = require('@pins/common');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { blobMetaGetter } = require('../../../../services/object-store');

/**
 * @typedef {import('../../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {Omit<LPAQuestionnaireSubmission, "AppealCase">} Answers
 */

const getBlobMeta = blobMetaGetter(initContainerClient);

/**
 * @param {string} caseReference
 * @param {LPAQuestionnaireSubmission} questionnaireResponse
 * @returns {Promise<*>}
 */
exports.formatter = async (caseReference, { AppealCase: { LPACode }, ...answers }) => {
	return [
		{
			questionnaire: {
				LPACode: LPACode,
				caseReference,
				isAppealTypeAppropriate: answers.correctAppealType,
				doesTheDevelopmentAffectTheSettingOfAListedBuilding: answers.affectsListedBuilding,
				affectedListedBuildings: answers.affectedListedBuildingNumber,
				inCAOrRelatesToCA: answers.conservationArea,
				siteWithinGreenBelt: answers.greenBelt,
				howYouNotifiedPeople: howYouNotifiedPeople(answers),
				hasRepresentationsFromOtherParties: answers.otherPartyRepresentations,
				doesSiteHaveHealthAndSafetyIssues: answers.lpaSiteSafetyRisks,
				healthAndSafetyIssuesDetails: answers.lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails,
				doesSiteRequireInspectorAccess: answers.lpaSiteAccess,
				doPlansAffectNeighbouringSite: answers.neighbourSiteAccess,
				hasExtraConditions: answers.newConditions,
				extraConditions: answers.newConditions_newConditionDetails,
				// todo waititng on odw
				// answers['inspector-visit-neighbour'] - should this be housed in the same property as above possibly doNeightboursAffectNeighboringSite
				// newPlanningConditions: answers['new-planning-conditions'],
				// todo this is with odw
				// answers['other-ongoing-appeals'] // fieldname needs clarifying
				nearbyCaseReferences: answers.nearbyAppealReference
			},
			documents: await getDocuments(answers)
		}
	];
};

/**
 * @param {Answers} answers
 * @returns {string[]}
 */
const howYouNotifiedPeople = (answers) => {
	let notifiedPeople = [];
	if (answers.displaySiteNotice) {
		notifiedPeople.push('A public notice at the site');
	}
	if (answers.lettersToNeighbours) {
		notifiedPeople.push('Letters to neighbours');
	}
	if (answers.pressAdvert) {
		notifiedPeople.push('Advert in the local press');
	}
	return notifiedPeople;
};

/**
 * @param {Answers} answers
 * @returns {Promise<{
 *   filename: string;
 *   originalFilename: string;
 *   size: number;
 *   mime: string;
 *   documentURI: string;
 *   dateCreated: string;
 *   lastModified: string;
 *   documentType: string;
 *   sourceSystem: string;
 *   origin: string;
 *   stage: string;
 * }[]>}
 */

const getDocuments = async ({ SubmissionDocumentUpload }) => {
	const uploadedFilesAndBlobMeta = await conjoinedPromises(
		SubmissionDocumentUpload,
		(uploadedFile) => getBlobMeta(uploadedFile.location)
	);

	return Array.from(uploadedFilesAndBlobMeta).map(
		([{ fileName, originalFileName }, { lastModified, createdOn, metadata, size, _response }]) => ({
			filename: fileName,
			originalFilename: originalFileName,
			size: size,
			mime: metadata.mime_type,
			documentURI: _response.request.url,
			dateCreated: createdOn,
			lastModified,
			documentType: metadata.document_type,
			sourceSystem: 'appeals',
			origin: 'citizen',
			stage: 'lpa_questionnaire'
		})
	);
};
