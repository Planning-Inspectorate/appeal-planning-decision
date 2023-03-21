const { mockReq, mockRes } = require('../mocks');
const { confirmEmailCreate, confirmEmailGet } = require('../../../src/controllers/confirm-email');
const {
	confirmEmailCreateService,
	confirmEmailNotifyContinue,
	confirmEmailGetService
} = require('../../../src/services/confirm-email.service');

jest.mock('../../../src/services/confirm-email.service');

describe('Confirm Email API', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('POST - create and send email confirmation', () => {
		it('should respond with - OK 201', async () => {
			const appealStub = {
				id: '1233123123'
			};
			req.body = appealStub;
			confirmEmailCreateService.mockReturnValue('fakeReturnValue');

			await confirmEmailCreate(req, res);
			expect(confirmEmailCreateService).toHaveBeenCalledWith(appealStub);
			expect(confirmEmailNotifyContinue).toHaveBeenCalledWith(appealStub);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.send).toHaveBeenCalledWith({ appealId: 'fakeReturnValue' });
		});
		it('should respond send with - {appealId: savedAppealId}', async () => {
			const appealStub = {
				id: '1233123123'
			};
			req.body = appealStub;
			confirmEmailCreateService.mockReturnValue('fakeReturnValue');

			await confirmEmailCreate(req, res);
			expect(confirmEmailCreateService).toHaveBeenCalledWith(appealStub);
			expect(confirmEmailNotifyContinue).toHaveBeenCalledWith(appealStub);
			expect(res.send).toHaveBeenCalledWith({ appealId: 'fakeReturnValue' });
		});

		it('should respond with - ERROR 400 when appealId is null', async () => {
			req.body = { appealId: null };

			confirmEmailNotifyContinue.mockReturnValue('12345');
			confirmEmailCreateService.mockReturnValue('12345');

			await expect(async () => confirmEmailCreate(req, res)).rejects.toThrowError('');
			expect(res.status).toHaveBeenCalledWith(400);
			expect(confirmEmailNotifyContinue).toBeCalledTimes(0);
			expect(confirmEmailCreateService).toBeCalledTimes(0);
		});
	});

	describe('GET - get token', () => {
		it('should retrieve token', async () => {
			req.params = { id: '54321' };
			confirmEmailGetService.mockReturnValue('fakeReturnValue');
			await confirmEmailGet(req, res);
			expect(confirmEmailGetService).toHaveBeenCalledWith('54321');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith('fakeReturnValue');
		});
	});
});
