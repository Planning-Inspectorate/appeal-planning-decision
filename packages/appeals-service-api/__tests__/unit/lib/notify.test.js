const {
	sendSecurityCodeEmail,
	mapActionToTemplate,
	sendLPADashboardInviteEmail
} = require('../../../src/lib/notify');
const enterCodeConfig = require('../../../../common/src/enter-code-config');
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
	describe('mapActionToTemplate', () => {
		it('should map an action to a default template if not action specified', () => {
			const result = mapActionToTemplate();
			expect(result).toEqual(templates.SAVE_AND_RETURN.enterCodeIntoServiceEmailToAppellant);
		});
		it('should map the lpa-dashboard action to lpa send code email template', () => {
			const result = mapActionToTemplate();
			expect(result).toEqual(templates.LPA_DASHBOARD.enterCodeIntoServiceEmailToLPA);
		});
	});

	describe('sendSecurityCodeEmail', () => {
		it('should default to templates.SAVE_AND_RETURN.enterCodeIntoServiceEmailToAppellant when no action specified', () => {
			const recipientEmail = 'iamnoone@example.com';
			const code = '12345';
			sendSecurityCodeEmail(recipientEmail, code);
			expect(NotifyBuilder.setTemplateId).toHaveBeenCalledWith(
				templates.SAVE_AND_RETURN.enterCodeIntoServiceEmailToAppellant
			);
		});
		it('should map to templates.SAVE_AND_RETURN.enterCodeIntoServiceEmailToAppellant when no action specified', () => {
			const recipientEmail = 'iamnoone@example.com';
			const code = '12345';
			sendSecurityCodeEmail(recipientEmail, code, enterCodeConfig.actions.lpaDashboard);
			expect(NotifyBuilder.setTemplateId).toHaveBeenCalledWith(
				templates.LPA_DASHBOARD.enterCodeIntoServiceEmailToLPA
			);
		});
	});

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
