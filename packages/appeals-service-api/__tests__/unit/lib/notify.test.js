jest.mock('@pins/common/src/lib/notify/notify-builder', () => ({
	getNotifyClient: jest.fn().mockReturnThis()
}));

// Mock NotifyService and capture its mock methods for inspection
const mockPopulateTemplate = jest.fn();
const mockSendEmail = jest.fn();

jest.mock('@pins/common/src/lib/notify/notify-service', () => {
	// Mock the NotifyService class constructor
	const mockNotifyService = jest.fn().mockImplementation(() => {
		return {
			populateTemplate: mockPopulateTemplate,
			sendEmail: mockSendEmail
		};
	});

	return { NotifyService: mockNotifyService };
});
jest.mock('../../../src/lib/logger');

const { sendLPADashboardInviteEmail } = require('../../../src/lib/notify');
const config = require('../../../src/configuration/config');
const { templates } = config.services.notify;

describe('appeals-service-api/src/lib/notify.js', () => {
	describe('sendLPADashBoardInviteEmail', () => {
		it('should call notify service with correct values', async () => {
			mockPopulateTemplate.mockReturnValue('Mocked email content');
			mockSendEmail.mockResolvedValue({ status: 200, data: 'Email sent' });

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

			await sendLPADashboardInviteEmail(mockUser);

			const expectedUrl = 'http://appeals.test/manage-appeals/service-invite/Q9999';
			const expectedVariables = {
				'lpa-name': 'Test LPA Name',
				createAccountUrl: expectedUrl
			};

			expect(mockPopulateTemplate).toHaveBeenCalledWith(
				templates.LPA_DASHBOARD.lpaDashboardInviteEmail,
				expectedVariables
			);

			expect(mockSendEmail).toHaveBeenCalledWith({
				personalisation: {
					subject: `Create an account`,
					content: 'Mocked email content'
				},
				destinationEmail: 'test.user@example.com',
				templateId: 'generic-template-id-456',
				reference: 'user-id-abc'
			});
		});
	});
});
