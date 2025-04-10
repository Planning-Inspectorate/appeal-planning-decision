const Interaction = require('./interaction');
const JsonPathExpression = require('../json-path-expression');
const appConfiguration = require('../../../../../src/configuration/config');

module.exports = class NotifyInteraction {
	static getAppealSubmittedEmailForAppellantInteraction(appeal, appellantName) {
		return new Interaction('Send appeal successfully submitted email to appellant')
			.setNumberOfKeysExpectedInJson(6)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.template_id'),
				appConfiguration.services.notify.templates.generic
			)
			.addJsonValueExpectation(JsonPathExpression.create('$.email_address'), appeal.email)
			.addJsonValueExpectation(JsonPathExpression.create('$.reference'), appeal.id)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.personalisation.subject'),
				'We have received your appeal'
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.personalisation.content'),
				new RegExp(appellantName)
			);
	}

	static getAppealReceivedEmailForAppellantInteraction(appeal, lpaName) {
		return new Interaction('Send appeal successfully received email to appellant')
			.setNumberOfKeysExpectedInJson(6)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.template_id'),
				appConfiguration.services.notify.templates.generic
			)
			.addJsonValueExpectation(JsonPathExpression.create('$.email_address'), appeal.email)
			.addJsonValueExpectation(JsonPathExpression.create('$.reference'), appeal.id)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.personalisation.subject'),
				`We have processed your appeal: ${appeal.horizonIdFull}`
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.personalisation.content'),
				new RegExp(appeal.horizonIdFull)
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.personalisation.content'),
				new RegExp(
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
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.personalisation.content'),
				new RegExp(lpaName)
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.personalisation.content'),
				new RegExp(
					`${process.env.APP_APPEALS_BASE_URL}/document/${appeal.id}/${appeal.appealSubmission.appealPDFStatement.uploadedFile.id}`
				)
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.personalisation.content'),
				new RegExp(appeal.planningApplicationNumber)
			);
	}

	static getFailureToUploadToHorizonEmailInteraction(appealId) {
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

	static getAppealSubmittedEmailForLpaInteraction(appeal, lpaName, lpaEmail) {
		const templateVariables = [];
		const dateRegex = new RegExp(
			/\d{2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}/
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
		templateVariables.push({ 'appeal reference': appeal.horizonId ?? 'ID not provided' });

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
};
