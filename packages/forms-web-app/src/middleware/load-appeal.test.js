const { loadAppeal } = require('#middleware/load-appeal');

describe('loadAppeal middleware', () => {
	let req, res, next;
	const mockAppealCase = {
		id: '123',
		caseRef: 'APP-2024-001',
		status: 'in_progress'
	};

	beforeEach(() => {
		req = {
			appealsApiClient: {
				getAppealCaseByCaseRef: jest.fn()
			},
			params: {
				appealNumber: 'APP-2024-001'
			}
		};
		res = {
			status: jest.fn().mockReturnThis(),
			render: jest.fn()
		};
		next = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('successful cases', () => {
		it('should fetch appeal case and set on req.appealCase', async () => {
			req.appealsApiClient.getAppealCaseByCaseRef.mockResolvedValue(mockAppealCase);
			const getAppealNumber = (req) => req.params.appealNumber;

			const middleware = loadAppeal(getAppealNumber);
			await middleware(req, res, next);

			expect(req.appealsApiClient.getAppealCaseByCaseRef).toHaveBeenCalledWith(
				'APP-2024-001',
				undefined
			);
			expect(req.appealCase).toEqual(mockAppealCase);
			expect(next).toHaveBeenCalledWith();
		});

		it('should fetch appeal case with selectFields parameter', async () => {
			req.appealsApiClient.getAppealCaseByCaseRef.mockResolvedValue(mockAppealCase);
			const selectFields = { id: true, caseRef: true };
			const getAppealNumber = (req) => req.params.appealNumber;

			const middleware = loadAppeal(getAppealNumber, selectFields);
			await middleware(req, res, next);

			expect(req.appealsApiClient.getAppealCaseByCaseRef).toHaveBeenCalledWith(
				'APP-2024-001',
				selectFields
			);
			expect(req.appealCase).toEqual(mockAppealCase);
			expect(next).toHaveBeenCalledWith();
		});

		it('should work with custom getAppealNumber function', async () => {
			req.appealsApiClient.getAppealCaseByCaseRef.mockResolvedValue(mockAppealCase);
			req.query = { caseRef: 'APP-2024-002' };
			const getAppealNumber = (req) => req.query.caseRef;

			const middleware = loadAppeal(getAppealNumber);
			await middleware(req, res, next);

			expect(req.appealsApiClient.getAppealCaseByCaseRef).toHaveBeenCalledWith(
				'APP-2024-002',
				undefined
			);
			expect(req.appealCase).toEqual(mockAppealCase);
			expect(next).toHaveBeenCalledWith();
		});
	});

	describe('error cases', () => {
		it('should render 404 page when appeal case not found', async () => {
			const notFoundError = new Error('Not found');
			notFoundError.code = 404;
			req.appealsApiClient.getAppealCaseByCaseRef.mockRejectedValue(notFoundError);
			const getAppealNumber = (req) => req.params.appealNumber;

			const middleware = loadAppeal(getAppealNumber);
			await middleware(req, res, next);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.render).toHaveBeenCalledWith('error/not-found');
			expect(next).not.toHaveBeenCalled();
		});

		it('should pass other errors to next error handler', async () => {
			const serverError = new Error('Server error');
			serverError.code = 500;
			req.appealsApiClient.getAppealCaseByCaseRef.mockRejectedValue(serverError);
			const getAppealNumber = (req) => req.params.appealNumber;

			const middleware = loadAppeal(getAppealNumber);
			await middleware(req, res, next);

			expect(next).toHaveBeenCalledWith(serverError);
			expect(res.status).not.toHaveBeenCalled();
			expect(res.render).not.toHaveBeenCalled();
		});

		it('should pass error with undefined code to next error handler', async () => {
			const error = new Error('Unknown error');
			req.appealsApiClient.getAppealCaseByCaseRef.mockRejectedValue(error);
			const getAppealNumber = (req) => req.params.appealNumber;

			const middleware = loadAppeal(getAppealNumber);
			await middleware(req, res, next);

			expect(next).toHaveBeenCalledWith(error);
		});
	});
});
