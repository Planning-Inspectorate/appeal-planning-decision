const fs = require('fs');
const path = require('path');
const {
	getSubmissionInformation
} = require('../../../../src/controllers/appellant-submission/submission-information');
const { mockReq, mockRes } = require('../../mocks');
const {
	VIEW: {
		APPELLANT_SUBMISSION: { SUBMISSION_INFORMATION }
	}
} = require('../../../../src/lib/views');
jest.mock('../../../../src/services/department.service');
const mockLogger = jest.fn();

jest.mock('../../../../src/lib/logger', () => ({
	child: () => ({
		debug: mockLogger,
		error: mockLogger,
		info: mockLogger,
		warn: mockLogger
	})
}));
describe('controllers/appellant-submission/submission-information', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(null);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getSubmissionInformation', () => {
		it('should return 400 if appeal id not provided', async () => {
			req.params.appealId = null;

			await getSubmissionInformation(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.render).toHaveBeenCalledWith('error/400', {
				message: 'The appealId should be provided in the request param.'
			});
		});
		it('should return 404 if appeal not found', async () => {
			req.params.appealId = 'some-id';

			await getSubmissionInformation(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.render).toHaveBeenCalledWith('error/not-found');
		});

		it('should return 400 if the LPD is not found for the given LPA', async () => {
			req = {
				...req,
				params: { appealId: 'some-id' },

				session: {
					appeal: {}
				}
			};

			await getSubmissionInformation(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.render).toHaveBeenCalledWith('error/400', {
				message: 'Unable to locate the Local Planning Authority for the given LPA Code.'
			});
		});

		it('should define default value if appeal submission date is not defined', async () => {
			const fakeLpdName = 'fake lpd name here';
			req = {
				...req,
				params: { appealId: 'some-id' },
				session: {
					appeal: {
						some: 'data',
						lpaCode: '123-abc'
					},
					appealLPD: {
						name: fakeLpdName
					}
				}
			};

			await getSubmissionInformation(req, res);

			expect(req.session.appeal.submissionDate).not.toBeNull();
		});

		it('should call the correct template with the expected data on the happy path', async () => {
			const fakeLpdName = 'fake lpd name here';
			const submissionDate = new Date();
			req = {
				...req,
				params: { appealId: 'some-id' },
				session: {
					appeal: {
						some: 'data',
						lpaCode: '123-abc',
						submissionDate
					},
					appealLPD: {
						name: fakeLpdName
					}
				}
			};

			await getSubmissionInformation(req, res);

			const css = fs.readFileSync(
				path.resolve(__dirname, '../../../../src/public/stylesheets/main.min.css'),
				'utf8'
			);

			expect(res.render).toHaveBeenCalledWith(SUBMISSION_INFORMATION, {
				appealLPD: fakeLpdName,
				appeal: req.session.appeal,
				css,
				displayCookieBanner: false
			});
		});
	});
});
