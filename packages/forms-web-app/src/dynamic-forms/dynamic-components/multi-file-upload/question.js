const { removeFiles, getValidFiles } = require('../../../lib/multi-file-upload-helpers');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { mapMultiFileDocumentToSavedDocument } = require('../../../mappers/document-mapper');
const {
	utils: { conjoinedPromises }
} = require('@pins/common');
const { apiClient } = require('../../../lib/appeals-api-client');

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
			throw new Error('documentType is mandatory');
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

		const uploadedFiles = journey.response.answers.SubmissionDocumentUpload || [];

		const relevantUploadedFiles = uploadedFiles.filter(
			(upload) => upload.type === this.documentType.name
		);

		if (relevantUploadedFiles.length > 0) {
			viewModel.uploadedFiles = relevantUploadedFiles;
		}

		return viewModel;
	}

	/**
	 * Save the answer to the question
	 * @param {ExpressRequest} req
	 * @param {ExpressResponse} res
	 * @param {Journey} journey
	 * @param {Section} section
	 * @param {JourneyResponse} journeyResponse
	 * @returns {Promise<void>}
	 */
	async saveAction(req, res, journey, section, journeyResponse) {
		// check for validation errors
		const errorViewModel = this.checkForValidationErrors(req, section, journey);
		if (errorViewModel) {
			return this.renderAction(res, errorViewModel);
		}

		// save
		const { uploadedFiles } = await this.getDataToSave(req, journeyResponse);
		await Promise.all(
			uploadedFiles.map((file) => {
				const data = {
					...file,
					type: this.documentType.name
				};
				return apiClient.postSubmissionDocumentUpload(journeyResponse.referenceId, data);
			})
		);
		const responseToSave = {
			answers: {
				[this.fieldName]: true
			}
		};
		await this.saveResponseToDB(journey.response, responseToSave);

		// check for saving errors
		const saveViewModel = this.checkForSavingErrors(req, section, journey);
		if (saveViewModel) {
			return this.renderAction(res, saveViewModel);
		}

		// move to the next question
		const updatedJourney = new journey.constructor(journeyResponse);
		return this.handleNextQuestion(res, updatedJourney, section.segment, this.fieldName);
	}

	checkForValidationErrors() {
		// handled after saving any valid files
		return;
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {Object} answer
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {Array.<Object>}
	 */
	formatAnswerForSummary(sectionSegment, journey, answer) {
		const uploadedFiles = journey.response.answers.SubmissionDocumentUpload || [];

		const relevantUploadedFiles = uploadedFiles.filter(
			(upload) => upload.type === this.documentType.name
		);

		let formattedAnswer;
		if (relevantUploadedFiles.length > 0 && answer) {
			formattedAnswer = '';
			for (const item in relevantUploadedFiles) {
				const documentSubmissionId = this.#generateDocumentSubmissionId(journey.response);
				const documentId = relevantUploadedFiles[item].storageId;
				const documentLinkText = relevantUploadedFiles[item].originalFileName;
				const documentUrl = `/manage-appeals/document/${documentSubmissionId}/${documentId}`;

				formattedAnswer += `<a href="${documentUrl}" class="govuk-link">${documentLinkText}</a> </br>`;
			}
		}

		formattedAnswer = formattedAnswer ?? 'Not started';

		return super.formatAnswerForSummary(sectionSegment, journey, formattedAnswer, false);
	}

	/**
	 * Returns the action link for the question
	 * @param {Object} answer
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {String}
	 */
	getAction(sectionSegment, journey, answer) {
		const action = {
			href: journey.getCurrentQuestionUrl(sectionSegment, this.fieldName),
			text: answer ? 'Upload' : 'Remove',
			visuallyHiddenText: this.question
		};
		return action;
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

		const journeyFiles = {
			answers: {
				[this.fieldName]: {
					uploadedFiles: []
				}
			}
		};

		journeyFiles.answers[this.fieldName].uploadedFiles = [];

		if (journeyResponse?.answers[this.fieldName]?.uploadedFiles) {
			journeyFiles.answers[this.fieldName].uploadedFiles.push(
				...journeyResponse.answers[this.fieldName].uploadedFiles
			);
		}

		if (uploadedFiles) {
			journeyFiles.answers[this.fieldName].uploadedFiles.push(...uploadedFiles);
		}

		journeyResponse.answers[this.fieldName] = journeyFiles.answers[this.fieldName];

		if (Object.keys(errors).length > 0) {
			req.body.errors = errors;
			req.body.errorSummary = errorSummary.map((error) => ({
				...error,
				href: `#${this.fieldName}`
			}));
		}

		return {
			uploadedFiles: journeyFiles.answers[this.fieldName].uploadedFiles
		};
	}

	async #saveFilesToBlobStorage(files, journeyResponse) {
		const resolutions = await conjoinedPromises(files, (file) =>
			createDocument(
				{
					id: this.#generateDocumentSubmissionId(journeyResponse),
					referenceNumber: journeyResponse.referenceId
				},
				file,
				file.name,
				this.documentType.name
			)
		);

		const result = Array.from(resolutions).map(([file, document]) =>
			mapMultiFileDocumentToSavedDocument(document, document?.name, file.name)
		);

		return result;
	}

	#generateDocumentSubmissionId(journeyResponse) {
		return `${journeyResponse.journeyId}:${encodeURIComponent(
			this.#sanitiseReferenceId(journeyResponse.referenceId)
		)}`;
	}

	#sanitiseReferenceId(referenceId) {
		return referenceId.replaceAll('/', '_');
	}

	checkForSavingErrors(req, section, journey) {
		return super.checkForValidationErrors(req, section, journey);
	}
}

module.exports = MultiFileUploadQuestion;
