const logger = require('../../../lib/logger');
const { patchQuestionResponse } = require('../../../lib/appeals-api-wrapper');
const { removeFiles, getValidFiles } = require('../../../lib/multi-file-upload-helpers');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { mapMultiFileDocumentToSavedDocument } = require('../../../mappers/document-mapper');
const { documentTypes } = require('@pins/common');

const Question = require('../../question');

/**
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
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

	constructor({ title, question, description, fieldName, url, documentType, validators }) {
		super({
			title,
			question,
			description,
			viewFolder: 'multi-file-upload',
			fieldName,
			url,
			validators
		});

		if (documentType) {
			this.documentType = documentType;
		} else {
			// default doc type
			this.documentType = documentTypes.dynamic;
		}
	}

	/**
	 * Save an uploaded file
	 * @param {ExpressRequest} req
	 * @param {ExpressResponse} res
	 * @param {Journey} journey
	 * @param {Section} sectionObj
	 * @param {JourneyResponse} journeyResponse
	 * @returns
	 */
	saveAction = async (req, res, journey, sectionObj, journeyResponse) => {
		try {
			const { body } = req;
			const { errors = {}, errorSummary = [] } = body;
			// const { errors = {}, errorSummary = [] } = body;
			const encodedReferenceId = encodeURIComponent(journeyResponse.referenceId);

			// set answer on response
			let responseToSave = {
				answers: {
					[this.fieldName]: {
						uploadedFiles: []
					}
				}
			};

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
			if ('removedFiles' in body) {
				const removedFiles = JSON.parse(body.removedFiles);

				journeyResponse.answers[this.fieldName].uploadedFiles = removeFiles(
					journeyResponse.answers[this.fieldName].uploadedFiles,
					removedFiles
				);
			}

			// save files to blob storage
			const uploadedFiles = await this.#saveFilesToBlobStorage(req, journeyResponse, errors);

			// add saved docs to response
			responseToSave.answers[this.fieldName].uploadedFiles = [];

			if (journeyResponse?.answers[this.fieldName]?.uploadedFiles) {
				responseToSave.answers[this.fieldName].uploadedFiles.push(
					...journeyResponse.answers[this.fieldName].uploadedFiles
				);
			}

			if (uploadedFiles) {
				responseToSave.answers[this.fieldName].uploadedFiles.push(...uploadedFiles);
			}

			// save answer to database
			await patchQuestionResponse(journeyResponse.journeyId, encodedReferenceId, responseToSave);

			// map the response back to journeyResponse
			journeyResponse.answers[this.fieldName] = responseToSave.answers[this.fieldName];

			// update journey based on response
			const updatedJourney = new journey.constructor(journeyResponse);

			// todo: validation after saving required?
			if (Object.keys(errors).length > 0) {
				const answer = journeyResponse.answers[this.fieldName];

				return this.renderPage(
					res,
					{
						layoutTemplate: journey.journeyTemplate,
						pageCaption: sectionObj?.name,
						backLink: journey.getNextQuestionUrl(sectionObj.segment, this.fieldName, true),
						listLink: journey.baseUrl,
						answers: journey.response.answers,
						answer
					},
					{
						errors,
						errorSummary: errorSummary.map((error) => ({
							...error,
							href: '#'
						}))
					}
				);
			}

			// this is the `name` of the 'upload' button in the template.
			if (body['upload-and-remain-on-page']) {
				return res.redirect(
					updatedJourney.getCurrentQuestionUrl(sectionObj.segment, this.fieldName)
				);
			}

			return res.redirect(
				updatedJourney.getNextQuestionUrl(sectionObj.segment, this.fieldName, false)
			);
		} catch (err) {
			logger.error(err);

			const answer = journeyResponse.answers[this.fieldName]?.uploadedFiles || '';
			return this.renderPage(
				res,
				{
					layoutTemplate: journey.journeyTemplate,
					pageCaption: sectionObj?.name,
					backLink: journey.getNextQuestionUrl(sectionObj.segment, this.fieldName, true),
					listLink: journey.baseUrl,
					answers: journey.response.answers,
					answer
				},
				{
					errorSummary: [{ text: 'Failed to upload files', href: '#' }]
				}
			);
		}
	};

	async #saveFilesToBlobStorage(req, journeyResponse, errors) {
		let result = [];

		if (this.fieldName in req.files) {
			const validFiles = getValidFiles(errors, req.files[this.fieldName]);

			// eslint-disable-next-line no-restricted-syntax
			for await (const file of validFiles) {
				const document = await createDocument(
					{
						id: journeyResponse.journeyId,
						referenceNumber: journeyResponse.referenceId
					},
					file,
					file.name,
					this.documentType.name
				);

				const mappedDoc = mapMultiFileDocumentToSavedDocument(document, document?.name, file.name);

				result.push(mappedDoc);
			}
		}

		return result;
	}
}

module.exports = MultiFileUploadQuestion;
