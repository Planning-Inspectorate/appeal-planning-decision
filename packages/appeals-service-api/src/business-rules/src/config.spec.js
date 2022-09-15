const { format } = require('date-fns');
const config = require('./config');
const constants = require('./constants');
const householderAppeal = require('../test/data/householder-appeal');
const fullAppeal = require('../test/data/full-appeal');
const formatAddress = require('./utils/format-address');

describe('config', () => {
	const { APPEAL_ID, APPLICATION_DECISION } = constants;
	const lpa = {
		email: 'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
		name: 'System Test Borough Council'
	};

	process.env.APP_APPEALS_BASE_URL = 'http://localhost';
	fullAppeal.submissionDate = new Date();

	it('should return the correct appellant email config for a householder appeal', () => {
		const result = config.appeal.type[APPEAL_ID.HOUSEHOLDER].email.appellant(
			householderAppeal,
			lpa
		);

		expect(result).toEqual({
			recipientEmail: householderAppeal.email,
			variables: {
				name: householderAppeal.aboutYouSection.yourDetails.name,
				'appeal site address': formatAddress(householderAppeal.appealSiteSection.siteAddress),
				'local planning department': lpa.name,
				'pdf copy URL': `${process.env.APP_APPEALS_BASE_URL}/document/${householderAppeal.id}/${householderAppeal.appealSubmission.appealPDFStatement.uploadedFile.id}`
			},
			reference: householderAppeal.id
		});
	});

	it('should return the correct lpa email config for a householder appeal', () => {
		const result = config.appeal.type[APPEAL_ID.HOUSEHOLDER].email.lpa(householderAppeal, lpa);

		expect(result).toEqual({
			recipientEmail: lpa.email,
			variables: {
				LPA: lpa.name,
				date: format(householderAppeal.submissionDate, 'dd MMMM yyyy'),
				'planning application number': householderAppeal.planningApplicationNumber,
				'site address': formatAddress(householderAppeal.appealSiteSection.siteAddress)
			},
			reference: householderAppeal.id
		});
	});

	it('should return the correct appellant email config for a full appeal', () => {
		const result = config.appeal.type[APPEAL_ID.PLANNING_SECTION_78].email.appellant(
			fullAppeal,
			lpa
		);

		expect(result).toEqual({
			recipientEmail: fullAppeal.email,
			variables: {
				name: fullAppeal.contactDetailsSection.contact.name,
				'appeal site address': formatAddress(fullAppeal.appealSiteSection.siteAddress),
				'local planning department': lpa.name,
				'link to pdf': `${process.env.APP_APPEALS_BASE_URL}/document/${fullAppeal.id}/${fullAppeal.appealSubmission.appealPDFStatement.uploadedFile.id}`
			},
			reference: fullAppeal.id
		});
	});

	it('should return the correct lpa email config for a full appeal when application decision = `granted`', () => {
		const result = config.appeal.type[APPEAL_ID.PLANNING_SECTION_78].email.lpa(fullAppeal, lpa);

		expect(result).toEqual({
			recipientEmail: lpa.email,
			variables: {
				'loca planning department': lpa.name,
				'submission date': format(fullAppeal.submissionDate, 'dd MMMM yyyy'),
				'planning application number': fullAppeal.planningApplicationNumber,
				'site address': formatAddress(fullAppeal.appealSiteSection.siteAddress),
				refused: 'no',
				granted: 'yes',
				'non-determination': 'no'
			},
			reference: fullAppeal.id
		});
	});

	it('should return the correct lpa email config for a full appeal when application decision = `refused`', () => {
		fullAppeal.eligibility.applicationDecision = APPLICATION_DECISION.REFUSED;

		const result = config.appeal.type[APPEAL_ID.PLANNING_SECTION_78].email.lpa(fullAppeal, lpa);

		expect(result).toEqual({
			recipientEmail: lpa.email,
			variables: {
				'loca planning department': lpa.name,
				'submission date': format(fullAppeal.submissionDate, 'dd MMMM yyyy'),
				'planning application number': fullAppeal.planningApplicationNumber,
				'site address': formatAddress(fullAppeal.appealSiteSection.siteAddress),
				refused: 'yes',
				granted: 'no',
				'non-determination': 'no'
			},
			reference: fullAppeal.id
		});
	});

	it('should return the correct lpa email config for a full appeal when application decision = `nodecisionreceived`', () => {
		fullAppeal.eligibility.applicationDecision = APPLICATION_DECISION.NODECISIONRECEIVED;

		const result = config.appeal.type[APPEAL_ID.PLANNING_SECTION_78].email.lpa(fullAppeal, lpa);

		expect(result).toEqual({
			recipientEmail: lpa.email,
			variables: {
				'loca planning department': lpa.name,
				'submission date': format(fullAppeal.submissionDate, 'dd MMMM yyyy'),
				'planning application number': fullAppeal.planningApplicationNumber,
				'site address': formatAddress(fullAppeal.appealSiteSection.siteAddress),
				refused: 'no',
				granted: 'no',
				'non-determination': 'yes'
			},
			reference: fullAppeal.id
		});
	});

	it('should return correct confirmEmail config for full appeal', () => {
		const result = config.appeal.type[APPEAL_ID.PLANNING_SECTION_78].email.confirmEmail(
			fullAppeal,
			process.env.APP_APPEALS_BASE_URL
		);
		expect(result).toEqual({
			recipientEmail: fullAppeal.email,
			reference: fullAppeal.id,
			variables: {
				link: 'http://localhost/full-appeal/submit-appeal/email-address-confirmed'
			}
		});
	});
	it('should return correct confirmEmail config for householder appeal', () => {
		const result = config.appeal.type[APPEAL_ID.HOUSEHOLDER].email.confirmEmail(
			householderAppeal,
			process.env.APP_APPEALS_BASE_URL
		);
		expect(result).toEqual({
			recipientEmail: householderAppeal.email,
			reference: householderAppeal.id,
			variables: { link: 'http://localhost/appeal-householder-decision/email-address-confirmed' }
		});
	});
});
