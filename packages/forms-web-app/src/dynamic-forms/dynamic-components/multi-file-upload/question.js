const Question = require('../../question');

/**
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
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
	 * @param {string} [params.actionHiddenText]
	 * @param {Array<import('../../question').BaseValidator>} [params.validators]
	 *
	 * @param {Record<string, Function>} [methodOverrides]
	 */
	constructor(
		{
			title,
			question,
			fieldName,
			url,
			pageTitle,
			description,
			documentType,
			validators,
			html,
			actionHiddenText
		},
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

		this.actionHiddenText = actionHiddenText || question;
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
			visuallyHiddenText: this.actionHiddenText
		};
		return action;
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
