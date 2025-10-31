jest.mock('@pins/common/src/lib/notify/notify-builder', () => ({
	getNotifyClient: jest.fn(() => ({}))
}));

const mockPopulateTemplate = jest.fn(() => 'Mocked email content');
const mockSendEmail = jest.fn().mockResolvedValue({});
const MockNotifyService = jest.fn().mockImplementation(() => ({
	populateTemplate: mockPopulateTemplate,
	sendEmail: mockSendEmail
}));
MockNotifyService.templates = {
	lpaq: { v2LpaDashboardInvite: 'lpaq/v2-lpa-dashboard-invite-email.md' }
};
jest.mock('@pins/common/src/lib/notify/notify-service', () => MockNotifyService);
const Notify = require('../../../src/lib/notify');
const config = require('../../../src/configuration/config');

describe('appeals-service-api/src/lib/notify.js', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('sendLPADashBoardInviteEmail', () => {
		it('should call notify service with correct values', async () => {
			const mockUser = {
				id: '123456',
				email: 'test@example.com',
				isAdmin: false,
				enabled: true,
				lpaCode: 'Q9999'
			};

			config.apps.appeals.baseUrl = 'mock-base-url';
			config.services.notify.baseUrl = 'mock-notify-base-url';
			config.services.notify.serviceId = 'mock-notify-service-id';
			config.services.notify.apiKey = 'mock-notify-api-key';
			config.services.notify.templates.generic = 'generic-template';

			const NotifyServiceMock = require('@pins/common/src/lib/notify/notify-service');

			await Notify.sendLPADashboardInviteEmail(mockUser);

			expect(NotifyServiceMock).toHaveBeenCalled();
			expect(mockPopulateTemplate).toHaveBeenCalledWith('lpaq/v2-lpa-dashboard-invite-email.md', {
				createAccountUrl: 'mock-base-url/manage-appeals/service-invite/Q9999',
				...config.services.notify.templateVariables
			});
			expect(mockSendEmail).toHaveBeenCalledWith({
				personalisation: {
					subject: `Create an account`,
					content: 'Mocked email content'
				},
				destinationEmail: 'test@example.com',
				templateId: 'generic-template',
				reference: '123456'
			});
		});
	});
});
