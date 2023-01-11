const AppealFixtures = require('../fixtures/appeals');
const {
	HorizonCreateOrganisationRequestBodyExpectation
} = require('../external-dependencies/rest-apis/expectations/horizon/create-organisation-request-body');
const {
	HorizonCreateContactRequestBodyExpectation
} = require('../external-dependencies/rest-apis/expectations/horizon/create-contact-request-body');
const {
	HorizonCreateAppealRequestBodyExpectation
} = require('../external-dependencies/rest-apis/expectations/horizon/create-appeal-request-body');
const {
	HorizonCreateAppealContactExpectation
} = require('../external-dependencies/rest-apis/expectations/horizon/create-appeal-contact');

class HorizonIntegrationInputCondition {
	#appealFixtures = new AppealFixtures();

	get({
		description = 'a blank Horizon ID field',
		setHorizonIdFunction = (appeal) => (appeal.horizonId = ''),
		lpaCode = 'E69999999',
		horizonLpaCode = '',
		appeal = this.#appealFixtures.newHouseholderAppeal(),
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

		let createAppealRequestContacts = [
			new HorizonCreateAppealContactExpectation('P_0', 'Appellant Name', 'Appellant')
		];

		let condition = {
			description: description,
			setHorizonId: setHorizonIdFunction,
			lpa: lpaExpectations,
			appeal: appeal,
			expectations: {
				createOrganisationInHorizonRequests: [],
				createContactInHorizonRequests: [],
				createAppealInHorizonRequest: {}, // Populated later
				emailToAppellant: {
					name: 'Appellant Name'
				},
				emailToLpa: {
					templateVariables: []
				}
			}
		};

		///////////////////////////////////////
		///// Update contact expectations /////
		///////////////////////////////////////

		condition.expectations.createContactInHorizonRequests[0] = new HorizonCreateContactRequestBodyExpectation(
			'test@pins.com',
			'Appellant',
			'Name'
		)

		const agentIsSpecifiedInAppeal =
			appeal.appealType == '1001'
				? !appeal.aboutYouSection.yourDetails.isOriginalApplicant
				: !appeal.contactDetailsSection.isOriginalApplicant;
		if (agentIsSpecifiedInAppeal) {
			// The first create contact request will be for the appellant, but their email isn't collected now
			condition.expectations.createContactInHorizonRequests[0] =
				new HorizonCreateContactRequestBodyExpectation(
					{ '__i:nil': 'true' },
					'Appellant',
					'Name'
				);

			// The second create contact request will be for the agent, and their email is collected
			condition.expectations.createContactInHorizonRequests.push(
				new HorizonCreateContactRequestBodyExpectation('test@pins.com', 'Agent', 'Name')
			);

			// There'll now be another contact added to the create appeal request
			createAppealRequestContacts.push(
				new HorizonCreateAppealContactExpectation('P_1', 'Agent Name', 'Agent')
			);

			// The email to the appellant will now contain the agent's name, instead of the appeallant's.
			condition.expectations.emailToAppellant.name = 'Agent Name';
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////////
		///// Update create organisation expectations if company names for agent/appellant are specified /////
		//////////////////////////////////////////////////////////////////////////////////////////////////////

		if (appeal.appealType == '1005') {

			let organisationsDefinedInAppeal = [];

			if (appeal.contactDetailsSection.contact.companyName) {
				organisationsDefinedInAppeal.push(appeal.contactDetailsSection.contact.companyName);
				condition.expectations.createContactInHorizonRequests[0].setOrganisationId('O_0')
			}
			
			if (appeal.contactDetailsSection?.appealingOnBehalfOf?.companyName) {
				organisationsDefinedInAppeal.push(appeal.contactDetailsSection?.appealingOnBehalfOf.companyName)
				condition.expectations.createContactInHorizonRequests[1].setOrganisationId('O_1')
			}

			condition.expectations.createOrganisationInHorizonRequests = organisationsDefinedInAppeal
				.filter(orgName => orgName) // Filter out nulls
				.map(orgName => new HorizonCreateOrganisationRequestBodyExpectation(orgName))
				.reverse() // the original appellant should always be created first
		}

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
			/\d{2} (January|February|March|April|May|June|July|August|SeptemberOctober|November|December) \d{4}/
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
}

module.exports = HorizonIntegrationInputCondition;
