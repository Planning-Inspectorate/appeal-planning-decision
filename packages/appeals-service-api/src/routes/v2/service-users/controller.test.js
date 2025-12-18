const { put } = require('./controller');
const service = require('./service');
const appealCasesService = require('../appeal-cases/service');
const notify = require('../../../lib/notify');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');

jest.mock('./service');
jest.mock('../appeal-cases/service');
jest.mock('../../../lib/notify');
jest.mock('../users/service', () => ({
	getUserByEmail: jest.fn(),
	unlinkUserFromAppeal: jest.fn()
}));

/** @type {jest.Mock} */
const mockGetForEmailCaseAndType = /** @type {any} */ (service.getForEmailCaseAndType);
/** @type {jest.Mock} */
const mockServicePut = /** @type {any} */ (service.put);
/** @type {jest.Mock} */
const mockGetCaseAndAppellant = /** @type {any} */ (appealCasesService.getCaseAndAppellant);

const mockReq = {
	body: {
		serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
		caseReference: '123456',
		emailAddress: 'test@example.com'
	}
};

const mockRes = {
	send: jest.fn(),
	sendStatus: jest.fn()
};

describe('service-users controller', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('put', () => {
		it('should send created and added emails when Rule 6 user is new', async () => {
			const mockServiceUser = {
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
				caseReference: '123456',
				emailAddress: 'r6@example.com'
			};
			const mockAppealCase = {
				caseReference: '123456'
			};

			mockGetForEmailCaseAndType.mockResolvedValue(null);
			mockServicePut.mockResolvedValue(mockServiceUser);
			mockGetCaseAndAppellant.mockResolvedValue(mockAppealCase);

			await put(mockReq, mockRes);

			expect(service.getForEmailCaseAndType).toHaveBeenCalledWith(
				mockReq.body.emailAddress,
				mockReq.body.caseReference,
				[SERVICE_USER_TYPE.RULE_6_PARTY]
			);
			expect(service.put).toHaveBeenCalledWith(mockReq.body);

			expect(notify.sendRule6PartyAddedEmailToRule6Party).toHaveBeenCalledWith(
				mockServiceUser,
				mockAppealCase
			);
			expect(notify.sendRule6PartyAddedEmailToMainParties).toHaveBeenCalledWith(
				mockServiceUser,
				mockAppealCase
			);

			expect(notify.sendRule6PartyUpdatedEmailToMainParties).not.toHaveBeenCalled();

			expect(mockRes.send).toHaveBeenCalledWith(mockServiceUser);
		});

		it('should send updated email when Rule 6 user already exists', async () => {
			const mockServiceUser = {
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
				caseReference: '123456',
				emailAddress: 'r6@example.com'
			};
			const mockAppealCase = {
				caseReference: '123456'
			};

			mockGetForEmailCaseAndType.mockResolvedValue({
				id: 'existing-id'
			});

			mockServicePut.mockResolvedValue(mockServiceUser);
			mockGetCaseAndAppellant.mockResolvedValue(mockAppealCase);

			await put(mockReq, mockRes);

			expect(service.getForEmailCaseAndType).toHaveBeenCalled();
			expect(service.put).toHaveBeenCalledWith(mockReq.body);

			expect(notify.sendRule6PartyUpdatedEmailToMainParties).toHaveBeenCalledWith(
				mockServiceUser,
				mockAppealCase
			);
			expect(notify.sendRule6PartyAddedEmailToRule6Party).not.toHaveBeenCalled();
			expect(notify.sendRule6PartyAddedEmailToMainParties).not.toHaveBeenCalled();

			expect(mockRes.send).toHaveBeenCalledWith(mockServiceUser);
		});

		it('should not send any Rule 6 emails when user type is not rule 6 party', async () => {
			const mockServiceUser = {
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				caseReference: '123456'
			};

			mockServicePut.mockResolvedValue(mockServiceUser);

			mockReq.body.serviceUserType = SERVICE_USER_TYPE.APPELLANT;
			await put(mockReq, mockRes);

			expect(notify.sendRule6PartyAddedEmailToRule6Party).not.toHaveBeenCalled();
			expect(notify.sendRule6PartyAddedEmailToMainParties).not.toHaveBeenCalled();
			expect(notify.sendRule6PartyUpdatedEmailToMainParties).not.toHaveBeenCalled();

			expect(mockRes.send).toHaveBeenCalledWith(mockServiceUser);
		});

		it('should not send Rule 6 emails when appeal case is not found', async () => {
			const mockServiceUser = {
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
				caseReference: '123456'
			};

			mockGetForEmailCaseAndType.mockResolvedValue(null);
			mockServicePut.mockResolvedValue(mockServiceUser);
			mockGetCaseAndAppellant.mockResolvedValue(null);

			mockReq.body.serviceUserType = SERVICE_USER_TYPE.RULE_6_PARTY;
			await put(mockReq, mockRes);

			expect(appealCasesService.getCaseAndAppellant).toHaveBeenCalledWith({
				caseReference: '123456'
			});
			expect(notify.sendRule6PartyAddedEmailToRule6Party).not.toHaveBeenCalled();
			expect(notify.sendRule6PartyAddedEmailToMainParties).not.toHaveBeenCalled();
			expect(notify.sendRule6PartyUpdatedEmailToMainParties).not.toHaveBeenCalled();

			expect(mockRes.send).toHaveBeenCalledWith(mockServiceUser);
		});
	});
});
