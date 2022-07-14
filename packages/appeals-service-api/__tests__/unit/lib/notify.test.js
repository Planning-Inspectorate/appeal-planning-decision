const householderAppeal = require('@pins/business-rules/test/data/householder-appeal');
const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const {
	sendSubmissionReceivedEmailToLpa,
	sendSubmissionConfirmationEmailToAppellant,
	createToken,
	sendConfirmEmailAddressEmail
} = require('../../../src/lib/notify');
const logger = require('../../../src/lib/logger');

jest.mock('@pins/common/src/lib/notify/notify-builder', () => ({
	reset: jest.fn().mockReturnThis(),
	setTemplateId: jest.fn().mockReturnThis(),
	setDestinationEmailAddress: jest.fn().mockReturnThis(),
	setTemplateVariablesFromObject: jest.fn().mockReturnThis(),
	setReference: jest.fn().mockReturnThis(),
	sendEmail: jest.fn().mockReturnThis()
}));
jest.mock('../../../src/services/lpa.service', () => ({
	getLpa: jest
		.fn()
		.mockImplementationOnce(() => ({
			email: 'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
			name: 'System Test Borough Council'
		}))
		.mockImplementationOnce(() => {
			throw new Error('Internal Server Error');
		})
		.mockImplementationOnce(() => ({
			email: 'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
			name: 'System Test Borough Council'
		}))
		.mockImplementationOnce(() => {
			throw new Error('Internal Server Error');
		})
}));
jest.mock('../../../src/lib/config', () => ({
	services: {
		notify: {
			templates: {
				1001: {
					appealSubmissionConfirmationEmailToAppellant: 'appellant-template',
					appealNotificationEmailToLpa: 'lpa-template'
				},
				CONFIRM_EMAIL: {
					confirmEmail: 'confirm-email-template'
				}
			}
		}
	},
	logger: {
		level: 'info'
	},
	apps: {
		appeals: {
			baseUrl: 'baseUrl'
		}
	}
}));
jest.mock('../../../src/lib/logger', () => ({
	debug: jest.fn(),
	error: jest.fn()
}));

describe('lib/notify', () => {
	process.env.APP_APPEALS_BASE_URL = 'http://localhost';

	describe('sendSubmissionConfirmationEmailToAppellant', () => {
		it('should call NotifyBuilder with the correct data', async () => {
			await sendSubmissionConfirmationEmailToAppellant(householderAppeal);

			expect(NotifyBuilder.reset).toBeCalled();
			expect(NotifyBuilder.reset().setTemplateId).toBeCalledWith('appellant-template');
			expect(NotifyBuilder.reset().setTemplateId().setDestinationEmailAddress).toBeCalledWith(
				householderAppeal.email
			);
			expect(
				NotifyBuilder.reset()
					.setTemplateId()
					.setDestinationEmailAddress()
					.setTemplateVariablesFromObject().setReference
			).toBeCalledWith(householderAppeal.id);
			expect(
				NotifyBuilder.reset()
					.setTemplateId()
					.setDestinationEmailAddress()
					.setTemplateVariablesFromObject()
					.setReference().sendEmail
			).toBeCalled();
		});

		it('log the error when an error is thrown', async () => {
			await sendSubmissionConfirmationEmailToAppellant(householderAppeal);

			expect(logger.error).toBeCalledWith(
				{ err: new Error('Internal Server Error'), appealId: householderAppeal.id },
				'Unable to send submission confirmation email to appellant'
			);
		});
	});

	describe('sendSubmissionReceivedEmailToLpa', () => {
		it('should call NotifyBuilder with the correct data', async () => {
			await sendSubmissionReceivedEmailToLpa(householderAppeal);

			expect(NotifyBuilder.reset).toBeCalled();
			expect(NotifyBuilder.reset().setTemplateId).toBeCalledWith('lpa-template');
			expect(NotifyBuilder.reset().setTemplateId().setDestinationEmailAddress).toBeCalledWith(
				'AppealPlanningDecisionTest@planninginspectorate.gov.uk'
			);
			expect(
				NotifyBuilder.reset().setTemplateId().setDestinationEmailAddress()
					.setTemplateVariablesFromObject
			).toBeCalledWith({
				LPA: 'System Test Borough Council',
				date: expect.any(String),
				'planning application number': householderAppeal.planningApplicationNumber,
				'site address': 'Site Address 1\nSite Address 2\nSite Town\nSite County\nSW1 1AA'
			});
			expect(
				NotifyBuilder.reset()
					.setTemplateId()
					.setDestinationEmailAddress()
					.setTemplateVariablesFromObject().setReference
			).toBeCalledWith(householderAppeal.id);
			expect(
				NotifyBuilder.reset()
					.setTemplateId()
					.setDestinationEmailAddress()
					.setTemplateVariablesFromObject()
					.setReference().sendEmail
			).toBeCalled();
		});

		it('log the error when an error is thrown', async () => {
			await sendSubmissionReceivedEmailToLpa(householderAppeal);

			expect(logger.error).toBeCalledWith(
				{ err: new Error('Internal Server Error'), lpaCode: householderAppeal.lpaCode },
				'Unable to send submission received email to LPA'
			);
		});
	});
	describe('save and return token', () => {
		it('should create token', () => {
			expect(createToken().toString()).toMatch(/\d{5}/);
		});
	});

	describe('sendConfirmEmailAddressEmail', () => {
		it('should call NotifyBuilder with the correct data', async () => {
			await sendConfirmEmailAddressEmail(fullAppeal, '12345');

			expect(NotifyBuilder.reset).toBeCalled();
			expect(NotifyBuilder.reset().setTemplateId).toBeCalledWith('confirm-email-template');
			expect(NotifyBuilder.reset().setTemplateId().setDestinationEmailAddress).toBeCalledWith(
				fullAppeal.email
			);
			expect(
				NotifyBuilder.reset()
					.setTemplateId()
					.setDestinationEmailAddress()
					.setTemplateVariablesFromObject().setReference
			).toBeCalledWith(fullAppeal.id);

			expect(
				NotifyBuilder.reset()
					.setTemplateId()
					.setDestinationEmailAddress()
					.setTemplateVariablesFromObject()
					.setReference().sendEmail
			).toBeCalled();
		});

		it('log the error when an error is thrown', async () => {
			NotifyBuilder.reset.mockImplementationOnce(() => {
				throw new Error('error message');
			});
			await sendConfirmEmailAddressEmail(fullAppeal, '12345');

			expect(logger.error).toBeCalledWith(
				{ err: new Error('error message'), appealId: fullAppeal.id },
				'Unable to send confirm email address confirmation email to appellant'
			);
		});
	});
});
