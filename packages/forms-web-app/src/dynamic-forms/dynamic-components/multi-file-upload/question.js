const {
	isObjectWithUploadedFiles,
	getValidFiles,
	removeFilesV2
} = require('../../../lib/multi-file-upload-helpers');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { mapMultiFileDocumentToSavedDocument } = require('../../../mappers/document-mapper');
const {
	utils: { conjoinedPromises }
} = require('@pins/common');
const Question = require('../../question');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');

/**
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 */

/**
 * @typedef {Array<{ id: string; type: string; originalFileName: string; storageId: string }>} UploadedFiles
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
	 * @type {import('@pins/common/src/document-types').DocType} document type
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
	 * @param {import('@pins/common/src/document-types').DocType} [params.documentType]
	 * @param {string} [params.html]
	 * @param {Array<import('../../question').BaseValidator>} [params.validators]
	 *
	 * @param {Array<Function>} [methodOverrides]
	 */
	constructor(
		{ title, question, fieldName, url, pageTitle, description, documentType, validators, html },
		methodOverrides
	) {
		super(
			{
				title,
				question,
				viewFolder: 'multi-file-upload',
				fieldName,
				url,
				pageTitle,
				description,
				validators,
				html
			},
			methodOverrides
		);

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
	 * @param {Record<string, unknown>} [customViewData] additional data to send to view
	 * @returns {QuestionViewModel & { uploadedFiles?: unknown }}
	 */
	prepQuestionForRendering(section, journey, customViewData) {
		/** @type {QuestionViewModel & { uploadedFiles?: unknown }} */
		const viewModel = super.prepQuestionForRendering(section, journey, customViewData);

		const relevantUploadedFiles = this.getRelevantUploadedFiles(journey.response);

		if (relevantUploadedFiles.length > 0) {
			viewModel.uploadedFiles = relevantUploadedFiles;
		}

		return viewModel;
	}

	/**
	 * Save the answer to the question
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Journey} journey
	 * @param {Section} section
	 * @param {JourneyResponse} journeyResponse
	 * @returns {Promise<void>}
	 */
	async saveAction(req, res, journey, section, journeyResponse) {
		// save
		const { uploadedFiles } = await this.getDataToSave(req, journeyResponse);
		await Promise.all(
			uploadedFiles.map((file) => {
				if (!file) return;

				const data = {
					...file,
					type: this.documentType.name
				};

				return this.uploadDocuments(
					req.appealsApiClient,
					journeyResponse.referenceId,
					journeyResponse.journeyId,
					data
				);
			})
		);
		const responseToSave = {
			answers: {
				[this.fieldName]: true
			}
		};
		await this.saveResponseToDB(req.appealsApiClient, journey.response, responseToSave);

		// check for saving errors
		const saveViewModel = this.checkForSavingErrors(req, section, journey);
		if (saveViewModel) {
			return this.renderAction(res, saveViewModel);
		}

		// move to the next question
		return this.handleNextQuestion(res, journey, section.segment, this.fieldName);
	}

	// Belongs to save
	// @ts-ignore
	uploadDocuments(apiClient, referenceId, journeyId, data) {
		if ([JOURNEY_TYPES.HAS_QUESTIONNAIRE, JOURNEY_TYPES.S78_QUESTIONNAIRE].includes(journeyId)) {
			return apiClient.postLPASubmissionDocumentUpload(referenceId, data);
		} else if ([JOURNEY_TYPES.HAS_APPEAL_FORM, JOURNEY_TYPES.S78_APPEAL_FORM].includes(journeyId)) {
			return apiClient.postAppellantSubmissionDocumentUpload(referenceId, data);
		} else if ([JOURNEY_TYPES.S78_LPA_STATEMENT].includes(journeyId)) {
			return apiClient.postLPAStatementDocumentUpload(referenceId, data);
		} else if ([JOURNEY_TYPES.S78_APPELLANT_FINAL_COMMENTS].includes(journeyId)) {
			return apiClient.postAppellantFinalCommentDocumentUpload(referenceId, data);
		} else if ([JOURNEY_TYPES.S78_LPA_FINAL_COMMENTS].includes(journeyId)) {
			return apiClient.postLPAFinalCommentDocumentUpload(referenceId, data);
		}
	}
	// Belongs to save
	// @ts-ignore
	removeDocuments(apiClient, journeyId) {
		// @ts-ignore
		return (submissionId, documentId) => {
			if ([JOURNEY_TYPES.HAS_QUESTIONNAIRE, JOURNEY_TYPES.S78_QUESTIONNAIRE].includes(journeyId)) {
				return apiClient.deleteLPASubmissionDocumentUpload(submissionId, documentId);
			} else if (
				[JOURNEY_TYPES.HAS_APPEAL_FORM, JOURNEY_TYPES.S78_APPEAL_FORM].includes(journeyId)
			) {
				return apiClient.deleteAppellantSubmissionDocumentUpload(submissionId, documentId);
			} else if ([JOURNEY_TYPES.S78_LPA_STATEMENT].includes(journeyId)) {
				return apiClient.deleteLPAStatementDocumentUpload(submissionId, documentId);
			} else if ([JOURNEY_TYPES.S78_APPELLANT_FINAL_COMMENTS].includes(journeyId)) {
				return apiClient.deleteAppellantFinalCommentDocumentUpload(submissionId, documentId);
			} else if ([JOURNEY_TYPES.S78_LPA_FINAL_COMMENTS].includes(journeyId)) {
				return apiClient.deleteLPAFinalCommentDocumentUpload(submissionId, documentId);
			}
		};
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @param {string} answer
	 * @returns {{ key: string; value: string | Object; action: { href: string; text: string; visuallyHiddenText: string; }; }[]}
	 */
	formatAnswerForSummary(sectionSegment, journey, answer) {
		const relevantUploadedFiles = this.getRelevantUploadedFiles(journey.response);

		let formattedAnswer;
		if (relevantUploadedFiles.length > 0 && answer) {
			formattedAnswer = '';
			for (const item of relevantUploadedFiles) {
				const documentId = item.id;
				const documentLinkText = item.originalFileName;
				const documentUrl = `/document/${documentId}`;

				formattedAnswer += `<a href="${documentUrl}" class="govuk-link">${documentLinkText}</a> </br>`;
			}
		}

		formattedAnswer = formattedAnswer ?? 'Not started';

		const action = this.getAction(sectionSegment, journey, answer);
		const key = this.title ?? this.question;

		const rowParams = [];
		rowParams.push({
			key: key,
			value: formattedAnswer,
			action: action
		});
		return rowParams;
	}

	/**
	 * Returns the action link for the question
	 * @param {Journey} journey
	 * @param {string} sectionSegment
	 * @param {string} answer
	 * @returns {{ href: string; text: string; visuallyHiddenText: string; }}
	 */
	getAction(sectionSegment, journey, answer) {
		const action = {
			href: journey.getCurrentQuestionUrl(sectionSegment, this.fieldName),
			text: answer ? 'Change' : 'Upload',
			visuallyHiddenText: this.question
		};
		return action;
	}

	// probably belongs to save, definitely shouldn't live here
	// @ts-ignore
	async saveFilesToBlobStorage(files, journeyResponse) {
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

	/**
	 * @param {JourneyResponse} journeyResponse
	 * @returns {string}
	 */
	#generateDocumentSubmissionId(journeyResponse) {
		return `${journeyResponse.journeyId}:${encodeURIComponent(
			this.#sanitiseReferenceId(journeyResponse.referenceId)
		)}`;
	}

	/**
	 * @param {string} referenceId
	 * @returns {string}
	 */
	#sanitiseReferenceId(referenceId) {
		return referenceId.replaceAll('/', '_');
	}

	/**
	 * Save the answer to the question
	 * @param {import('express').Request} req
	 * @param {Section} section
	 * @param {Journey} journey
	 * @returns {QuestionViewModel | undefined}
	 */
	checkForSavingErrors(req, section, journey) {
		return super.checkForValidationErrors(req, section, journey);
	}

	/**
	 * @param {JourneyResponse} journeyResponse
	 * @returns {boolean}
	 */
	isAnswered(journeyResponse) {
		const answer = journeyResponse.answers[this.fieldName];
		const relevantUploadedFiles = this.getRelevantUploadedFiles(journeyResponse);
		return answer === 'yes' && !!relevantUploadedFiles.length;
	}

	/**
	 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {{ id: string; type: string; originalFileName: string; storageId: string }[]}
	 */
	getRelevantUploadedFiles(journeyResponse) {
		const uploadedFiles = journeyResponse.answers.SubmissionDocumentUpload || [];

		if (
			!Array.isArray(uploadedFiles) ||
			!uploadedFiles.every((upload) => Object.hasOwn(upload, 'type'))
		) {
			throw new Error('Uploaded files on answers array was an unexpected shape');
		}

		return uploadedFiles.filter((upload) => upload.type === this.documentType.name);
	}
}

module.exports = MultiFileUploadQuestion;
