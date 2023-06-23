const { sendSecurityCodeEmail, mapActionToTemplate } = require('../../../src/lib/notify');
const enterCodeConfig = require('../../../../common/src/enter-code-config');
const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const config = require('../../../src/configuration/config');
const { templates } = config.services.notify;

jest.mock('@pins/common/src/lib/notify/notify-builder', () => {
	const originalModule = jest.requireActual('@pins/common/src/lib/notify/notify-builder');
	const newModule = {
		setTemplateId: jest.fn().mockReturnValue({
			setDestinationEmailAddress: jest.fn(
				jest
					.fn()
					.mockReturnValue({
						setTemplateVariablesFromObject: jest.fn(
							jest
								.fn()
								.mockReturnValue({
									setReference: jest.fn(jest.fn().mockReturnValue({ sendEmail: jest.fn() }))
								})
						)
					})
			)
		})
	};
	return {
		//__esModule: true,
		...originalModule,
		...newModule
	};
});

describe('appeals-service-api/src/lib/notify.js', () => {
	it('should map an action to a default template if not action specified', () => {
		const result = mapActionToTemplate();
		expect(result).toEqual(templates.SAVE_AND_RETURN.enterCodeIntoServiceEmailToAppellant);
	});
	it('should map the lpa-dashboard action to lpa send code email template', () => {
		const result = mapActionToTemplate();
		expect(result).toEqual(templates.LPA_DASHBOARD.enterCodeIntoServiceEmailToLPA);
	});
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
