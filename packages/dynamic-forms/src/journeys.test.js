const { Journeys } = require('./journeys');

describe('Journeys', () => {
	let journeys;

	beforeEach(() => {
		journeys = new Journeys();
	});

	describe('registerJourney', () => {
		it('registers a journey', () => {
			const journeyParams = { journeyId: 'test-journey' };
			journeys.registerJourney(journeyParams);
			expect(journeys.getRegisteredJourneyIds()).toContain('test-journey');
		});

		it('throws an error if a journey with the same id is already registered', () => {
			const journeyParams = { journeyId: 'test-journey' };
			journeys.registerJourney(journeyParams);
			expect(() => journeys.registerJourney(journeyParams)).toThrow(
				'A journey with id test-journey has already been registered'
			);
		});
	});

	describe('getRegisteredJourneyIds', () => {
		it('returns an array of registered journey ids', () => {
			const journeyParams1 = { journeyId: 'journey-1' };
			const journeyParams2 = { journeyId: 'journey-2' };
			journeys.registerJourney(journeyParams1);
			journeys.registerJourney(journeyParams2);
			const registeredIds = journeys.getRegisteredJourneyIds();
			expect(registeredIds).toContain('journey-1');
			expect(registeredIds).toContain('journey-2');
		});
	});

	describe('getJourney', () => {
		it('returns a Journey instance for a registered journey', () => {
			const journeyParams = {
				journeyId: 'test-journey',
				makeBaseUrl: () => 'test',
				journeyTemplate: 'test',
				listingPageViewPath: 'test',
				journeyTitle: 'test',
				makeSections: () => []
			};
			journeys.registerJourney(journeyParams);
			const journeyResponse = { journeyId: 'test-journey', responseData: 'data' };
			const journey = journeys.getJourney(journeyResponse);
			expect(journey).toBeDefined();
			expect(journey.journeyId).toEqual(journeyResponse.journeyId);
		});

		it('returns a Journey instance for a registered journey', () => {
			expect(() => journeys.getJourney({ journeyId: 'test-journey' })).toThrow(
				'No journey with id test-journey has been registered'
			);
		});
	});
});
