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
const mockGetServiceUserById = /** @type {any} */ (service.getServiceUserById);
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

		it('should find Rule 6 user by ID and send updated email when ID exists', async () => {
			const existingServiceUser = {
				id: 'existing-r6-id',
				emailAddress: 'r6@example.com',
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY
			};
			const mockServiceUser = {
				...existingServiceUser,
				caseReference: '123456'
			};
			const mockAppealCase = {
				caseReference: '123456'
			};

			mockReq.body = {
				id: 'existing-r6-id',
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
				caseReference: '123456',
				emailAddress: 'r6@example.com'
			};

			mockGetServiceUserById.mockResolvedValue(existingServiceUser);
			mockServicePut.mockResolvedValue(mockServiceUser);
			mockGetCaseAndAppellant.mockResolvedValue(mockAppealCase);

			await put(mockReq, mockRes);

			expect(service.getServiceUserById).toHaveBeenCalledWith('existing-r6-id');
			expect(mockReq.body.id).toBe('existing-r6-id');
			expect(notify.sendRule6PartyUpdatedEmailToMainParties).toHaveBeenCalledWith(
				mockServiceUser,
				mockAppealCase
			);
			expect(notify.sendRule6PartyAddedEmailToRule6Party).not.toHaveBeenCalled();
			expect(notify.sendRule6PartyAddedEmailToMainParties).not.toHaveBeenCalled();
		});

		it('should send added emails when Rule 6 user ID does not exist', async () => {
			const mockServiceUser = {
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
				caseReference: '123456',
				emailAddress: 'newr6@example.com'
			};
			const mockAppealCase = {
				caseReference: '123456'
			};

			mockReq.body = {
				id: 'non-existent-id',
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
				caseReference: '123456',
				emailAddress: 'newr6@example.com'
			};

			mockGetServiceUserById.mockResolvedValue(null);
			mockGetForEmailCaseAndType.mockResolvedValue(null);
			mockServicePut.mockResolvedValue(mockServiceUser);
			mockGetCaseAndAppellant.mockResolvedValue(mockAppealCase);

			await put(mockReq, mockRes);

			expect(service.getServiceUserById).toHaveBeenCalledWith('non-existent-id');
			expect(service.getForEmailCaseAndType).toHaveBeenCalledWith('newr6@example.com', '123456', [
				SERVICE_USER_TYPE.RULE_6_PARTY
			]);
			expect(notify.sendRule6PartyAddedEmailToRule6Party).toHaveBeenCalledWith(
				mockServiceUser,
				mockAppealCase
			);
			expect(notify.sendRule6PartyAddedEmailToMainParties).toHaveBeenCalledWith(
				mockServiceUser,
				mockAppealCase
			);
			expect(notify.sendRule6PartyUpdatedEmailToMainParties).not.toHaveBeenCalled();
		});

		it('should use ID lookup before email lookup when both are provided', async () => {
			const existingServiceUser = {
				id: 'existing-r6-id',
				emailAddress: 'original@example.com',
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY
			};
			const mockServiceUser = {
				...existingServiceUser,
				caseReference: '123456'
			};
			const mockAppealCase = {
				caseReference: '123456'
			};

			mockReq.body = {
				id: 'existing-r6-id',
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
				caseReference: '123456',
				emailAddress: 'different@example.com'
			};

			mockGetServiceUserById.mockResolvedValue(existingServiceUser);
			mockServicePut.mockResolvedValue(mockServiceUser);
			mockGetCaseAndAppellant.mockResolvedValue(mockAppealCase);

			await put(mockReq, mockRes);

			expect(service.getServiceUserById).toHaveBeenCalledWith('existing-r6-id');
			expect(service.getForEmailCaseAndType).not.toHaveBeenCalled();
			expect(mockReq.body.id).toBe('existing-r6-id');
			expect(notify.sendRule6PartyUpdatedEmailToMainParties).toHaveBeenCalledWith(
				mockServiceUser,
				mockAppealCase
			);
		});
	});
});
