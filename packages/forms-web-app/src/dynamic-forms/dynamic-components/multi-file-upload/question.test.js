const MultiFileUploadQuestion = require('./question');

const { patchQuestionResponse } = require('../../../lib/appeals-api-wrapper');
const { createDocument, removeDocument } = require('../../../lib/documents-api-wrapper');
const { mapMultiFileDocumentToSavedDocument } = require('../../../mappers/document-mapper');
const { SECTION_STATUS } = require('../../section');
const { Journey } = require('../../journey');

jest.mock('../../../lib/appeals-api-wrapper');
jest.mock('../../../lib/documents-api-wrapper');
jest.mock('../../../mappers/document-mapper');

const { mockReq, mockRes } = require('../../../../__tests__/unit/mocks');

const TITLE = 'A multifile question';
const QUESTION = 'Do you like files?';
const DESCRIPTION = 'File question';
const FIELDNAME = 'files';
const URL = 'url';
const VALIDATORS = [1, 2];
const HTML = 'resources/question12/content.html';
const DOCUMENT_TYPE = {
	name: '1'
};
class TestJourney extends Journey {
	constructor(response) {
		super(
			`${mockBaseUrl}/${encodeURIComponent(mockRef)}`,
			response,
			mockTemplateUrl,
			'mock path',
			'mock title'
		);

		this.sections = [
			{
				name: mockSection.name,
				segment: mockSection.segment,
				getStatus: () => {
					return SECTION_STATUS.COMPLETE;
				},
				questions: [
					{
						title: FIELDNAME,
						question: QUESTION,
						taskList: true,
						fieldName: FIELDNAME
					},
					{
						title: 'Title 1b',
						question: 'Who?',
						taskList: false,
						fieldName: 'title-1b'
					}
				]
			}
		];
	}
}
const res = mockRes();
const mockBaseUrl = '/manage-appeals/questionnaire';
const mockTemplateUrl = 'template.njk';
let mockRef;
const mockJourneyId = '654321';
const mockSection = {
	name: '123',
	segment: 'segment-1'
};
const mockUploadedFile = {
	id: 'id-1',
	name: 'test.png',
	fileName: 'test.png',
	originalFileName: 'test.png',
	message: {
		text: 'test.png'
	},
	location: 'a/b',
	size: 200
};

function getMultiFileUpload(
	documentType = DOCUMENT_TYPE,
	fieldName = FIELDNAME,
	title = TITLE,
	question = QUESTION,
	description = DESCRIPTION,
	url = URL,
	validators = VALIDATORS,
	html = HTML
) {
	return new MultiFileUploadQuestion({
		title: title,
		question: question,
		description: description,
		fieldName: fieldName,
		url: url,
		validators: validators,
		html: html,
		documentType: documentType,
		getAction: () => {
			return 'http://exmaple.com/action';
		}
	});
}

describe('MultiFileUploadQuestion', () => {
	let req;
	let mockJourney;
	let mockResponse;

	beforeEach(() => {
		jest.resetAllMocks();
		mockRef = '123456';
		mockResponse = {
			referenceId: mockRef,
			journeyId: mockJourneyId,
			answers: {},
			LPACode: 'Q9999'
		};
		mockJourney = new TestJourney(mockResponse);
		req = {
			...mockReq(null)
		};
	});

	it('should create', () => {
		const multiFileQuestion = getMultiFileUpload();
		expect(multiFileQuestion.title).toEqual(TITLE);
		expect(multiFileQuestion.question).toEqual(QUESTION);
		expect(multiFileQuestion.description).toEqual(DESCRIPTION);
		expect(multiFileQuestion.fieldName).toEqual(FIELDNAME);
		expect(multiFileQuestion.url).toEqual(URL);
		expect(multiFileQuestion.validators).toEqual(VALIDATORS);
		expect(multiFileQuestion.viewFolder).toEqual('multi-file-upload');
		expect(multiFileQuestion.documentType).toEqual(DOCUMENT_TYPE);
		expect(multiFileQuestion.html).toEqual(HTML);
	});

	it('should throw error if no documentType parameter passed to constructor', () => {
		expect(() => {
			getMultiFileUpload(null);
		}).toThrow(new Error('documentType is mandatory'));
	});

	describe('prepQuestionForRendering', () => {
		it('should set uploadedFiles and call super', () => {
			const question = getMultiFileUpload();

			const journey = {
				response: {
					answers: {
						[question.fieldName]: { uploadedFiles: [1, 2] }
					}
				},
				getNextQuestionUrl: () => {
					return 'back';
				}
			};

			const customViewData = { hello: 'hi' };
			const result = question.prepQuestionForRendering({}, journey, customViewData);

			expect(result).toEqual(
				expect.objectContaining({
					question: expect.objectContaining({
						value: journey.response.answers[question.fieldName]
					}),
					uploadedFiles: journey.response.answers[question.fieldName].uploadedFiles,
					hello: 'hi'
				})
			);
		});
	});

	describe('formatAnswerForSummary', () => {
		it('should return a single file name and download link if one file uploaded', async () => {
			const question = getMultiFileUpload();
			const answer = {
				uploadedFiles: [mockUploadedFile]
			};
			const href = 'http://example.com';
			const journey = {
				response: {
					journeyId: '654321',
					referenceId: 'APP/Q9999/W/22/3221288',
					answers: {
						[question.fieldName]: answer.uploadedFiles
					}
				},
				getNextQuestionUrl: () => {
					return 'back';
				},
				getCurrentQuestionUrl: () => {
					return href;
				}
			};

			const sanitisedReferenceId = 'APP_Q9999_W_22_3221288';

			const expectedResult = `<a href="/document/${journey.response.journeyId}:${sanitisedReferenceId}/${mockUploadedFile.id}" class="govuk-link">${mockUploadedFile.originalFileName}</a> </br>`;

			const result = question.formatAnswerForSummary('segment', journey, answer);
			expect(result[0].value).toEqual(expectedResult);
			expect(result[0].key).toEqual(TITLE);
			expect(result[0].action.href).toEqual(href);
		});

		it('should return a list of file names and download links if multiple files are uploaded', async () => {
			const question = getMultiFileUpload();
			const answer = {
				uploadedFiles: [mockUploadedFile, mockUploadedFile]
			};
			const journey = {
				response: {
					journeyId: '123456',
					referenceId: '789-123',
					answers: {
						[question.fieldName]: { uploadedFiles: [1, 2] }
					}
				},
				getNextQuestionUrl: () => {
					return 'back';
				},
				getCurrentQuestionUrl: () => {
					return href;
				}
			};

			const url = `<a href="/document/${journey.response.journeyId}:${journey.response.referenceId}/${mockUploadedFile.id}" class="govuk-link">${mockUploadedFile.originalFileName}</a> </br>`;
			const expectedResult = url + url;

			const href = 'http://example.com';

			const result = question.formatAnswerForSummary('segment', journey, answer);
			expect(result[0].value).toEqual(expectedResult);
			expect(result[0].key).toEqual(TITLE);
			expect(result[0].action.href).toEqual(href);
		});
	});

	describe('checkForValidationErrors', () => {
		it('should do nothing', async () => {
			const question = getMultiFileUpload();
			const result = question.checkForValidationErrors();
			expect(result).toEqual(undefined);
		});
	});

	describe('saveAction', () => {
		it('works with no files', async () => {
			req.body = {};

			const multiFileQuestion = getMultiFileUpload();

			await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, mockResponse);

			expect(createDocument).not.toHaveBeenCalled();

			expect(patchQuestionResponse).toHaveBeenCalledWith(
				mockJourneyId,
				mockRef,
				{
					answers: {
						files: {
							uploadedFiles: []
						}
					}
				},
				mockResponse.LPACode
			);
			expect(res.redirect).toHaveBeenCalledWith(
				`/manage-appeals/questionnaire/123456/segment-1/title-1b`
			);
		});

		it('works with a singular file', async () => {
			mockRef = 'APP/Q9999/W/22/3221288';

			mockResponse = {
				referenceId: mockRef,
				journeyId: mockJourneyId,
				answers: {}
			};
			mockJourney = new TestJourney(mockResponse);

			const fileUploaded = {
				name: 'data'
			};
			req.files = {
				[FIELDNAME]: fileUploaded
			};
			req.body = {};

			const encodedReferenceId = encodeURIComponent(mockResponse.referenceId);
			const sanitisedResponse = mockResponse.referenceId.replaceAll('/', '_');

			mapMultiFileDocumentToSavedDocument.mockReturnValue(mockUploadedFile);

			const multiFileQuestion = getMultiFileUpload();

			await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, mockResponse);

			expect(createDocument).toHaveBeenCalledWith(
				{
					id: `${mockJourneyId}:${sanitisedResponse}`,
					referenceNumber: mockRef
				},
				fileUploaded,
				fileUploaded.name,
				DOCUMENT_TYPE.name
			);

			expect(patchQuestionResponse).toHaveBeenCalledWith(
				mockJourneyId,
				encodedReferenceId,
				{
					answers: {
						files: {
							uploadedFiles: [mockUploadedFile]
						}
					}
				},
				mockResponse.LPACode
			);
			expect(res.redirect).toHaveBeenCalledWith(
				`/manage-appeals/questionnaire/${encodedReferenceId}/segment-1/title-1b`
			);
		});

		it('works with multiple files', async () => {
			const fileUploaded = {
				name: 'data'
			};
			req.files = {
				[FIELDNAME]: [fileUploaded, fileUploaded]
			};
			req.body = {};

			mapMultiFileDocumentToSavedDocument.mockReturnValue(mockUploadedFile);

			const multiFileQuestion = getMultiFileUpload();

			await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, mockResponse);

			expect(createDocument).toHaveBeenCalledTimes(2);
			expect(createDocument).toHaveBeenCalledWith(
				{
					id: `${mockJourneyId}:${mockRef}`,
					referenceNumber: mockRef
				},
				fileUploaded,
				fileUploaded.name,
				DOCUMENT_TYPE.name
			);

			expect(patchQuestionResponse).toHaveBeenCalledWith(
				mockJourneyId,
				mockRef,
				{
					answers: {
						files: {
							uploadedFiles: [mockUploadedFile, mockUploadedFile]
						}
					}
				},
				mockResponse.LPACode
			);
			expect(res.redirect).toHaveBeenCalledWith(
				`/manage-appeals/questionnaire/123456/segment-1/title-1b`
			);
		});

		it('works with existing files', async () => {
			const fileUploaded = {
				name: 'data'
			};
			req.files = {
				[FIELDNAME]: [fileUploaded, fileUploaded]
			};
			req.body = {};

			mapMultiFileDocumentToSavedDocument.mockReturnValue(mockUploadedFile);

			const multiFileQuestion = getMultiFileUpload();

			const responseWithFiles = {
				referenceId: mockRef,
				journeyId: mockJourneyId,
				answers: {
					[FIELDNAME]: { uploadedFiles: [mockUploadedFile] }
				}
			};

			await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, responseWithFiles);

			expect(createDocument).toHaveBeenCalledTimes(2);

			expect(patchQuestionResponse).toHaveBeenCalledWith(
				mockJourneyId,
				mockRef,
				{
					answers: {
						files: {
							uploadedFiles: [mockUploadedFile, mockUploadedFile, mockUploadedFile]
						}
					}
				},
				mockResponse.LPACode
			);
			expect(res.redirect).toHaveBeenCalledWith(
				`/manage-appeals/questionnaire/123456/segment-1/title-1b`
			);
		});

		it('will upload files to blob storage but not save to response if one fails', async () => {
			// may wish to change this functionality to handle saving to blob + response file by file to avoid orphaned files
			const fileUploaded = {
				name: 'data'
			};
			req.files = {
				[FIELDNAME]: [fileUploaded, fileUploaded]
			};
			req.body = {};

			mapMultiFileDocumentToSavedDocument.mockReturnValue(mockUploadedFile);

			const expectedError = new Error('test');
			createDocument.mockResolvedValueOnce();
			createDocument.mockRejectedValueOnce(expectedError);

			const multiFileQuestion = getMultiFileUpload();

			try {
				await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, mockResponse);
			} catch (err) {
				expect(err.message).toEqual('test');
			}

			expect(createDocument).toHaveBeenCalledTimes(2);
			expect(patchQuestionResponse).not.toHaveBeenCalled();
		});

		it('can remove files and upload files', async () => {
			const fileUploaded = {
				name: 'data'
			};
			req.files = {
				[FIELDNAME]: [fileUploaded]
			};
			req.body = {
				removedFiles: `[{ "name": "${mockUploadedFile.name}" }]`
			};

			mapMultiFileDocumentToSavedDocument.mockReturnValue(mockUploadedFile);
			removeDocument.mockResolvedValue();

			const multiFileQuestion = getMultiFileUpload();

			const responseWithFiles = {
				referenceId: mockRef,
				journeyId: mockJourneyId,
				answers: {
					[FIELDNAME]: { uploadedFiles: [mockUploadedFile] }
				}
			};

			await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, responseWithFiles);

			expect(createDocument).toHaveBeenCalledTimes(1);
			expect(removeDocument).toHaveBeenCalledTimes(1);

			expect(patchQuestionResponse).toHaveBeenCalledWith(
				mockJourneyId,
				mockRef,
				{
					answers: {
						files: {
							uploadedFiles: [mockUploadedFile]
						}
					}
				},
				mockResponse.LPACode
			);
			expect(res.redirect).toHaveBeenCalledWith(
				`/manage-appeals/questionnaire/123456/segment-1/title-1b`
			);
		});

		it('can remove files', async () => {
			req.body = {
				removedFiles: `[{ "name": "${mockUploadedFile.name}" }]`
			};
			const remainingFile = { ...mockUploadedFile, originalFileName: 'different.png' };

			mapMultiFileDocumentToSavedDocument.mockReturnValue(mockUploadedFile);
			removeDocument.mockResolvedValue();

			const multiFileQuestion = getMultiFileUpload();

			const responseWithFiles = {
				referenceId: mockRef,
				journeyId: mockJourneyId,
				answers: {
					[FIELDNAME]: {
						uploadedFiles: [mockUploadedFile, remainingFile]
					}
				}
			};

			await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, responseWithFiles);

			expect(createDocument).toHaveBeenCalledTimes(0);
			expect(removeDocument).toHaveBeenCalledTimes(1);

			expect(patchQuestionResponse).toHaveBeenCalledWith(
				mockJourneyId,
				mockRef,
				{
					answers: {
						files: {
							uploadedFiles: [remainingFile]
						}
					}
				},
				mockResponse.LPACode
			);
			expect(res.redirect).toHaveBeenCalledWith(
				`/manage-appeals/questionnaire/123456/segment-1/title-1b`
			);
		});

		it('handles failures when removing files', async () => {
			req.body = {
				removedFiles: `[{ "name": "${mockUploadedFile.name}" }]`
			};
			const remainingFile = { ...mockUploadedFile, originalFileName: 'different.png' };

			mapMultiFileDocumentToSavedDocument.mockReturnValue(mockUploadedFile);
			const error = new Error('Some error message');
			removeDocument.mockRejectedValue(error);

			const multiFileQuestion = getMultiFileUpload();

			const responseWithFiles = {
				referenceId: mockRef,
				journeyId: mockJourneyId,
				answers: {
					[FIELDNAME]: {
						uploadedFiles: [mockUploadedFile, remainingFile]
					}
				}
			};

			await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, responseWithFiles);

			expect(createDocument).toHaveBeenCalledTimes(0);
			expect(removeDocument).toHaveBeenCalledTimes(1);

			expect(patchQuestionResponse).toHaveBeenCalledWith(
				mockJourneyId,
				mockRef,
				{
					answers: {
						files: {
							uploadedFiles: [remainingFile, mockUploadedFile]
						}
					}
				},
				mockResponse.LPACode
			);

			const expectedErrorMsg = `Failed to remove file: ${mockUploadedFile.originalFileName}`;
			expect(res.render).toHaveBeenCalledWith(
				expect.any(String),

				expect.objectContaining({
					errors: {
						[mockUploadedFile.id]: {
							value: { name: mockUploadedFile.originalFileName },
							msg: expectedErrorMsg
						}
					},
					errorSummary: [
						{
							href: '#files',
							text: expectedErrorMsg
						}
					]
				})
			);
		});

		it('handles attempts to upload invalid files', async () => {
			//given attempt to upload valid and invalid file
			const validFileUploaded = {
				name: 'data',
				tempFilePath: '/tmp/tmp-4-134416293524'
			};
			const invalidFile = {
				name: 'invalid',
				tempFilePath: '/tmp/tmp-4-1694190443483'
			};

			req.files = {
				[FIELDNAME]: [validFileUploaded, invalidFile]
			};

			//and given validator has returned relevant errors
			const errors = {
				[`files.${FIELDNAME}[1]`]: {
					value: { name: invalidFile.name, tempFilePath: '/tmp/tmp-4-1694190443483' },
					msg: `${invalidFile.name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`,
					param: `files.${FIELDNAME}[1]`,
					location: 'body'
				}
			};

			const errorSummary = [
				{
					text: `${invalidFile.name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`,
					href: '#files'
				}
			];

			req.body = {
				errors: errors,
				errorSummary: errorSummary
			};

			mapMultiFileDocumentToSavedDocument.mockReturnValue(validFileUploaded);
			removeDocument.mockResolvedValue();

			const multiFileQuestion = getMultiFileUpload();

			//when save action is called on multifile question
			await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, mockResponse);

			//then only the valid document will be saved
			expect(createDocument).toHaveBeenCalledTimes(1);
			expect(createDocument).toHaveBeenCalledWith(
				{
					id: `${mockJourneyId}:${mockRef}`,
					referenceNumber: mockRef
				},
				validFileUploaded,
				validFileUploaded.name,
				DOCUMENT_TYPE.name
			);

			expect(patchQuestionResponse).toHaveBeenCalledWith(
				mockJourneyId,
				mockRef,
				{
					answers: {
						files: {
							uploadedFiles: [validFileUploaded]
						}
					}
				},
				mockResponse.LPACode
			);

			//and the page will re-render with the valid file listed and the relevant error message(s)
			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(
				`dynamic-components/${multiFileQuestion.viewFolder}/index`,
				expect.objectContaining({
					errors: errors,
					errorSummary: errorSummary
				})
			);
		});
	});

	describe('checkForSavingErrors', () => {
		it('should return viewmodel if errors present on req', () => {
			const expectedResult = { a: 1 };
			const req = { body: { errors: { error: 'we have an error' } } };
			const question = getMultiFileUpload();
			question.prepQuestionForRendering = jest.fn(() => expectedResult);

			const result = question.checkForSavingErrors(req);

			expect(result).toEqual(expectedResult);
		});

		it('should return undefined if errors not present on req', () => {
			const req = { body: {} };
			const question = getMultiFileUpload();

			const result = question.checkForSavingErrors(req);

			expect(result).toEqual(undefined);
		});
	});
});
