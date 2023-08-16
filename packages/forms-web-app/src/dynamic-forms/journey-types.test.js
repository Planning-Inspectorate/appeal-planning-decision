const {
	JOURNEY_TYPES,
	getJourney,
	getJourneyResponseByType,
	saveResponseToSessionByType
} = require('./journey-types');

const { HasJourney } = require('./has-questionnaire/journey');
const { JourneyResponse } = require('./journey-response');

const { mockReq } = require('../../__tests__/unit/mocks');

describe('journey-types', () => {
	let req;

	beforeEach(() => {
		jest.resetAllMocks();
		req = {
			...mockReq(),
			session: {},
			query: {}
		};
	});

	describe('getJourney', () => {
		it('should create a journey based on the journeyId', () => {
			const jouney = getJourney({
				journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE
			});

			expect(jouney instanceof HasJourney).toBe(true);
		});

		it('should error if an invalid journey type is used', () => {
			expect(() =>
				getJourney({
					journeyId: 'nope'
				})
			).toThrow('invalid journey type');
		});
	});

	describe('getJourneyResponseByType', () => {
		it('should get response from session if available', () => {
			req.session.lpaAnswers = { a: 1 };
			const response = getJourneyResponseByType(req, JOURNEY_TYPES.HAS_QUESTIONNAIRE, 'test');
			expect(response).toBe(req.session.lpaAnswers);
		});

		it('should return default response if no session data', () => {
			const response = getJourneyResponseByType(req, JOURNEY_TYPES.HAS_QUESTIONNAIRE, 'test');
			expect(response instanceof JourneyResponse).toBe(true);
		});

		it('should error if an invalid journey type is used', () => {
			expect(() => getJourneyResponseByType(req, 'nope', 'test')).toThrow('invalid journey type');
		});
	});

	describe('saveResponseToSessionByType', () => {
		it('should save journey response to session', () => {
			const testResponse = {
				journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE,
				test: 'data'
			};
			saveResponseToSessionByType(req, testResponse);

			expect(req.session.lpaAnswers).toBe(testResponse);
		});

		it('should error if an invalid journey type is used', () => {
			expect(() =>
				saveResponseToSessionByType(req, {
					journeyId: 'nope'
				})
			).toThrow('invalid journey type');
		});
	});
});
