const { mockReq, mockRes } = require('../mocks');
const { confirmEmailCreate, confirmEmailGet } = require('../../../src/controllers/confirm-email');
const { replaceAppeal } = require('../../../src/services/appeal.service');
const {
	confirmEmailCreateService,
	confirmEmailNotifyContinue,
	confirmEmailGetService
} = require('../../../src/services/confirm-email.service');

jest.mock('../../../src/services/confirm-email.service');
jest.mock('../../../src/services/appeal.service');
jest.mock('../../../../common/src/lib/notify/notify-builder', () => ({}));

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

			replaceAppeal.mockReturnValue(appealStub);
			confirmEmailNotifyContinue.mockReturnValue('');
			confirmEmailCreateService.mockReturnValue('12345');

			await confirmEmailCreate(req, res);
			expect(confirmEmailCreateService).toHaveBeenCalledWith(appealStub);
			expect(confirmEmailNotifyContinue).toHaveBeenCalledWith(appealStub, '12345');
			expect(res.status).toHaveBeenCalledWith(201);
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
			req.params = { token: '54321' };
			confirmEmailGetService.mockReturnValue({ token: '54321' });
			await confirmEmailGet(req, res);
			expect(confirmEmailGetService).toHaveBeenCalledWith('54321');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith({ token: '54321' });
		});
	});
});
