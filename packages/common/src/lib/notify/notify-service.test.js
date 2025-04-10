const NotifyService = require('./notify-service');
const fs = require('fs');
const path = require('path');
const notifyClientMock = jest.fn().mockImplementation(() => ({
	sendEmail: jest.fn()
}));
const loggerMock = jest.fn().mockImplementation(() => ({
	info: jest.fn(),
	debug: jest.fn(),
	error: jest.fn()
}));

describe('NotifyService', () => {
	let notifyService;
	let notifyClient = notifyClientMock();
	let logger = loggerMock();

	beforeEach(() => {
		jest.clearAllMocks();
		notifyService = new NotifyService({ notifyClient, logger });
	});

	describe('sendEmail', () => {
		it('should log and send an email', async () => {
			notifyClient.sendEmail.mockResolvedValue({});
			logger.info.mockClear();
			logger.debug.mockClear();

			await notifyService.sendEmail({
				destinationEmail: 'test@example.com',
				templateId: 'template-id',
				reference: 'reference',
				personalisation: { name: 'John' },
				emailReplyToId: 'reply-to-id'
			});

			expect(logger.info).toHaveBeenCalledWith('Sending template-id via notify ref reference');
			expect(logger.debug).toHaveBeenCalledWith({
				destinationEmail: 'test@example.com',
				templateId: 'template-id',
				personalisation: { name: 'John' },
				emailReplyToId: 'reply-to-id',
				reference: 'reference'
			});
			expect(notifyClient.sendEmail).toHaveBeenCalledWith('template-id', 'test@example.com', {
				personalisation: { name: 'John' },
				reference: 'reference',
				emailReplyToId: 'reply-to-id'
			});
		});

		it('should throw an error if templateId is missing', async () => {
			await expect(
				notifyService.sendEmail({
					destinationEmail: 'test@example.com',
					reference: 'reference'
				})
			).rejects.toThrow('Template ID must be set before an email can be sent.');
		});

		it('should throw an error if destinationEmail is missing', async () => {
			await expect(
				notifyService.sendEmail({
					templateId: 'template-id',
					reference: 'reference'
				})
			).rejects.toThrow('A destination email address must be set before an email can be sent.');
		});

		it('should throw an error if reference is missing', async () => {
			await expect(
				notifyService.sendEmail({
					destinationEmail: 'test@example.com',
					templateId: 'template-id'
				})
			).rejects.toThrow('A reference must be set before an email can be sent.');
		});

		it('should log and throw an error if sendEmail fails', async () => {
			const error = new Error('sendEmail failed');
			notifyClient.sendEmail.mockRejectedValue(error);
			logger.error.mockClear();

			await expect(
				notifyService.sendEmail({
					destinationEmail: 'test@example.com',
					templateId: 'template-id',
					reference: 'reference'
				})
			).rejects.toThrow('sendEmail failed');

			expect(logger.error).toHaveBeenCalledWith({ err: error }, 'Problem sending email');
		});
	});

	describe('populateTemplate', () => {
		it('should populate the template with personalisation', () => {
			const templateName = 'test template 1';
			const templateContent = 'Hello ((name)) ((number)) [link title](((linkUrl)))';
			const personalisation = { name: 'John', number: 1, linkUrl: 'https://example.com' };
			const fsSpy = jest.spyOn(fs, 'readFileSync');
			fsSpy.mockReturnValueOnce(templateContent);

			const result = notifyService.populateTemplate(templateName, personalisation);

			expect(result).toBe('Hello John 1 [link title](https://example.com)');
		});

		it('should throw an error if personalisation value is not a string', () => {
			const templateName = 'test template 2';
			const templateContent = 'Hello ((name))';
			const personalisation = { name: [1, 2] };

			const fsSpy = jest.spyOn(fs, 'readFileSync');
			fsSpy.mockReturnValueOnce(templateContent);

			expect(() => notifyService.populateTemplate(templateName, personalisation)).toThrow(
				'value must be a string or number'
			);
		});

		it('should throw an error if personalisation parameters are missing', () => {
			const templateName = 'test template 3';
			const templateContent = 'Hello ((name))';
			const personalisation = {};

			const fsSpy = jest.spyOn(fs, 'readFileSync');
			fsSpy.mockReturnValueOnce(templateContent);

			expect(() => notifyService.populateTemplate(templateName, personalisation)).toThrow(
				'populateTemplate: personalisation parameters for test template 3 missing personalisation parameters: (name)'
			);
		});
	});

	describe('templates', () => {
		it('should verify all templates exist', () => {
			const templates = NotifyService.templates;
			const templateNames = Object.values(templates).flatMap(Object.values);

			templateNames.forEach((templateName) => {
				const templatePath = path.join(__dirname, 'templates', `${templateName}`);
				expect(() => fs.readFileSync(templatePath, { encoding: 'utf8' })).not.toThrow();
			});
		});

		it('should find missing params for each template', () => {
			const templates = NotifyService.templates;
			const templateNames = Object.values(templates).flatMap(Object.values);

			templateNames.forEach((templateName) => {
				expect(() => notifyService.populateTemplate(templateName, {})).toThrow(
					new RegExp(
						`^populateTemplate: personalisation parameters for ${templateName} missing personalisation parameters: `
					)
				);
			});
		});

		const whiteSpaceReplace = /\s+/g;
		const expectMessage = (result, expected) => {
			expect(result.replace(whiteSpaceReplace, ' ')).toEqual(
				expected.replace(whiteSpaceReplace, ' ')
			);
		};

		it('should populate appealSubmission.v1Initial ', () => {
			const template = NotifyService.templates.appealSubmission.v1Initial;
			const personalisation = { name: 'test-name', contactEmail: 'test email address' };

			const result = notifyService.populateTemplate(template, personalisation);
			expectMessage(
				result,
				`To ${personalisation.name}

			We have received your appeal.
			
			We will process your appeal and send a confirmation email. This will include:
			
			*your appeal reference number
			*a copy of your appeal form
			
			The Planning Inspectorate
			${personalisation.contactEmail}`
			);
		});

		it('should populate appealSubmission.v1FollowUp ', () => {
			const template = NotifyService.templates.appealSubmission.v1FollowUp;
			const personalisation = {
				appealReferenceNumber: 'abc',
				appealSiteAddress: 'd\ne\nf',
				lpaReference: 'ghi',
				pdfLink: 'test.pdf',
				lpaName: 'System Test',
				feedbackUrl: 'https://example.com/feedback',
				contactEmail: 'test email address'
			};

			const result = notifyService.populateTemplate(template, personalisation);
			expectMessage(
				result,
				`We have processed your appeal.

				#Appeal details
				^Appeal reference number: ${personalisation.appealReferenceNumber}
				Site address: ${personalisation.appealSiteAddress}
				Planning application reference: ${personalisation.lpaReference}
				
				#What happens next
				1. Download a copy of your appeal form ${personalisation.pdfLink}.
				2. [Find the email address for your local planning authority.](https://www.gov.uk/government/publications/sending-a-copy-of-the-appeal-form-to-the-council/sending-a-copy-to-the-council)
				3. Email the copy of your appeal form and the documents you uploaded to: ${personalisation.lpaName}.
				4. We will check and confirm that your appeal form has everything that we need.
				
				You must send a copy of your appeal form and documents to the local planning authority, it’s a legal requirement.
				
				#Give feedback
				[Give feedback on the appeals service](${personalisation.feedbackUrl}) (takes 2 minutes) 
				
				The Planning Inspectorate
				${personalisation.contactEmail}`
			);
		});
	});
});
