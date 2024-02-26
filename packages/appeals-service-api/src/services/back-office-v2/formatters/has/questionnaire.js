const { initContainerClient } = require('@pins/common');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { blobMetaGetter } = require('../../../../services/object-store');

const getBlobMeta = blobMetaGetter(initContainerClient);

/**
 * @param {*} questionnaireResponse
 * @returns {Promise<*>}
 */
exports.formatter = async ({ LPACode, referenceId, answers }) => {
	return [
		{
			questionnaire: {
				LPACode: LPACode,
				caseReference: referenceId,
				isAppealTypeAppropriate: convertToBoolean(answers['correct-appeal-type']),
				doesTheDevelopmentAffectTheSettingOfAListedBuilding: convertToBoolean(
					answers['affects-listed-building']
				),
				affectedListedBuildings: convertFromAddMore(answers['add-listed-buildings']),
				inCAOrRelatesToCA: convertToBoolean(answers['conservation-area']),
				siteWithinGreenBelt: convertToBoolean(answers['green-belt']),
				howYouNotifiedPeople: howYouNotifiedPeople(answers),
				hasRepresentationsFromOtherParties: convertToBoolean(
					answers['representations-other-parties']
				),
				doesSiteHaveHealthAndSafetyIssues: convertToBoolean(answers['safety-risks']),
				healthAndSafetyIssuesDetails: answers['safety-risks_new-safety-risk-value'],
				doesSiteRequireInspectorAccess: convertToBoolean(answers['inspector-access-appeal-site']),
				doPlansAffectNeighbouringSite: convertToBoolean(answers['inspector-visit-neighbour']),
				hasExtraConditions: convertToBoolean(answers['new-planning-conditions']),
				extraConditions: answers['safety-risks_new-conditions-value'],
				// todo waititng on odw
				// answers['inspector-visit-neighbour'] - should this be housed in the same property as above possibly doNeightboursAffectNeighboringSite
				// newPlanningConditions: answers['new-planning-conditions'],
				// todo this is with odw
				// answers['other-ongoing-appeals'] // fieldname needs clarifying
				nearbyCaseReferences: convertFromAddMore(answers['other-appeals-references'])
			},
			documents: await getDocuments(answers)
		}
	];
};

/**
 * @param {string} value
 * @returns {boolean | null}
 */
const convertToBoolean = (value) => {
	switch (value) {
		case 'yes':
			return true;
		case 'no':
			return false;
		default:
			return null;
	}
};

/**
 * @param {Array<{ value: unknown }>} values
 * @returns {Array<unknown>}
 */
const convertFromAddMore = (values) => values.map(({ value }) => value, []);

/**
 * @param {*} answers
 * @returns {string[]}
 */
const howYouNotifiedPeople = (answers) => {
	let notifiedPeople = [];
	if (answers['display-site-notice'] === 'yes') {
		notifiedPeople.push('A public notice at the site');
	}
	if (answers['letters-to-neighbours'] === 'yes') {
		notifiedPeople.push('Letters to neighbours');
	}
	if (answers['press-advert'] === 'yes') {
		notifiedPeople.push('Advert in the local press');
	}
	return notifiedPeople;
};

/**
 * @param {*} answers
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
const getDocuments = async (answers) => {
	const uploadedFiles = Object.values(answers).reduce((acc, answer) => {
		if (!answer.uploadedFiles) return acc;
		return acc.concat(answer.uploadedFiles);
	}, []);

	const uploadedFilesAndBlobMeta = await conjoinedPromises(uploadedFiles, (uploadedFile) =>
		getBlobMeta(uploadedFile.location)
	);

	return Array.from(uploadedFilesAndBlobMeta).map(
		([{ fileName, originalFileName, size }, { lastModified, createdOn, metadata, _response }]) => ({
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
