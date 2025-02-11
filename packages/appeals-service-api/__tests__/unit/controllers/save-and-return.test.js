const { mockReq, mockRes } = require('../mocks');
const { saveAndReturnCreate, saveAndReturnGet } = require('../../../src/controllers/save');
const { updateAppeal } = require('../../../src/services/appeal.service');
const {
	createSavedAppealDocument,
	getSavedAppealDocument
} = require('../../../src/services/save-and-return.service');

jest.mock('../../../src/services/save-and-return.service');
jest.mock('../../../src/services/appeal.service');
jest.mock('../../../../common/src/lib/notify/notify-builder', () => ({}));
jest.mock('../../../src/repositories/sql/appeal-user-repository');
jest.mock('../../../src/repositories/sql/appeals-repository');

describe('Save And Return API', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('POST - create and send save and return', () => {
		it('should respond with - OK 200', async () => {
			const appealStub = {
				id: '1233123123'
			};
			req.body = appealStub;

			updateAppeal.mockReturnValue(appealStub);
			await (() => expect(createSavedAppealDocument).toBeCalledTimes(1));

			await saveAndReturnCreate(req, res);
			expect(createSavedAppealDocument).toHaveBeenCalledWith(req.body.id);
			expect(res.status).toHaveBeenCalledWith(201);
		});

		it('should respond with - ERROR 400 when appealId is null', async () => {
			req.body = { appealId: null };

			await saveAndReturnCreate(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.send).toHaveBeenCalledWith('Invalid Id');
			expect(createSavedAppealDocument).toHaveBeenCalledTimes(0);
		});
	});

	describe('GET - get saved appeal', () => {
		it('should retrieve saved appeal by appealId', async () => {
			req.params = { id: '12345' };
			getSavedAppealDocument.mockReturnValue({ appealId: '12345' });
			await saveAndReturnGet(req, res);
			expect(getSavedAppealDocument).toHaveBeenCalledWith('12345');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ appealId: '12345' });
		});
	});
});
