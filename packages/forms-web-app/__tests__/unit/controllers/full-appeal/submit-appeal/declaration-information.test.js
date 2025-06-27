const fs = require('fs');
const path = require('path');
const {
	getDeclarationInformation
} = require('../../../../../src/controllers/full-appeal/submit-appeal/declaration-information');
const { mockReq, mockRes } = require('../../../mocks');
const {
	VIEW: {
		FULL_APPEAL: { DECLARATION_INFORMATION }
	}
} = require('../../../../../src/lib/views');

jest.mock('../../../../../src/services/department.service');
const mockLogger = jest.fn();

jest.mock('../../../../../src/lib/logger', () => ({
	child: () => ({
		debug: mockLogger,
		error: mockLogger,
		info: mockLogger,
		warn: mockLogger
	})
}));
describe('controllers/full-appeal/submit-appeal/declaration-information', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(null);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getDeclarationInformation', () => {
		it('should return 400 if appeal id not provided', async () => {
			req.params.appealId = null;

			await getDeclarationInformation(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.render).toHaveBeenCalledWith('error/400', {
				message: 'The appealId should be provided in the request param.'
			});
		});
		it('should return 400 if appealLPD does not exist in sesion', async () => {
			req.params.appealId = 'some-id';
			req.session.appeal = {};
			await getDeclarationInformation(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.render).toHaveBeenCalledWith('error/400', {
				message: 'Unable to locate the Local Planning Department for the given LPA Code.'
			});
		});
		it('should return 404 if appeal not found', async () => {
			req.params.appealId = 'some-id';

			await getDeclarationInformation(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.render).toHaveBeenCalledWith('error/not-found');
		});

		it('should define default value if appeal submission date is not defined', async () => {
			const lpdName = 'fake lpd name here';

			req = {
				...req,
				params: { appealId: 'some-id' },
				session: {
					appeal: {
						some: 'data',
						lpaCode: '123-abc',
						planningApplicationNumber: '1234567890'
					},
					appealLPD: {
						name: lpdName
					}
				}
			};

			await getDeclarationInformation(req, res);

			expect(req.session.appeal.submissionDate).not.toBeNull();
		});

		it('should call the correct template with the expected data on the happy path', async () => {
			const lpdName = 'System Test Borough Council';
			const submissionDate = new Date();
			req = {
				...req,
				params: { appealId: 'some-id' },
				session: {
					appeal: {
						some: 'data',
						lpaCode: '123-abc',
						planningApplicationNumber: '1234567890',
						submissionDate
					},
					appealLPD: {
						name: lpdName
					}
				}
			};

			await getDeclarationInformation(req, res);

			const css = fs.readFileSync(
				path.resolve(__dirname, '../../../../../src/public/stylesheets/main.min.css'),
				'utf8'
			);

			expect(res.render).toHaveBeenCalledWith(DECLARATION_INFORMATION, {
				appealLPD: lpdName,
				appeal: req.session.appeal,
				css,
				displayCookieBanner: false
			});
		});
	});
});
