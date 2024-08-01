const checkInterestedPartySessionActive = require('./check-ip-session-set');
const { mockRes } = require('../../../__tests__/unit/mocks');
const {
	VIEW: {
		INTERESTED_PARTY_COMMENTS: { ENTER_APPEAL_REFERENCE }
	}
} = require('../../lib/views');

describe('interested party session check middleware ', () => {
	let res;
	let next;

	beforeEach(() => {
		res = mockRes();
		next = jest.fn();
		jest.resetAllMocks();
	});

	it('should call next if a case reference has been set and the comment has not been submitted', () => {
		const goodReq = {
			session: {
				interestedParty: {
					caseReference: '1234567',
					submitted: false
				}
			}
		};

		checkInterestedPartySessionActive(goodReq, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('should redirect if a case reference has been not been set', () => {
		const noCaseRefReq = {
			session: {
				interestedParty: {
					submitted: false
				}
			}
		};

		checkInterestedPartySessionActive(noCaseRefReq, res, next);

		expect(res.redirect).toHaveBeenCalledWith(`/${ENTER_APPEAL_REFERENCE}`);
	});

	it('should redirect if the comment has already been submitted', () => {
		const submittedReq = {
			session: {
				interestedParty: {
					caseReference: '1234567',
					submitted: true
				}
			}
		};

		checkInterestedPartySessionActive(submittedReq, res, next);

		expect(res.redirect).toHaveBeenCalledWith(`/${ENTER_APPEAL_REFERENCE}`);
	});
});
