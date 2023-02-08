import { Interaction } from './interaction';
import { JsonPathExpression } from '../json-path-expression';
import app from '../../../../../src/app';
const appConfiguration = require('../../../../../src/configuration/config');

export class NotifyInteraction {
	static getAppealSubmittedEmailForAppellantInteraction(
		appeal: any,
		appellantName: string,
		lpaName: string
	): Interaction {
		return new Interaction('Send appeal successfully submitted email to appellant')
			.setNumberOfKeysExpectedInJson(8)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.template_id'),
				appConfiguration.services.notify.templates[appeal.appealType]
					.appealSubmissionConfirmationEmailToAppellant
			)
			.addJsonValueExpectation(JsonPathExpression.create('$.email_address'), appeal.email)
			.addJsonValueExpectation(JsonPathExpression.create('$.reference'), appeal.id)
			.addJsonValueExpectation(JsonPathExpression.create('$.personalisation.name'), appellantName)
			.addJsonValueExpectation(
				JsonPathExpression.create("$.personalisation['appeal site address']"),
				appeal.appealSiteSection.siteAddress.addressLine1 +
					'\n' +
					appeal.appealSiteSection.siteAddress.addressLine2 +
					'\n' +
					appeal.appealSiteSection.siteAddress.town +
					'\n' +
					appeal.appealSiteSection.siteAddress.county +
					'\n' +
					appeal.appealSiteSection.siteAddress.postcode
			)
			.addJsonValueExpectation(
				JsonPathExpression.create("$.personalisation['local planning department']"),
				lpaName
			)
			.addJsonValueExpectation(
				JsonPathExpression.create("$.personalisation['link to pdf']"),
				`${process.env.APP_APPEALS_BASE_URL}/document/${appeal.id}/${appeal.appealSubmission.appealPDFStatement.uploadedFile.id}`
			);
	}

	static getFailureToUploadToHorizonEmailInteraction(appealId: any): Interaction {
		return new Interaction('Send failure to submit to Horizon email to admin')
			.setNumberOfKeysExpectedInJson(5)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.template_id'),
				appConfiguration.services.notify.templates.ERROR_MONITORING.failureToUploadToHorizon
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.email_address'),
				appConfiguration.services.notify.emails.adminMonitoringEmail
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.reference'),
				`${appealId}-${new Date().toISOString}`
			)
			.addJsonValueExpectation(JsonPathExpression.create('$.personalisation.id'), appealId);
	}

	static getAppealSubmittedEmailForLpaInteraction(
		appeal: any,
		lpaName: string,
		lpaEmail: string
	): Interaction {
		const templateVariables: any[] = [];
		const dateRegex = new RegExp(
			/\d{2} (January|February|March|April|May|June|July|August|SeptemberOctober|November|December) \d{4}/
		);

		if (appeal.appealType == '1001') {
			templateVariables.push({ LPA: lpaName });
			templateVariables.push({ date: dateRegex });
		} else if (appeal.appealType == '1005') {
			templateVariables.push({
				'loca planning department': lpaName
			});
			templateVariables.push({ 'submission date': dateRegex });
			templateVariables.push({ refused: new RegExp(/yes|no/) });
			templateVariables.push({ granted: new RegExp(/yes|no/) });
			templateVariables.push({
				'non-determination': new RegExp(/yes|no/)
			});
		}

		const emailToLpaInteraction = new Interaction('Send appeal successfully submitted email to LPA')
			.setNumberOfKeysExpectedInJson(6 + templateVariables.length)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.template_id'),
				appConfiguration.services.notify.templates[appeal.appealType].appealNotificationEmailToLpa
			)
			.addJsonValueExpectation(JsonPathExpression.create('$.email_address'), lpaEmail)
			.addJsonValueExpectation(JsonPathExpression.create('$.reference'), appeal.id)
			.addJsonValueExpectation(
				JsonPathExpression.create("$.personalisation['planning application number']"),
				appeal.planningApplicationNumber
			)
			.addJsonValueExpectation(
				JsonPathExpression.create("$.personalisation['site address']"),
				appeal.appealSiteSection.siteAddress.addressLine1 +
					'\n' +
					appeal.appealSiteSection.siteAddress.addressLine2 +
					'\n' +
					appeal.appealSiteSection.siteAddress.town +
					'\n' +
					appeal.appealSiteSection.siteAddress.county +
					'\n' +
					appeal.appealSiteSection.siteAddress.postcode
			);

		templateVariables.forEach((templateVariableExpectation) => {
			Object.keys(templateVariableExpectation).forEach((key) => {
				emailToLpaInteraction.addJsonValueExpectation(
					JsonPathExpression.create(`$.personalisation['${key}']`),
					templateVariableExpectation[key]
				);
			});
		});

		return emailToLpaInteraction;
	}
}
