const { list } = require('../../../src/controllers/local-planning-authorities');
jest.mock('../../../src/services/lpa.service', () => {
	return jest.fn().mockImplementation(() => ({
		getLpaById: jest
			.fn()
			.mockImplementationOnce(() => ({
				email: 'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
				name: 'System Test Borough Council',
				getName: () => {
					return 'System Test Borough Council';
				}
			}))
			.mockImplementationOnce(() => {
				throw new Error('Internal Server Error');
			})
			.mockImplementationOnce(() => ({
				email: 'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
				name: 'System Test Borough Council',
				getName: () => {
					return 'System Test Borough Council';
				}
			}))
			.mockImplementationOnce(() => {
				throw new Error('Internal Server Error');
			}),
		getLpaList: jest
			.fn()
			.mockReturnValueOnce(['some array'])
			.mockReturnValueOnce(['some-filtered-array'])
	}));
});
const LpaService = require('../../../src/services/lpa.service');
const lpaService = new LpaService();
let req;
let res;
describe('LPAs controller test', () => {
	beforeEach(() => {
		req = {
			log: {
				info: jest.fn(),
				debug: jest.fn(),
				trace: jest.fn()
			},
			params: {},
			query: {}
		};
		res = {
			status: jest.fn(),
			send: jest.fn(),
			json: jest.fn()
		};

		res.status.mockReturnValue(res);
	});

	describe('#list', () => {
		it('should return all LPAs sorted if no filter applied', async () => {
			const data = ['some array'];
			await list(req, res);

			expect(res.json).toHaveBeenCalledWith({
				data,
				page: 1,
				limit: data.length,
				totalPages: 1,
				totalResult: data.length
			});
		});

		it('should return filtered LPAs if filter applied', async () => {
			const filter = 'some-filter';
			req.query = {
				name: filter
			};
			const data = ['some-filtered-array'];
			lpaService;

			await list(req, res);

			expect(res.json).toHaveBeenCalledWith({
				data,
				page: 1,
				limit: data.length,
				totalPages: 1,
				totalResult: data.length
			});
		});
	});
});
