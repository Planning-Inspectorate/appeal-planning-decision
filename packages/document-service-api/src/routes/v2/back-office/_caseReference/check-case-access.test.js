const { DocumentsRepository } = require('../../../../db/repos/repository');
const caseAccess = require('./check-case-access');

jest.mock('../../../../db/repos/repository');

describe('caseAccess Middleware', () => {
	let req, res, next;

	beforeEach(() => {
		req = {
			params: {},
			id_token: {},
			auth: { payload: {} }
		};
		res = {
			sendStatus: jest.fn()
		};
		next = jest.fn();
	});

	it('should return 400 if caseReference is missing', async () => {
		await caseAccess(req, res, next);
		expect(res.sendStatus).toHaveBeenCalledWith(400);
	});

	it('should return 404 if appealCase is not found', async () => {
		req.params.caseReference = '123';
		DocumentsRepository.prototype.getAppealCase.mockResolvedValue(null);
		await caseAccess(req, res, next);
		expect(res.sendStatus).toHaveBeenCalledWith(404);
	});

	it('should call next if id_token.lpaCode matches appealCase.LPACode', async () => {
		req.params.caseReference = '123';
		req.id_token.lpaCode = 'LPA123';
		DocumentsRepository.prototype.getAppealCase.mockResolvedValue({ LPACode: 'LPA123' });
		await caseAccess(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	it('should return 401 if id_token.lpaCode does not match appealCase.LPACode', async () => {
		req.params.caseReference = '123';
		req.id_token.lpaCode = 'LPA123';
		DocumentsRepository.prototype.getAppealCase.mockResolvedValue({ LPACode: 'LPA456' });
		await caseAccess(req, res, next);
		expect(res.sendStatus).toHaveBeenCalledWith(401);
	});

	it('should return 401 if no appealUserRoles are found', async () => {
		req.params.caseReference = '123';
		req.auth.payload.sub = 'user123';
		DocumentsRepository.prototype.getAppealCase.mockResolvedValue({
			appealId: 'appeal123',
			LPACode: 'LPA456'
		});
		DocumentsRepository.prototype.getAppealUserRoles.mockResolvedValue([]);
		await caseAccess(req, res, next);
		expect(res.sendStatus).toHaveBeenCalledWith(401);
	});

	it('should call next if appealUserRoles are found', async () => {
		req.params.caseReference = '123';
		req.auth.payload.sub = 'user123';
		DocumentsRepository.prototype.getAppealCase.mockResolvedValue({
			appealId: 'appeal123',
			LPACode: 'LPA456'
		});
		DocumentsRepository.prototype.getAppealUserRoles.mockResolvedValue([{ role: 'user' }]);
		await caseAccess(req, res, next);
		expect(next).toHaveBeenCalled();
	});
});
