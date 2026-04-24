const { getDraft } = require('./controller');
const { getAppealDraft } = require('./service');
const ApiError = require('#errors/apiError');

jest.mock('./service');

describe('appeals controller v2', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getDraft', () => {
		it('should return a draft with 200 status', async () => {
			const userId = 'user-1';
			const appealId = 'appeal-123';
			const mockDraft = {
				id: appealId,
				appealStatus: 'DRAFT',
				appellant: {
					firstName: 'John',
					lastName: 'Doe'
				}
			};

			const req = {
				auth: {
					payload: {
						sub: userId
					}
				},
				params: {
					id: appealId
				}
			};

			const res = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};

			getAppealDraft.mockResolvedValue(mockDraft);

			await getDraft(req, res);

			expect(getAppealDraft).toHaveBeenCalledWith(userId, appealId);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith(mockDraft);
		});

		it('should throw ApiError when userId is missing', async () => {
			const appealId = 'appeal-123';

			const req = {
				auth: {
					payload: {
						sub: null
					}
				},
				params: {
					id: appealId
				}
			};

			const res = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};

			await expect(getDraft(req, res)).rejects.toEqual(ApiError.invalidToken());
			expect(getAppealDraft).not.toHaveBeenCalled();
		});

		it('should throw ApiError from service when draft not found', async () => {
			const userId = 'user-1';
			const appealId = 'appeal-123';
			const notFoundError = ApiError.appealNotFound(appealId);

			const req = {
				auth: {
					payload: {
						sub: userId
					}
				},
				params: {
					id: appealId
				}
			};

			const res = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};

			getAppealDraft.mockRejectedValue(notFoundError);

			await expect(getDraft(req, res)).rejects.toEqual(notFoundError);
		});

		it('should throw ApiError from service when user is forbidden', async () => {
			const userId = 'user-1';
			const appealId = 'appeal-123';
			const forbiddenError = ApiError.forbidden();

			const req = {
				auth: {
					payload: {
						sub: userId
					}
				},
				params: {
					id: appealId
				}
			};

			const res = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};

			getAppealDraft.mockRejectedValue(forbiddenError);

			await expect(getDraft(req, res)).rejects.toEqual(forbiddenError);
		});

		it('should handle v2 draft submissions', async () => {
			const userId = 'user-1';
			const appealId = 'appeal-456';
			const mockV2Draft = {
				id: appealId,
				AppellantSubmission: {
					submitted: false,
					submissionId: 'sub-456'
				}
			};

			const req = {
				auth: {
					payload: {
						sub: userId
					}
				},
				params: {
					id: appealId
				}
			};

			const res = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};

			getAppealDraft.mockResolvedValue(mockV2Draft);

			await getDraft(req, res);

			expect(getAppealDraft).toHaveBeenCalledWith(userId, appealId);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith(mockV2Draft);
		});

		it('should handle legacy draft submissions from Cosmos', async () => {
			const userId = 'user-1';
			const appealId = 'appeal-789';
			const mockLegacyDraft = {
				id: appealId,
				legacyAppealSubmissionId: 'legacy-sub-789',
				legacyAppealSubmissionState: 'DRAFT'
			};

			const req = {
				auth: {
					payload: {
						sub: userId
					}
				},
				params: {
					id: appealId
				}
			};

			const res = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn()
			};

			getAppealDraft.mockResolvedValue(mockLegacyDraft);

			await getDraft(req, res);

			expect(getAppealDraft).toHaveBeenCalledWith(userId, appealId);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith(mockLegacyDraft);
		});
	});
});
