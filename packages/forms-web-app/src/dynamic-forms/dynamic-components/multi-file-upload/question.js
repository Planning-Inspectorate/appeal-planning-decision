const { removeFiles, getValidFiles } = require('../../../lib/multi-file-upload-helpers');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { mapMultiFileDocumentToSavedDocument } = require('../../../mappers/document-mapper');
const { documentTypes } = require('@pins/common');

const Question = require('../../question');

/**
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 */

/**
 * @typedef {Array} UploadedFiles
 */

/**
 * @typedef {QuestionViewModel & UploadedFiles} UploadQuestionViewModel
 */

/**
 * A multi file upload question
 * @class
 */
class MultiFileUploadQuestion extends Question {
	/**
	 * @type {Object} document type
	 */
	documentType;

	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Object} [params.documentType]
	 * @param {string} [params.html]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor({
		title,
		question,
		fieldName,
		url,
		pageTitle,
		description,
		documentType,
		validators,
		html
	}) {
		super({
			title,
			question,
			viewFolder: 'multi-file-upload',
			fieldName,
			url,
			pageTitle,
			description,
			validators,
			html
		});

		if (documentType) {
			this.documentType = documentType;
		} else {
			// default doc type
			this.documentType = documentTypes.dynamic;
		}
	}

	/**
	 * gets the view model for this question
	 * @param {Section} section - the current section
	 * @param {Journey} journey - the journey we are in
	 * @param {Object|undefined} [customViewData] additional data to send to view
	 * @returns {UploadQuestionViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData) {
		const viewModel = super.prepQuestionForRendering(section, journey, customViewData);

		const answer = journey.response.answers[this.fieldName] || '';

		if (answer.uploadedFiles) {
			viewModel.uploadedFiles = answer.uploadedFiles;
		}

		return viewModel;
	}

	checkForValidationErrors() {
		// handled after saving any valid files
		return;
	}

	/**
	 * returns the data to send to the DB
	 * side effect: modifies journeyResponse with the new answers
	 * @param {ExpressRequest} req
	 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {Promise.<Object>}
	 */
	async getDataToSave(req, journeyResponse) {
		const { body } = req;
		const { errors = {}, errorSummary = [] } = body;
		const encodedReferenceId = encodeURIComponent(journeyResponse.referenceId);

		// Ensure we are always working with an array. Single files would otherwise be an object.
		if (!req.files) {
			req.files = {
				[this.fieldName]: []
			};
		}

		if (!Array.isArray(req.files[this.fieldName])) {
			req.files[this.fieldName] = [req.files[this.fieldName]];
		}

		// remove files from response
		let failedRemovedFiles = [];
		if ('removedFiles' in body) {
			const removedFiles = JSON.parse(body.removedFiles);

			journeyResponse.answers[this.fieldName].uploadedFiles = await removeFiles(
				journeyResponse.answers[this.fieldName].uploadedFiles,
				removedFiles,
				`${journeyResponse.journeyId}:${encodedReferenceId}`
			);

			// get a list of files that failed to be removed
			// and ensure the failedToRemove property is not stored to the database
			for (const remainingFile of journeyResponse.answers[this.fieldName].uploadedFiles) {
				if (remainingFile.failedToRemove) {
					failedRemovedFiles.push(remainingFile);
					delete remainingFile.failedToRemove;
				}
			}
		}

		// adds validation errors to be checked after
		for (const failedFile of failedRemovedFiles) {
			const errorMsg = `Failed to remove file: ${failedFile.originalFileName}`;
			errors[failedFile.id] = {
				value: { name: failedFile.originalFileName },
				msg: errorMsg
			};
			errorSummary.push({
				text: errorMsg
			});
		}

		// save valid files to blob storage
		let validFiles = [];
		if (this.fieldName in req.files) {
			validFiles = getValidFiles(errors, req.files[this.fieldName]);
		}
		const uploadedFiles = await this.#saveFilesToBlobStorage(validFiles, journeyResponse);

		// add saved docs to response
		const responseToSave = {
			answers: {
				[this.fieldName]: {
					uploadedFiles: []
				}
			}
		};

		responseToSave.answers[this.fieldName].uploadedFiles = [];

		if (journeyResponse?.answers[this.fieldName]?.uploadedFiles) {
			responseToSave.answers[this.fieldName].uploadedFiles.push(
				...journeyResponse.answers[this.fieldName].uploadedFiles
			);
		}

		if (uploadedFiles) {
			responseToSave.answers[this.fieldName].uploadedFiles.push(...uploadedFiles);
		}

		journeyResponse.answers[this.fieldName] = responseToSave.answers[this.fieldName];

		if (Object.keys(errors).length > 0) {
			req.body.errors = errors;
			req.body.errorSummary = errorSummary.map((error) => ({
				...error,
				href: `#${this.fieldName}`
			}));
		}

		return responseToSave;
	}

	async #saveFilesToBlobStorage(files, journeyResponse) {
		let result = [];

		// eslint-disable-next-line no-restricted-syntax
		for (const file of files) {
			const document = await createDocument(
				{
					id: `${journeyResponse.journeyId}:${encodeURIComponent(journeyResponse.referenceId)}`,
					referenceNumber: journeyResponse.referenceId
				},
				file,
				file.name,
				this.documentType.name
			);

			const mappedDoc = mapMultiFileDocumentToSavedDocument(document, document?.name, file.name);

			result.push(mappedDoc);
		}

		return result;
	}

	checkForSavingErrors(req, section, journey) {
		return super.checkForValidationErrors(req, section, journey);
	}
}

module.exports = MultiFileUploadQuestion;
