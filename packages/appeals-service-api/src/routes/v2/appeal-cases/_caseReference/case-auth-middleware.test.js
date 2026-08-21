const mockUserCanModifyCase = jest.fn();
jest.mock('../repo', () => ({
	AppealCaseRepository: jest.fn(() => ({
		userCanModifyCase: mockUserCanModifyCase
	}))
}));
const mockLpaCanModifyCase = jest.fn();
jest.mock('./lpa-questionnaire-submission/repo', () => ({
	LPAQuestionnaireSubmissionRepository: jest.fn(() => ({
		lpaCanModifyCase: mockLpaCanModifyCase
	}))
}));
const mockAuth = jest.fn();
jest.mock('express-oauth2-jwt-bearer', () => {
	return { auth: () => mockAuth };
});
const mockToken = jest.fn();
jest.mock('@pins/common/src/middleware/validate-token', () => {
	return { validateToken: () => mockToken };
});

const { checkCaseAccess } = require('./case-auth-middleware');

describe('case-auth-middleware', () => {
	let req, res, next;

	beforeEach(() => {
		jest.resetAllMocks();

		req = {
			params: { caseReference: 'ABC123' },
			auth: {
				payload: {
					sub: 'user-1'
				}
			}
		};
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn()
		};
		next = jest.fn();
	});

	it('should include assertCanAccessCase when enforceUserLoggedIn is true', async () => {
		const result = checkCaseAccess({ enforceUserLoggedIn: true });

		expect(result).toHaveLength(3);

		for (const middleWare of result) {
			await middleWare(req, res, next);
		}

		expect(mockAuth).toHaveBeenCalledTimes(1);
		expect(mockToken).toHaveBeenCalledTimes(1);
		expect(mockUserCanModifyCase).toHaveBeenCalledTimes(1);
	});

	it('should not include assertCanAccessCase when enforceUserLoggedIn is false', async () => {
		const result = checkCaseAccess({ enforceUserLoggedIn: false });

		expect(result).toHaveLength(2);

		for (const middleWare of result) {
			await middleWare(req, res, next);
		}

		expect(mockAuth).toHaveBeenCalledTimes(1);
		expect(mockToken).toHaveBeenCalledTimes(1);
	});

	it('should call userCanModifyCase and set roles', async () => {
		const middleware = checkCaseAccess({ enforceUserLoggedIn: true });
		const assertCanAccessCase = middleware[2];

		mockUserCanModifyCase.mockResolvedValue({
			roles: ['CASE_OFFICER']
		});

		const req = {
			params: { caseReference: 'ABC123' },
			auth: {
				payload: {
					sub: 'user-1'
				}
			}
		};

		const res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn()
		};

		const next = jest.fn();

		await assertCanAccessCase(req, res, next);

		expect(mockUserCanModifyCase).toHaveBeenCalledWith({
			caseReference: 'ABC123',
			userId: 'user-1'
		});

		expect(req.appealUserRoles).toEqual(['CASE_OFFICER']);
		expect(next).toHaveBeenCalled();
	});

	it('should call lpaCanModifyCase for LPA users', async () => {
		const middleware = checkCaseAccess({ enforceUserLoggedIn: true });
		const assertCanAccessCase = middleware[2];

		mockLpaCanModifyCase.mockResolvedValue();

		const req = {
			params: { caseReference: 'ABC123' },
			id_token: {
				lpaCode: 'LPA1'
			}
		};

		const res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn()
		};

		const next = jest.fn();

		await assertCanAccessCase(req, res, next);

		expect(mockLpaCanModifyCase).toHaveBeenCalledWith({
			caseReference: 'ABC123',
			userLpa: 'LPA1'
		});

		expect(req.appealUserRoles).toEqual([]);
		expect(next).toHaveBeenCalled();
	});
});
