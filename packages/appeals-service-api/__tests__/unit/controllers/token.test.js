const { tokenPut, tokenPost } = require('../../../src/controllers/token');
const {
	createOrUpdateTokenDocument,
	getTokenDocumentIfExists
} = require('../../../src/services/token.service');
const { mockReq, mockRes } = require('../mocks');
const { getAppeal } = require('../../../src/services/appeal.service');
const { sendSecurityCodeEmail } = require('../../../src/lib/notify');

jest.mock('../../../src/services/token.service');
jest.mock('../../../src/services/appeal.service');
jest.mock('../../../src/lib/notify');

describe('controllers/token', () => {
	let req;
	let res;
	beforeEach(() => {
		jest.resetAllMocks();
		req = mockReq();
		res = mockRes();
	});
	describe('tokenPut', () => {
		it('should call createOrUpdateTokenDocument with req.body.id', async () => {
			req.body = { id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea' };
			createOrUpdateTokenDocument.mockReturnValue('68736');
			getAppeal.mockReturnValue({
				email: 'expected@email.com'
			});

			await tokenPut(req, res);

			expect(createOrUpdateTokenDocument).toBeCalledWith('e2813fb0-e269-4fe2-890e-6405dbd4a5ea');
		});
		it('should call getAppeal with req.body.id and set emailAddress to email prop of returned appeal if emailAddress is missing from req.body', async () => {
			req.body = { id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea' };
			createOrUpdateTokenDocument.mockReturnValue('68736');
			getAppeal.mockReturnValue({
				email: 'expected@email.com'
			});

			await tokenPut(req, res);

			expect(sendSecurityCodeEmail).toBeCalledWith(
				'expected@email.com',
				'68736',
				'e2813fb0-e269-4fe2-890e-6405dbd4a5ea'
			);
		});
		it('should not call getAppeal if emailAddress is present in req.body', async () => {
			req.body = {
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				emailAddress: 'expected@email.com'
			};
			createOrUpdateTokenDocument.mockReturnValue('68736');

			await tokenPut(req, res);

			expect(getAppeal).not.toBeCalled();
		});
		it('should call sendSecurityCodeEmail with emailAddress and id from req.body, and token returned by createOrUpdateTokenDocument, and should send a response with a status code of 200', async () => {
			req.body = {
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				emailAddress: 'expected@email.com'
			};
			createOrUpdateTokenDocument.mockReturnValue('68736');

			await tokenPut(req, res);

			expect(sendSecurityCodeEmail).toBeCalledWith(
				'expected@email.com',
				'68736',
				'e2813fb0-e269-4fe2-890e-6405dbd4a5ea'
			);
			expect(res.status).toBeCalledWith(200);
			expect(res.status(200).send).toBeCalledWith({});
		});

		it('should not call createOrUpdateTokenDocument if call to getAppeal is unsuccessful', async () => {
			req.body = {
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea'
			};
			getAppeal.mockRejectedValue(() => {
				new Error('error');
			});

			try {
				await tokenPut(req, res);
			} catch (e) {
				expect(createOrUpdateTokenDocument).not.toBeCalled();
			}
		});
	});
	describe('tokenPost', () => {
		it('should call getTokenDocumentIfExists with id and token from req.body', async () => {
			req.body = {
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				token: '68736'
			};

			await tokenPost(req, res);

			expect(getTokenDocumentIfExists).toBeCalledWith(
				'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				'68736'
			);
		});
		it('should send a response with a 200 status code, containing an empty object, if document is not returned by getTokenDocumentIfExists', async () => {
			req.body = {
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				token: '68736'
			};

			getTokenDocumentIfExists.mockReturnValue(undefined);

			await tokenPost(req, res);

			expect(res.status).toBeCalledWith(200);
			expect(res.status(200).send).toBeCalledWith({});
		});
		it('should send a response with a 200 status code, containing an object with id and createdAt props from the returned document, if document is returned by getTokenDocumentIfExists', async () => {
			req.body = {
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				token: '68736'
			};

			getTokenDocumentIfExists.mockReturnValue({
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				createdAt: '2023-03-20T11:50:09.685Z'
			});

			await tokenPost(req, res);

			expect(res.status).toBeCalledWith(200);
			expect(res.status(200).send).toBeCalledWith({
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				createdAt: '2023-03-20T11:50:09.685Z'
			});
		});
	});
});
