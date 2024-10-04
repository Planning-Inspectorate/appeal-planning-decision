const { sendLPADashboardInviteEmail } = require('../../../src/lib/notify');
const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const config = require('../../../src/configuration/config');
const { templates } = config.services.notify;

jest.mock('@pins/common/src/lib/notify/notify-builder', () => ({
	reset: jest.fn().mockReturnThis(),
	setTemplateId: jest.fn().mockReturnThis(),
	setDestinationEmailAddress: jest.fn().mockReturnThis(),
	setTemplateVariablesFromObject: jest.fn().mockReturnThis(),
	setReference: jest.fn().mockReturnThis(),
	sendEmail: jest.fn().mockReturnThis()
}));

jest.mock('../../../src/services/lpa.service', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getLpaByCode: () => {
				return {
					getName: () => {
						return 'test name';
					}
				};
			}
		};
	});
});

jest.mock('../../../src/services/lpa.service');
jest.mock('../../../src/lib/logger');

describe('appeals-service-api/src/lib/notify.js', () => {
	describe('sendLPADashBoardInviteEmail', () => {
		it('should call notify builder with correct values', async () => {
			const mockUser = {
				_id: '123456',
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

			expect(NotifyBuilder.reset).toHaveBeenCalled();
			expect(NotifyBuilder.setTemplateId).toHaveBeenCalledWith(
				templates.LPA_DASHBOARD.lpaDashboardInviteEmail
			);
			expect(NotifyBuilder.setDestinationEmailAddress).toHaveBeenCalledWith(mockUser.email);
			expect(NotifyBuilder.setTemplateVariablesFromObject).toHaveBeenCalledWith({
				'local planning authority': 'test name',
				'lpa-link': 'mock-base-url/manage-appeals/your-email-address'
			});
			expect(NotifyBuilder.setReference).toHaveBeenCalledWith(mockUser._id);
			expect(NotifyBuilder.sendEmail).toHaveBeenCalledWith(
				'mock-notify-base-url',
				'mock-notify-service-id',
				'mock-notify-api-key'
			);
		});
	});
});
