const service = require('../../../src/services/lpa.service');
const lpas = require('../../../src/controllers/local-planning-authorities');

jest.mock('../../../src/services/lpa.service');

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
			send: jest.fn()
		};

		res.status.mockReturnValue(res);
	});

	describe('#list', () => {
		it('should return all LPAs sorted if no filter applied', async () => {
			const data = ['some-array'];
			service.getLpaList.mockResolvedValue(data);

			await lpas.list(req, res);

			expect(service.getLpaList).toBeCalled();

			expect(res.send).toBeCalledWith({
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
			service.getLpaList.mockResolvedValue(data);

			await lpas.list(req, res);

			expect(service.getLpaList).toBeCalled();

			expect(res.send).toBeCalledWith({
				data,
				page: 1,
				limit: data.length,
				totalPages: 1,
				totalResult: data.length
			});
		});
	});
});
