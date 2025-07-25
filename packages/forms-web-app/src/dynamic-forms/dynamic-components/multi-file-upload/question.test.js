const MultiFileUploadQuestion = require('./question');

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

const mockUploadedFile = (
	{
		id = 'id-1',
		name = 'test.png',
		fileName = 'test.png',
		originalFileName = 'test.png',
		message = {
			text: 'test.png'
		},
		location = 'a/b',
		size = 200,
		type = DOCUMENT_TYPE.name,
		storageId = 'id-1'
	} = {
		id: 'id-1',
		name: 'test.png',
		fileName: 'test.png',
		originalFileName: 'test.png',
		message: {
			text: 'test.png'
		},
		location: 'a/b',
		size: 200,
		type: DOCUMENT_TYPE.name,
		storageId: 'id-1'
	}
) => ({
	id,
	name,
	fileName,
	originalFileName,
	message,
	location,
	size,
	type,
	storageId
});

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
	beforeEach(() => {
		jest.clearAllMocks();
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

			const uploadedDocument = {
				name: 'test',
				type: DOCUMENT_TYPE.name
			};

			const journey = {
				journeyId: 'appeal',
				response: {
					answers: {
						SubmissionDocumentUpload: [uploadedDocument]
					}
				},
				getBackLink: () => {
					return 'back';
				}
			};

			const customViewData = { hello: 'hi' };
			const result = question.prepQuestionForRendering({ section: {}, journey, customViewData });

			expect(result).toEqual(
				expect.objectContaining({
					question: expect.objectContaining({
						fieldName: FIELDNAME
					}),
					uploadedFiles: [uploadedDocument],
					hello: 'hi'
				})
			);
		});
	});

	describe('formatAnswerForSummary', () => {
		it('should return a single file name and download link if one file uploaded', async () => {
			const question = getMultiFileUpload();
			const upload = mockUploadedFile();
			const answer = {
				uploadedFiles: [upload]
			};
			const href = 'http://example.com';
			const journey = {
				response: {
					journeyId: '654321',
					referenceId: '3221288',
					answers: {
						[question.fieldName]: answer.uploadedFiles,
						SubmissionDocumentUpload: [upload]
					}
				},
				getNextQuestionUrl: () => {
					return 'back';
				},
				getCurrentQuestionUrl: () => {
					return href;
				}
			};

			const expectedResult = `<a href="/document/${upload.storageId}" class="govuk-link">${upload.originalFileName}</a> </br>`;

			const result = question.formatAnswerForSummary('segment', journey, answer);
			expect(result[0].value).toEqual(expectedResult);
			expect(result[0].key).toEqual(TITLE);
			expect(result[0].action.href).toEqual(href);
		});

		it('should return a list of file names and download links if multiple files are uploaded', async () => {
			const question = getMultiFileUpload();
			const upload = mockUploadedFile();
			const answer = {
				uploadedFiles: [upload, upload]
			};
			const journey = {
				response: {
					journeyId: '123456',
					referenceId: '789-123',
					answers: {
						[question.fieldName]: { uploadedFiles: [1, 2] },
						SubmissionDocumentUpload: [upload, upload]
					}
				},
				getNextQuestionUrl: () => {
					return 'back';
				},
				getCurrentQuestionUrl: () => {
					return href;
				}
			};

			const url = `<a href="/document/${upload.id}" class="govuk-link">${upload.originalFileName}</a> </br>`;
			const expectedResult = url + url;

			const href = 'http://example.com';

			const result = question.formatAnswerForSummary('segment', journey, answer);
			expect(result[0].value).toEqual(expectedResult);
			expect(result[0].key).toEqual(TITLE);
			expect(result[0].action.href).toEqual(href);
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

	describe('getRelevantUploadedFiles', () => {
		const baseJourneyResponse = {
			referenceId: 'ref-1',
			journeyId: 'journey-1',
			LPACode: 'lpa-1'
		};

		it('returns an empty array when SubmissionDocumentUpload is an empty array', () => {
			const question = getMultiFileUpload();
			const journeyResponse = {
				...baseJourneyResponse,
				answers: {
					SubmissionDocumentUpload: []
				}
			};
			const result = question.getRelevantUploadedFiles(journeyResponse);
			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(0);
		});

		it('returns an empty array when SubmissionDocumentUpload is undefined', () => {
			const question = getMultiFileUpload();
			const journeyResponse = {
				...baseJourneyResponse,
				answers: {}
			};
			const result = question.getRelevantUploadedFiles(journeyResponse);
			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(0);
		});

		it('returns only files with the correct type', () => {
			const question = getMultiFileUpload();
			const validFile = mockUploadedFile({ type: DOCUMENT_TYPE.name });
			const otherFile = mockUploadedFile({ type: 'other-type', id: 'id-2' });
			const journeyResponse = {
				...baseJourneyResponse,
				answers: {
					SubmissionDocumentUpload: [validFile, otherFile]
				}
			};
			const result = question.getRelevantUploadedFiles(journeyResponse);
			expect(result).toEqual([validFile]);
		});
	});
});
