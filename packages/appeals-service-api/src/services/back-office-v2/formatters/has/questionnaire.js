const { initContainerClient } = require('@pins/common');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { blobMetaGetter } = require('../../../../services/object-store');

const getBlobMeta = blobMetaGetter(initContainerClient);

/**
 * @param {*} questionnaireResponse
 * @returns {Promise<*>}
 */
exports.formatter = async ({ LPACode, referenceId, answers }) => {
	const uploadedFiles = Object.values(answers).reduce((acc, answer) => {
		if (!answer.uploadedFiles) return acc;
		return acc.concat(answer.uploadedFiles);
	}, []);

	const uploadedFilesAndBlobMeta = await conjoinedPromises(uploadedFiles, (uploadedFile) =>
		getBlobMeta(uploadedFile.location)
	);

	return [
		{
			questionnaire: {
				LPACode: LPACode,
				caseReference: referenceId,
				isAppealTypeAppropriate: convertToBoolean(answers['correct-appeal-type']),
				doesTheDevelopmentAffectTheSettingOfAListedBuilding: convertToBoolean(
					answers['affects-listed-building']
				),
				affectedListedBuildings:
					answers['affects-listed-building'] === 'yes'
						? convertFromAddMore(answers['add-listed-buildings'])
						: undefined,
				inCAOrRelatesToCA: convertToBoolean(answers['conservation-area']),
				siteWithinGreenBelt: convertToBoolean(answers['green-belt']),
				howYouNotifiedPeople: howYouNotifiedPeople(answers),
				hasRepresentationsFromOtherParties: convertToBoolean(
					answers['representations-other-parties']
				),
				doesSiteHaveHealthAndSafetyIssues: convertToBoolean(answers['safety-risks']),
				healthAndSafetyIssuesDetails:
					answers['safety-risks'] === 'yes'
						? answers['safety-risks_new-safety-risk-value']
						: undefined,
				doesSiteRequireInspectorAccess: convertToBoolean(answers['inspector-access-appeal-site']),
				doPlansAffectNeighbouringSite: convertToBoolean(answers['inspector-visit-neighbour']),
				hasExtraConditions: convertToBoolean(answers['new-planning-conditions']),
				extraConditions:
					answers['new-planning-conditions'] === 'yes'
						? answers['safety-risks_new-conditions-value']
						: undefined,
				// todo waititng on odw
				// answers['inspector-visit-neighbour'] - should this be housed in the same property as above possibly doNeightboursAffectNeighboringSite
				// newPlanningConditions: answers['new-planning-conditions'],
				// todo this is with odw
				// answers['other-ongoing-appeals'] // fieldname needs clarifying
				nearbyCaseReferences:
					answers['other-ongoing-appeals'] === 'yes'
						? convertFromAddMore(answers['other-appeals-references'])
						: undefined
			},
			documents: Array.from(uploadedFilesAndBlobMeta).map(
				([
					{ fileName, originalFileName, size },
					{ lastModified, createdOn, metadata, _response }
				]) => ({
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
			)
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
