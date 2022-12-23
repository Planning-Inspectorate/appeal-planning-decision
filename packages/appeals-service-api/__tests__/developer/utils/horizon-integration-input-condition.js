const jp = require('jsonpath');
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

		const appealDocuments = [
			// Due to the current data structures of different appeals, we need to
			// be agnostic of differences between them in order to ensure test
			// correctness. Hence, we use JSONPath here to grab `uploadedFile` and
			// `uploadedFiles` keys from the appeal used in the test condition. Note
			// that we flatten the arrays returned since, in some curcumstances, these
			// queries will return arrays of arrays.
			...jp.query(appeal, '$..uploadedFile').flat(Infinity),
			...jp.query(appeal, '$..uploadedFiles').flat(Infinity)
		];

		let createAppealRequestContacts = [
			new HorizonCreateAppealContactExpectation('P_0', 'Appellant Name', 'Appellant')
		];

		let condition = {
			description: description,
			setHorizonId: setHorizonIdFunction,
			lpa: lpaExpectations,
			appeal: {
				actual: appeal,
				documents: appealDocuments
			},
			expectations: {
				createOrganisationInHorizonRequests: [
					new HorizonCreateOrganisationRequestBodyExpectation(
						appeal.appealType == '1001'
							? { '__i:nil': 'true' }
							: appeal.contactDetailsSection.contact.companyName
					)
				],
				createContactInHorizonRequests: [
					new HorizonCreateContactRequestBodyExpectation(
						'test@pins.com',
						'Appellant',
						'Name',
						`O_0`
					)
				],
				createAppealInHorizonRequest: {}, // Populated later
				emailToAppellant: {
					name: 'Appellant Name'
				},
				emailToLpa: {
					templateVariables: []
				}
			}
		};

		/////////////////////////////////////////////////////////////////////////
		///// Update contact expectations if there's an agent on the appeal /////
		/////////////////////////////////////////////////////////////////////////

		const agentIsSpecifiedInAppeal =
			appeal.appealType == '1001'
				? !appeal.aboutYouSection.yourDetails.isOriginalApplicant
				: !appeal.contactDetailsSection.isOriginalApplicant;
		if (agentIsSpecifiedInAppeal) {
			// For a householder appeal, the second create org request issued should not
			// have an organisation name either. No idea why, it was like that when we got here.
			condition.expectations.createOrganisationInHorizonRequests.push(
				new HorizonCreateOrganisationRequestBodyExpectation({ '__i:nil': 'true' })
			);

			if (appeal.appealType == '1005') {
				// The first expected create org request will be for the appellant, the second will be for the agent
				condition.expectations.createOrganisationInHorizonRequests[0] =
					new HorizonCreateOrganisationRequestBodyExpectation(
						appeal.contactDetailsSection.appealingOnBehalfOf.companyName
					);
				condition.expectations.createOrganisationInHorizonRequests[1] =
					new HorizonCreateOrganisationRequestBodyExpectation(
						appeal.contactDetailsSection.contact.companyName
					);
			}

			// The first create contact request will be for the appellant, but their email isn't collected now
			condition.expectations.createContactInHorizonRequests[0] =
				new HorizonCreateContactRequestBodyExpectation(
					{ '__i:nil': 'true' },
					'Appellant',
					'Name',
					`O_0`
				);

			// The second create contact request will be for the ahent, and their email is collected
			condition.expectations.createContactInHorizonRequests.push(
				new HorizonCreateContactRequestBodyExpectation('test@pins.com', 'Agent', 'Name', 'O_1')
			);

			// There'll now be another contact added to the create appeal request
			createAppealRequestContacts.push(
				new HorizonCreateAppealContactExpectation('P_1', 'Agent Name', 'Agent')
			);

			// The email to the appellant will now contain the ahgen't name, instead of the appeallant's.
			condition.expectations.emailToAppellant.name = 'Agent Name';
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
				lpaCode,
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
