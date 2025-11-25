const { documentsUploadGet, documentsUploaddPost } = require('./controller');
const { getInterestedPartyFromSession } = require('../../../../services/interested-party.service');
const { conjoinedPromises } = require('@pins/common/src/utils');

jest.mock('../../../../services/interested-party.service');
jest.mock('@pins/common/src/utils');

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

describe('documentsUpload Controller Tests', () => {
	let req, res;

	beforeEach(() => {
		req = {
			session: {},
			body: {}
		};
		res = {
			render: jest.fn(),
			redirect: jest.fn()
		};
	});

	describe('documentsUploadGet', () => {
		it('should render the documents-upload page with the interested party', () => {
			const interestedParty = {};
			getInterestedPartyFromSession.mockReturnValue(interestedParty);

			documentsUploadGet(req, res);

			expect(getInterestedPartyFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/documents-upload/index', {
				interestedParty
			});
		});
	});

	describe('documentsUploadPost', () => {
		it('should render the documents-upload page with errors if there are validation errors', async () => {
			req.body = {
				errors: {
					'supporting-documents': {
						msg: 'Select a supporting document'
					}
				},
				errorSummary: [{ text: 'Select a supporting document', href: '#supporting-documents' }],
				interestedParty: { hasDocumentsToSupportComment: 'yes' }
			};
			const interestedParty = { hasDocumentsToSupportComment: 'yes' };
			getInterestedPartyFromSession.mockReturnValue(interestedParty);

			await documentsUploaddPost(req, res);

			expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/documents-upload/index', {
				interestedParty,
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
		});

		it('should redirect to check-answers page if there are no validation errors and document has been uploaded', async () => {
			req.body = {
				errors: {},
				errorSummary: [],
				files: {
					'supporting-documents': [{ name: 'test.pdf', size: 1 }]
				}
			};
			const metadataResult = {
				createdOn: '2023-10-16T00:00:00.000Z',
				metadata: {
					document_type: 'uploadApplicationDecisionLetter',
					size: '123',
					mime_type: 'application/pdf'
				},
				_response: { request: { url: 'http://example.com' } }
			};
			const interestedParty = { uploadedFiles: [], caseReference: 'CASE123' };
			getInterestedPartyFromSession.mockReturnValue(interestedParty);
			conjoinedPromises.mockResolvedValue(new Map([[mockUploadedFile, metadataResult]]));

			await documentsUploaddPost(req, res);

			expect(res.redirect).toHaveBeenCalledWith('check-answers');
		});

		it('should redirect to check-answers page if there are no validation errors and existing document already added', async () => {
			req.body = {};

			const interestedParty = {
				uploadedFiles: [{ name: 'test.pdf', originalFileName: 'test.pdf', size: 1 }]
			};
			getInterestedPartyFromSession.mockReturnValue(interestedParty);

			await documentsUploaddPost(req, res);

			expect(res.redirect).toHaveBeenCalledWith('check-answers');
		});
	});
});
