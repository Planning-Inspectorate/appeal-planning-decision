const AppealFixtures = require('../fixtures/appeals');
const HorizonCreateOrganisationRequestBodyExpectation = require('../external-dependencies/rest-apis/expectations/horizon/create-organisation-request-body');
const HorizonCreateContactRequestBodyExpectation = require('../external-dependencies/rest-apis/expectations/horizon/create-contact-request-body');
const HorizonCreateAppealRequestBodyExpectation = require('../external-dependencies/rest-apis/expectations/horizon/create-appeal-request-body');
const HorizonCreateAppealContactExpectation = require('../external-dependencies/rest-apis/expectations/horizon/create-appeal-contact');

module.exports = class HorizonIntegrationInputCondition {
	static get({
		description = 'a blank Horizon ID field',
		setHorizonIdFunction = (appeal) => (appeal.horizonId = ''),
		lpaCode = 'E69999999',
		horizonLpaCode = '',
		appeal = AppealFixtures.newHouseholderAppeal(),
		expectedContactRequests = [
			{
				firstName: 'Appellant',
				lastName: 'Name',
				email: 'test@example.com',
				type: 'Appellant',
				orgId: null
			}
		],
		expectedContactIdsInCreateAppealRequest = [`P_0`],
		expectedOrganisationNamesInCreateOrganisationRequests = [],
		expectedNameOnAppealSuccessfullySubmittedEmail = 'Appellant Name',
		expectedCaseworkReason = appeal.appealType == '1001'
			? null
			: '4. Granted planning permission for the development subject to conditions to which you object'
	} = {}) {
		const lpaExpectations = {
			code: lpaCode,
			country: lpaCode == 'W69999999' ? 'Wales' : 'England',
			name:
				lpaCode == 'W69999999'
					? 'System Test Borough Council Wales'
					: 'System Test Borough Council England',
			email: 'appealplanningdecisiontest@planninginspectorate.gov.uk'
		};

		let createContactInHorizonRequests = [];
		let createAppealRequestContacts = [];
		expectedContactRequests.forEach((expectedRequest, index) => {
			createContactInHorizonRequests.push(
				new HorizonCreateContactRequestBodyExpectation(
					expectedRequest.email,
					expectedRequest.firstName,
					expectedRequest.lastName,
					expectedRequest.orgId
				)
			);
			createAppealRequestContacts.push(
				new HorizonCreateAppealContactExpectation(
					expectedContactIdsInCreateAppealRequest[index],
					`${expectedRequest.firstName} ${expectedRequest.lastName}`,
					expectedRequest.type
				)
			);
		});

		let createOrganisationInHorizonRequests = [];
		expectedOrganisationNamesInCreateOrganisationRequests.forEach((name) => {
			createOrganisationInHorizonRequests.push(
				new HorizonCreateOrganisationRequestBodyExpectation(name)
			);
		});

		let condition = {
			description: description,
			setHorizonId: setHorizonIdFunction,
			lpa: lpaExpectations,
			appeal: appeal,
			expectations: {
				createOrganisationInHorizonRequests: createOrganisationInHorizonRequests,
				createContactInHorizonRequests: createContactInHorizonRequests,
				createAppealInHorizonRequest: {}, // Populated later
				emailToAppellant: {
					name: expectedNameOnAppealSuccessfullySubmittedEmail
				},
				emailToLpa: {
					templateVariables: []
				}
			}
		};

		/////////////////////////////////////////////////////////////
		///// Create and attach appeal request body expectation /////
		/////////////////////////////////////////////////////////////

		let caseSiteOwnershipCertificateValue = null;
		if (
			(appeal.appealType == '1001' && appeal.appealSiteSection.siteOwnership.ownsWholeSite) ||
			(appeal.appealType == '1005' && appeal.appealSiteSection.siteOwnership.ownsAllTheLand)
		) {
			caseSiteOwnershipCertificateValue = 'Certificate A';
		}

		condition.expectations.createAppealInHorizonRequest =
			new HorizonCreateAppealRequestBodyExpectation(
				appeal.appealType == '1001' ? 'Householder (HAS) Appeal' : 'Planning Appeal (W)',
				horizonLpaCode,
				lpaCode == 'W69999999' ? 'Wales' : 'England',
				expectedCaseworkReason,
				appeal.decisionDate,
				appeal.appealType == '1001' ? 'Written Representations' : 'Hearing',
				caseSiteOwnershipCertificateValue,
				createAppealRequestContacts
			);

		/////////////////////////////////////
		///// Setup Notify expectations /////
		/////////////////////////////////////

		const dateRegex = new RegExp(
			/\d{2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}/
		);
		if (appeal.appealType == '1001') {
			condition.expectations.emailToLpa.templateVariables.push({ LPA: lpaExpectations.name });
			condition.expectations.emailToLpa.templateVariables.push({ date: dateRegex });
		} else if (appeal.appealType == '1005') {
			condition.expectations.emailToLpa.templateVariables.push({
				'loca planning department': lpaExpectations.name
			});
			condition.expectations.emailToLpa.templateVariables.push({ 'submission date': dateRegex });
			condition.expectations.emailToLpa.templateVariables.push({ refused: new RegExp(/yes|no/) });
			condition.expectations.emailToLpa.templateVariables.push({ granted: new RegExp(/yes|no/) });
			condition.expectations.emailToLpa.templateVariables.push({
				'non-determination': new RegExp(/yes|no/)
			});
		}

		return condition;
	}
};
