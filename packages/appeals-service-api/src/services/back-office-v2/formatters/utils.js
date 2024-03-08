const { initContainerClient } = require('@pins/common');
const { blobMetaGetter } = require('../../../services/object-store');
const { conjoinedPromises } = require('@pins/common/src/utils');

/**
 * @typedef {import('../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {Omit<LPAQuestionnaireSubmission, "AppealCase">} Answers
 * @typedef {import('./documents').Documents} Documents
 */

const getBlobMeta = blobMetaGetter(initContainerClient);

/**
 * @param {string | null} str
 * @returns {boolean}
 */
exports.toBool = (str) => str === 'yes';

/**
 * @param {Answers} answers
 * @returns {Promise<Documents>}
 */

exports.getDocuments = async ({ SubmissionDocumentUpload }) => {
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

/**
 * @param {{
 *  id: string;
 *  questionnaireId: string;
 *  addressLine1: string;
 *  addressLine2: string | null;
 *  townCity: string;
 *  postcode: string;
 * }[]} addresses
 * @returns {{
 *   line1: string | null;
 *   line2: string | null;
 *   town: string | null;
 *   county: string | null;
 *   postcode: string | null;
 * }[]}
 */
exports.formatAddresses = (addresses) =>
	addresses.map((address) => ({
		line1: address.addressLine1,
		line2: address.addressLine2,
		town: address.townCity,
		county: null,
		postcode: address.postcode
	}));

/**
 * @param {Answers} answers
 * @returns {string[]}
 */
exports.howYouNotifiedPeople = (answers) => {
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
