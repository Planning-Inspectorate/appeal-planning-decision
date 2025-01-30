const { commentSubmittedGet } = require('./controller');
const {
	checkInterestedPartySessionCaseReferenceSet,
	getInterestedPartyFromSession,
	resetInterestedPartySession,
	checkIfInterestedPartySessionSubmitted
} = require('../../../../services/interested-party.service');

jest.mock('../../../../services/interested-party.service');

describe('commentSubmittedGet Controller Tests', () => {
	let req, res;

	beforeEach(() => {
		req = {
			session: {}
		};
		res = {
			render: jest.fn(),
			redirect: jest.fn()
		};
	});

	it('should redirect to enter-appeal-reference if case reference is not set', () => {
		checkInterestedPartySessionCaseReferenceSet.mockReturnValue(false);

		commentSubmittedGet(req, res);

		expect(checkInterestedPartySessionCaseReferenceSet).toHaveBeenCalledWith(req);
		expect(res.redirect).toHaveBeenCalledWith('enter-appeal-reference');
	});

	it('should redirect to check-answers if session is not submitted', () => {
		checkInterestedPartySessionCaseReferenceSet.mockReturnValue(true);
		checkIfInterestedPartySessionSubmitted.mockReturnValue(false);

		commentSubmittedGet(req, res);

		expect(checkInterestedPartySessionCaseReferenceSet).toHaveBeenCalledWith(req);
		expect(checkIfInterestedPartySessionSubmitted).toHaveBeenCalledWith(req);
		expect(res.redirect).toHaveBeenCalledWith('check-answers');
	});

	it('should render the comment-submitted page with interestedParty and reset session', () => {
		const interestedParty = { firstName: 'John', lastName: 'Doe' };
		checkInterestedPartySessionCaseReferenceSet.mockReturnValue(true);
		checkIfInterestedPartySessionSubmitted.mockReturnValue(true);
		getInterestedPartyFromSession.mockReturnValue(interestedParty);

		commentSubmittedGet(req, res);

		expect(checkInterestedPartySessionCaseReferenceSet).toHaveBeenCalledWith(req);
		expect(checkIfInterestedPartySessionSubmitted).toHaveBeenCalledWith(req);
		expect(getInterestedPartyFromSession).toHaveBeenCalledWith(req);
		expect(resetInterestedPartySession).toHaveBeenCalledWith(req);
		expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/comment-submitted/index', {
			interestedParty
		});
	});
});
