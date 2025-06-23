const { mockReq, mockRes } = require('../mocks');
const { saveAndReturnCreate, saveAndReturnGet } = require('../../../src/controllers/save');
const { updateAppeal } = require('../../../src/services/appeal.service');
const {
	createSavedAppealDocument,
	getSavedAppealDocument
} = require('../../../src/services/save-and-return.service');
const config = require('../../../src/configuration/config');

jest.mock('../../../src/services/save-and-return.service', () => {
	const actual = jest.requireActual('../../../src/services/save-and-return.service');

	return {
		...actual,
		createSavedAppealDocument: jest.fn(),
		getSavedAppealDocument: jest.fn()
	};
});
jest.mock('../../../src/services/appeal.service');
jest.mock('../../../src/repositories/sql/appeal-user-repository');
jest.mock('../../../src/repositories/sql/appeals-repository');
const mockNotifyClient = {
	sendEmail: jest.fn()
};
jest.mock('../../../../common/src/lib/notify/notify-builder', () => ({
	getNotifyClient: () => mockNotifyClient
}));

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
		const expectEmail = (appeal) => {
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
				config.services.notify.templates.generic,
				appeal.email,
				{
					personalisation: {
						subject: `Continue with your appeal for ${appeal.planningApplicationNumber}`,
						content: expect.stringContaining('We’ve saved your appeal.')
					},
					reference: expect.any(String),
					emailReplyToId: undefined
				}
			);
			mockNotifyClient.sendEmail.mockClear();
		};
		it('should respond with - OK 200', async () => {
			const appealStub = {
				id: '1233123123',
				email: 'test@exmaple.com',
				planningApplicationNumber: '1234567',
				appealType: '1001',
				decisionDate: '2023-01-01',
				eligibility: {
					applicationDecision: 'refused'
				}
			};
			req.body = appealStub;

			updateAppeal.mockReturnValue(appealStub);
			await (() => expect(createSavedAppealDocument).toHaveBeenCalledTimes(1));

			await saveAndReturnCreate(req, res);
			expect(createSavedAppealDocument).toHaveBeenCalledWith(req.body.id);
			expectEmail(appealStub);
			expect(res.status).toHaveBeenCalledWith(201);
		});

		it('should respond with - ERROR 400 when appealId is null', async () => {
			req.body = { appealId: null };

			await expect(async () => saveAndReturnCreate(req, res)).rejects.toThrow('');
			expect(res.status).toHaveBeenCalledWith(400);
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
			expect(res.send).toHaveBeenCalledWith({ appealId: '12345' });
		});
	});
});
