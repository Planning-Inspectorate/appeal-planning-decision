const MultiFileUploadQuestion = require('./question');
const { documentTypes } = require('@pins/common');

const { patchQuestionResponse } = require('../../../lib/appeals-api-wrapper');
// const { removeFiles } = require('../../../lib/multi-file-upload-helpers');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { mapMultiFileDocumentToSavedDocument } = require('../../../mappers/document-mapper');
const { SECTION_STATUS } = require('../../section');
const { Journey } = require('../../journey');

jest.mock('../../../lib/appeals-api-wrapper');
// jest.mock('../../../lib/multi-file-upload-helpers');
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
		super(`${mockBaseUrl}/${mockRef}`, response, mockTemplateUrl, '');

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
const mockRef = '123456';
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
	html= HTML
) {
	return new MultiFileUploadQuestion({
		title: title,
		question: question,
		description: description,
		fieldName: fieldName,
		url: url,
		validators: validators,
		html: html,
		documentType: documentType
	});
}

describe('MultiFileUploadQuestion', () => {
	let req;
	let mockJourney;
	let mockResponse;

	beforeEach(() => {
		jest.resetAllMocks();
		mockResponse = {
			referenceId: mockRef,
			journeyId: mockJourneyId,
			answers: {}
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

	it('should create a MultiFileUploadQuestion with default documentType', () => {
		const multiFileQuestion = getMultiFileUpload(null);
		expect(multiFileQuestion.documentType).toBe(documentTypes.dynamic);
	});

	describe('saveAction', () => {
		it('works with no files', async () => {
			req.body = {};

			const multiFileQuestion = getMultiFileUpload();

			await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, mockResponse);

			expect(createDocument).not.toHaveBeenCalled();

			expect(patchQuestionResponse).toHaveBeenCalledWith(mockJourneyId, mockRef, {
				answers: {
					files: {
						uploadedFiles: []
					}
				}
			});
			expect(res.redirect).toHaveBeenCalledWith(
				`/manage-appeals/questionnaire/123456/segment-1/title-1b`
			);
		});

		it('works with a singular file', async () => {
			const fileUploaded = {
				name: 'data'
			};
			req.files = {
				[FIELDNAME]: fileUploaded
			};
			req.body = {};

			mapMultiFileDocumentToSavedDocument.mockReturnValue(mockUploadedFile);

			const multiFileQuestion = getMultiFileUpload();

			await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, mockResponse);

			expect(createDocument).toHaveBeenCalledWith(
				{
					id: mockJourneyId,
					referenceNumber: mockRef
				},
				fileUploaded,
				fileUploaded.name,
				DOCUMENT_TYPE.name
			);

			expect(patchQuestionResponse).toHaveBeenCalledWith(mockJourneyId, mockRef, {
				answers: {
					files: {
						uploadedFiles: [mockUploadedFile]
					}
				}
			});
			expect(res.redirect).toHaveBeenCalledWith(
				`/manage-appeals/questionnaire/123456/segment-1/title-1b`
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
					id: mockJourneyId,
					referenceNumber: mockRef
				},
				fileUploaded,
				fileUploaded.name,
				DOCUMENT_TYPE.name
			);

			expect(patchQuestionResponse).toHaveBeenCalledWith(mockJourneyId, mockRef, {
				answers: {
					files: {
						uploadedFiles: [mockUploadedFile, mockUploadedFile]
					}
				}
			});
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

			expect(patchQuestionResponse).toHaveBeenCalledWith(mockJourneyId, mockRef, {
				answers: {
					files: {
						uploadedFiles: [mockUploadedFile, mockUploadedFile, mockUploadedFile]
					}
				}
			});
			expect(res.redirect).toHaveBeenCalledWith(
				`/manage-appeals/questionnaire/123456/segment-1/title-1b`
			);
		});

		it('upload-and-remain-on-page redirects', async () => {
			const fileUploaded = {
				name: 'data'
			};
			req.files = {
				[FIELDNAME]: fileUploaded
			};
			req.body = {
				'upload-and-remain-on-page': 1
			};

			mapMultiFileDocumentToSavedDocument.mockReturnValue(mockUploadedFile);

			const multiFileQuestion = getMultiFileUpload();

			await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, mockResponse);

			expect(res.redirect).toHaveBeenCalledWith(
				`/manage-appeals/questionnaire/123456/segment-1/${FIELDNAME}`
			);
		});

		it('removes files', async () => {
			const fileUploaded = {
				name: 'data'
			};
			req.files = {
				[FIELDNAME]: [fileUploaded, fileUploaded]
			};
			req.body = {
				removedFiles: `[{ "name": "${mockUploadedFile.name}" }]`
			};

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

			expect(patchQuestionResponse).toHaveBeenCalledWith(mockJourneyId, mockRef, {
				answers: {
					files: {
						uploadedFiles: [mockUploadedFile, mockUploadedFile]
					}
				}
			});
			expect(res.redirect).toHaveBeenCalledWith(
				`/manage-appeals/questionnaire/123456/segment-1/title-1b`
			);
		});

		it('handles attempts to upload invalid files', async () => {
			const testUrl = `${mockBaseUrl}/${mockRef}`;

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
					href: '#'
				}
			];

			req.body = {
				errors: errors,
				errorSummary: errorSummary
			};

			mapMultiFileDocumentToSavedDocument.mockReturnValue(validFileUploaded);

			const multiFileQuestion = getMultiFileUpload();

			const preppedQuestion = multiFileQuestion.prepQuestionForRendering({
				files: {
					uploadedFiles: [validFileUploaded]
				}
			});

			//when save action is called on multifile question
			await multiFileQuestion.saveAction(req, res, mockJourney, mockSection, mockResponse);

			//then only the valid document will be saved
			expect(createDocument).toHaveBeenCalledTimes(1);
			expect(createDocument).toHaveBeenCalledWith(
				{
					id: mockJourneyId,
					referenceNumber: mockRef
				},
				validFileUploaded,
				validFileUploaded.name,
				DOCUMENT_TYPE.name
			);

			expect(patchQuestionResponse).toHaveBeenCalledWith(mockJourneyId, mockRef, {
				answers: {
					files: {
						uploadedFiles: [validFileUploaded]
					}
				}
			});

			//and the page will re-render with the valid file listed and the relevant error message(s)
			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(
				`dynamic-components/${multiFileQuestion.viewFolder}/index`,
				{
					backLink: testUrl,
					errors: errors,
					errorSummary: errorSummary,
					layoutTemplate: mockTemplateUrl,
					listLink: testUrl,
					navigation: ['', testUrl],
					pageCaption: mockSection.name,
					question: preppedQuestion,
					showBackToListLink: true,
					uploadedFiles: [validFileUploaded]
				}
			);
		});
	});
});
